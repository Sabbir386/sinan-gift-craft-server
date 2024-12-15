import { Schema, model } from 'mongoose';
import { IReferral, ReferralModel } from './referral.interface';

const referralSchema = new Schema<IReferral>(
  {
    id: {
      type: Schema.Types.ObjectId,
      required: [true, 'ID is required'],
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'User objectId is required'],
      ref: 'User',
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    referralId: {
      type: String,
      required: [true, 'Referral ID is required'],
      unique: true,
    },
    referredBy: {
      type: String,
      required: true,
    },
    refferCount: {
      type: Number,
      default: 0,
    },
    email: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

referralSchema.statics.findReferredUsers = async function (
  referralId: string,
): Promise<IReferral[]> {
  return this.find({ referredBy: referralId, isDeleted: false });
};

export const Referral = model<IReferral, ReferralModel>(
  'Referral',
  referralSchema,
);
