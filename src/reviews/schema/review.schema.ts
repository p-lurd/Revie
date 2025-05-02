import * as mongoose from 'mongoose';
 
// schema
export const ReviewSchema = new mongoose.Schema({
    review: { type: String, required: true },
    landlordName: { type: String, required: false},
    Area: { type: String, unique: false},
    userId: { type: String, required: true },
    helpfulVotes: { type: Number, required: false, default: 0 },
    videoUrl: { type: String, required: false},
    imageUrl: { type: String, required: false},
}, {
    timestamps: true,
});

export interface Review {
    review: string;
    landlordName?: string;
    Area: string;
    userId: String;
    createdAt: Date;
    helpfulVotes?: number;
    videoUrl?: string;
    imageUrl?: string;
}

// model name
export const ReviewModelName = 'Review';

export type ReviewDocument = Review & mongoose.Document;