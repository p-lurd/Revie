import { Controller, Get, Post, Body, Patch, Param, Delete, Query, BadRequestException } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(createReviewDto);
  }

  @Get()
  findAll(
    @Query('sortByDate') sortByDate?: 'asc' | 'desc',
    @Query('sortByHelpful') sortByHelpful?: 'asc' | 'desc',
  ) {
    return this.reviewsService.findAll(sortByDate, sortByHelpful);
  }

  @Patch(':id/vote')
  update(@Param('id') id: string, @Body('vote') vote: number) {
    if (vote !== 1 && vote !== -1) {
      throw new BadRequestException('Vote value must be 1 (upvote) or -1 (downvote)');
    }
    return this.reviewsService.updateVotes(id, vote);
  }
}
