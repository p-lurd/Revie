import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Review, ReviewDocument, ReviewModelName } from './schema/review.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(ReviewModelName) private reviewModel: Model<ReviewDocument>,
  ){}
  async create(createReviewDto: CreateReviewDto) {
    try {
      const review = await this.reviewModel.create(createReviewDto);
      return review;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll(
    sortByDate?: 'asc' | 'desc',
    sortByHelpful?: 'asc' | 'desc',
  ): Promise<Review[]> {
    try {
      const sortOptions: Record<string, 1 | -1> = {};
      if (sortByDate) {
        sortOptions.createdAt = sortByDate === 'desc' ? -1 : 1;
      }
      if (sortByHelpful) {
        sortOptions.helpfulVotes = sortByHelpful === 'desc' ? -1 : 1;
      }
      if (Object.keys(sortOptions).length === 0) {
        sortOptions.createdAt = -1;
      }

      return await this.reviewModel.find().sort(sortOptions).exec();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch reviews: ' + error.message);
    }
  }

  async updateVotes(id: string, vote: number): Promise<Review> {
    try {
      // Validate ID format
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid review ID format');
      }
      const updatedReview = await this.reviewModel.findByIdAndUpdate(
        {_id: id},
        { $inc: { helpfulVotes: vote } },
        { new: true, runValidators: true }
      );

      if (!updatedReview) {
        throw new NotFoundException(`Review with ID ${id} not found`);
      }

      return updatedReview;
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update review votes: ' + error.message);
    }
  }

}
