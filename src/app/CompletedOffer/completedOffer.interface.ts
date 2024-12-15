import { Model, Types } from 'mongoose';

export type TGender = 'male' | 'female' | 'other';
export type TBloodGroup =
  | 'A+'
  | 'A-'
  | 'B+'
  | 'B-'
  | 'AB+'
  | 'AB-'
  | 'O+'
  | 'O-';

export type TUserName = {
  firstName: string;
  lastName: string;
};

export type TCompletedOffer = {
  _id: any;
  offerId?: Types.ObjectId;
  userId?: Types.ObjectId;
  clickId?:string;
  points?:number,
  createdAt: Date;
  updatedAt: Date;
};

export interface CompletedOfferModel extends Model<TCompletedOffer> {
  // eslint-disable-next-line no-unused-vars
  isUserExists(id: string): Promise<TCompletedOffer | null>;
}
