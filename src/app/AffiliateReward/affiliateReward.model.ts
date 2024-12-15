import { Schema, model } from 'mongoose';
import { IAffiliateReward } from './affiliateReward.interface';

const affiliateRewardSchema = new Schema<IAffiliateReward>(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    referralId: { type: String, required: true },
    referralRewardsAmount: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

export const AffiliateReward = model<IAffiliateReward>('AffiliateReward', affiliateRewardSchema);
