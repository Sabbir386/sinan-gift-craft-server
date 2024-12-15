import mongoose, { Schema, Document } from "mongoose";

export interface ISocialMediaPost extends Document {
    userName: string;
    email: string;
    userId: string;
    link: string;
    platform: string;
    status: 'completed' | 'pending' | 'invalid-link';
}

const SocialMediaPostSchema: Schema = new Schema(
    {
        userName: { type: String, required: true },
        email: { type: String, required: true },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        link: { type: String, required: true },
        platform: { type: String, required: true },
        rewardPoint: { type: String, required: true },
        status: {
            type: String,
            enum: ['completed', 'pending', 'invalid-link'],
            default: 'pending'
        },
    },
    { timestamps: true }
);

export default mongoose.model<ISocialMediaPost>("SocialMediaPost", SocialMediaPostSchema);
