import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { UsersModule } from 'src/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewSchema } from './schema/review.schema';

@Module({
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: 'Review', schema: ReviewSchema }]),
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
