import { ObjectId } from "mongoose";

export interface ISurveyCompleted {
    name: string;
    offerId: ObjectId;
    userId: ObjectId;
    offerStatus: "active" | "inactive";
    points: number;
    network: ObjectId;
    category: ObjectId;
    surveyPartner?: string;
    rewardStatus: "completed" | "failed";
    createdAt?: Date;
    updatedAt?: Date;
}
