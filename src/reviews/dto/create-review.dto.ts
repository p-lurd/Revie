export class CreateReviewDto {
    review: string;
    landlordName?: string;
    Area: string;
    userId: string;
    helpfulVotes?: number;
    videoUrl?: string;
    imageUrl?: string;
}
