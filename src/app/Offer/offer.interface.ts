import { Date, Schema, Types } from 'mongoose';
import { Model } from 'mongoose';
export type TGender = 'male' | 'female' | 'other';
export type TValueLabel = {
  value: string;
  label: string;
};
export type TBloodGroup =
  | 'A+'
  | 'A-'
  | 'B+'
  | 'B-'
  | 'AB+'
  | 'AB-'
  | 'O+'
  | 'O-';
export type TOffer = {
  userTrack?: Types.ObjectId;
  userRole?: string;
  name: string;
  network: Types.ObjectId;
  category: Types.ObjectId;
  gender?: TGender[];
  device?: TValueLabel[];
  country?: TValueLabel[];
  offerLink: string;
  offerStatus: string;
  dailyLimit?: number;
  totalLimit?: number;
  price: number;
  description?: string;
  terms?: string;
  image?: string;
  points?: number;
  completionLimit?: number;
  completionWindow?: number;
  completedCount?: number;
  startDate?: Date;
  endDate?: Date;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  isDeleted?: boolean;
};

export interface OfferModel extends Model<TOffer> {
  isOfferExists(id: string): Promise<TOffer | null>;
}
