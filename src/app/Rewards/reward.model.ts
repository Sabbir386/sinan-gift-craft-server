import { Schema, model, Document } from "mongoose";

// Define the interface for the Reward document
interface IReward extends Document {
    userId: Schema.Types.ObjectId;
    claimedDays: { day: number; month: string }[];
    loginRewards: number;
    claimCount: number;
    taskCompletedRewards: number;
    taskClaimCount: number;
    surveyCompletedRewards: number;
    offerCompletedRewards: number;
    socialMediaRewards: number;
    signUpBonus: number;
    referralRewards: number; // New field for referral rewards
    referralClaimCount: number; // New field for referral claim count
    referralCommissionRewards: number; // New field for referral claim count
}

// Define the schema for the Reward model
const rewardSchema = new Schema<IReward>({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    claimedDays: [
        {
            day: {
                type: Number,
                required: true,
            },
            month: {
                type: String,
                required: true,
            },
        },
    ],
    loginRewards: { type: Number, default: 0 },
    claimCount: { type: Number, default: 0 },
    taskCompletedRewards: { type: Number, default: 0 },
    taskClaimCount: { type: Number, default: 0 },
    surveyCompletedRewards: { type: Number, default: 0 },
    offerCompletedRewards: { type: Number, default: 0 },
    socialMediaRewards: { type: Number, default: 0 },
    signUpBonus: { type: Number, default: 0 },
    referralRewards: { type: Number, default: 0 }, // New field
    referralClaimCount: { type: Number, default: 0 }, // New field
    referralCommissionRewards: { type: Number, default: 0 }, // New field
});

const Reward = model<IReward>("Reward", rewardSchema);

export default Reward;
