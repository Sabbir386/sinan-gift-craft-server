import { Types } from 'mongoose';

export interface IAffiliateReward {
  user: Types.ObjectId;
  referralId: string;
  referralRewardsAmount: number;
  isDeleted?:boolean;
}