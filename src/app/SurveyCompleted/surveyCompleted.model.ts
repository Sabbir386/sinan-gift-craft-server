import mongoose, { Schema, model } from "mongoose";
import { ISurveyCompleted } from "./surveyCompleted.interface";


const surveyCompletedSchema = new Schema<ISurveyCompleted>(
    {
        name: { type: String, required: true },
        offerId: { type: Schema.Types.ObjectId, ref: "Offer", required: true },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        offerStatus: { type: String, enum: ["active", "inactive"], default: "active" },
        points: { type: Number, required: true },
        network: { type: Schema.Types.ObjectId, ref: "Network", required: true },
        category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
        surveyPartner: { type: String },
        rewardStatus: { type: String, enum: ["completed", "failed"], default: "completed" },
    },
    { timestamps: true }
);

export const SurveyCompleted = model<ISurveyCompleted>("SurveyCompleted", surveyCompletedSchema);
