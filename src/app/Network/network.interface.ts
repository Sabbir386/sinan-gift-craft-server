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

export type TNetwork = {
  _id: any;
  // id: string;
  networkName: string;
  userTrack?: Types.ObjectId;
};

export interface NetworkModel extends Model<TNetwork> {
  // eslint-disable-next-line no-unused-vars
  isUserExists(id: string): Promise<TNetwork | null>;
}
