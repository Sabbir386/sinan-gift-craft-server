import { Schema, Types } from 'mongoose';
import { Model } from 'mongoose';

export type TReferralStatus = 'active' | 'inactive';

export interface IReferral {
  id: Types.ObjectId;
  user: Types.ObjectId;
  country: string;
  name: string;
  referralId: string;
  referredBy: string;
  refferCount: number;
  email: string;
  status: TReferralStatus;
  isDeleted?: boolean;
}

export interface ReferralModel extends Model<IReferral> {
  findReferredUsers(referralId: string): Promise<IReferral[]>;
}
