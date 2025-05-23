import { Schema, model } from 'mongoose';
import { AdvertiserModel, TAdvertiser } from './advertiser.interface';
import { BloodGroup, Gender } from './advertiser.constant';

const advertiserSchema = new Schema<TAdvertiser, AdvertiserModel>(
  {
    id: {
      type: String,
      required: [true, 'ID is required'],
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'User id is required'],
      unique: true,
      ref: 'User',
    },
    designation: {
      type: String,
      required: [true, 'Designation is required'],
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      maxlength: [60, 'Name can not be more than 60 characters'],
    },
    gender: {
      type: String,
      enum: {
        values: Gender,
        message: '{VALUE} is not a valid gender',
      },
      required: [true, 'Gender is required'],
    },
    dateOfBirth: { type: Date },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    contactNo: { type: String, required: [true, 'Contact number is required'] },
    emergencyContactNo: {
      type: String,
      required: [true, 'Emergency contact number is required'],
    },
    bloodGroup: {
      type: String,
      enum: {
        values: BloodGroup,
        message: '{VALUE} is not a valid blood group',
      },
    },
    presentAddress: {
      type: String,
      required: [true, 'Present address is required'],
    },
    permanentAddress: {
      type: String,
      required: [true, 'Permanent address is required'],
    },
    profileImg: { type: String, default: '' },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
);

// filter out deleted documents
advertiserSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

advertiserSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

advertiserSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

//checking if user is already exist!
advertiserSchema.statics.isUserExists = async function (id: string) {
  const existingUser = await Advertiser.findOne({ id });
  return existingUser;
};

export const Advertiser = model<TAdvertiser, AdvertiserModel>(
  'Advertiser',
  advertiserSchema,
);
