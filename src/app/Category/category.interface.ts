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

export type TCategory = {
  _id: any;
  categoryName: string;
  // userTrack?: Types.ObjectId;
};
export interface CategoryModel extends Model<TCategory> {
  // eslint-disable-next-line no-unused-vars
  isUserExists(id: string): Promise<TCategory | null>;
}
