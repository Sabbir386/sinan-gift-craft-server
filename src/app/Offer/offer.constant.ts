import { TBloodGroup, TGender } from "./offer.interface";


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

export const OfferSearchableFields = [
  'email',
  'id',
  'contactNo',
  'emergencyContactNo',
  'name.firstName',
  'name.lastName',
];
