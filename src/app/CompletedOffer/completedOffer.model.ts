import { Schema, model } from 'mongoose';
import {
  CompletedOfferModel,
  TCompletedOffer,
} from './completedOffer.interface';

// import { BloodGroup, Gender } from './CompletedOffer.constant';

const CompletedOfferSchema = new Schema<TCompletedOffer, CompletedOfferModel>(
  {
    offerId: {
      type: Schema.Types.ObjectId,
      required: [true, 'Offer objectId is required'],
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: [true, 'User objectId is required'],
    },
    clickId: {
      type: String,
      required: [true, 'ClickId is required'],
    },
    points: {
      type: Number,
      required: true, // Set points as required when creating the offer
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);


// generating full name
// CompletedOfferSchema.virtual('fullName').get(function () {
//   return this?.name?.firstName + '' + '' + this?.name?.lastName;
// });

// filter out deleted documents
CompletedOfferSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

CompletedOfferSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

CompletedOfferSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

//checking if user is already exist!
CompletedOfferSchema.statics.isUserExists = async function (id: string) {
  const existingUser = await CompletedOffer.findOne({ id });
  return existingUser;
};

export const CompletedOffer = model<TCompletedOffer, CompletedOfferModel>(
  'CompletedOffer',
  CompletedOfferSchema,
);
