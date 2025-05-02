import * as mongoose from 'mongoose';
 
// Schema
export const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: false}
}, {
    timestamps: true,
});

export interface User {
    name: string;
    email: string; 
    password?: string;
    createdAt: Date;  
}
export const UserModelName = 'User';

export type UserDocument = User & mongoose.Document;