import { Schema, model, Document } from "mongoose";

export interface IBonusReward extends Document {
  userId: Schema.Types.ObjectId;
  rewardName: string;
  rewardPoints: number;
  rewardStatus: "COMPLETED";
  rewardFrom: string;
}

const bonusRewardSchema = new Schema<IBonusReward>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    rewardName: {
      type: String,
      required: true,
    },
    rewardPoints: {
      type: Number,
      required: true,
    },
    rewardStatus: {
      type: String,
      enum: ["COMPLETED"],
      default: "COMPLETED",
    },
    rewardFrom: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const BonusReward = model<IBonusReward>("BonusReward", bonusRewardSchema);
