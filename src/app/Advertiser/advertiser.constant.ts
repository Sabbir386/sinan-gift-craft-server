import { TBloodGroup, TGender } from "./advertiser.interface";


export const Gender: TGender[] = ['male', 'female', 'other'];

export const BloodGroup: TBloodGroup[] = [
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  'O+',
  'O-',
];

export const AdvertiserSearchableFields = [
  'email',
  'id',
  'contactNo',
  'emergencyContactNo',
  'name',
];
