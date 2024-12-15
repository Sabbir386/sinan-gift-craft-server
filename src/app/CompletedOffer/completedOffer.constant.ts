import { TBloodGroup, TGender } from "./completedOffer.interface";


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

export const CompletedOfferSearchableFields = [
  'email',
  'id',
  'contactNo',
  'emergencyContactNo',
  'name.firstName',
  'name.lastName',
  'name.middleName',
];
