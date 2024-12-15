import { Schema, model } from 'mongoose';
import { NetworkModel, TNetwork, TUserName } from './network.interface';
// import { BloodGroup, Gender } from './Network.constant';

const NetworkSchema = new Schema<TNetwork, NetworkModel>(
  {
    // id: {
    //   type: String,
    //   required: [true, 'ID is required'],
    // },
    userTrack: {
      type: Schema.Types.ObjectId,
      required: [true, 'User objectId is required'],
    },

    networkName: {
      type: String,
      required: [true, 'Name is required'],
    },
  },
  {
    timestamps: true,
  },
);

// generating full name
// NetworkSchema.virtual('fullName').get(function () {
//   return this?.name?.firstName + '' + '' + this?.name?.lastName;
// });

// filter out deleted documents
NetworkSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

NetworkSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

NetworkSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

//checking if user is already exist!
NetworkSchema.statics.isUserExists = async function (id: string) {
  const existingUser = await Network.findOne({ id });
  return existingUser;
};

export const Network = model<TNetwork, NetworkModel>(
  'Network',
  NetworkSchema,
);
