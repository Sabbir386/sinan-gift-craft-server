import { Schema, model } from 'mongoose';
import { OfferModel, TOffer } from './offer.interface';
const ValueLabelSchema = new Schema({
  value: { type: String, required: true },
  label: { type: String, required: true },
});
const offerSchema = new Schema<TOffer>(
  {
    userTrack: {
      type: Schema.Types.ObjectId,
      required: [true, 'User objectId is required'],
    },
    userRole: { type: String, required: true },
    name: { type: String, required: true },
    network: { type: Schema.Types.ObjectId, required: true },
    category: { type: Schema.Types.ObjectId, required: true },
    device: { type: [ValueLabelSchema], default: [] },
    country: { type: [ValueLabelSchema], default: [] },
    gender: { type: [String], enum: ['male', 'female', 'other'], default: [] },
    offerLink: { type: String, required: true },
    offerStatus: { type: String, required: true },
    dailyLimit: { type: Number },
    totalLimit: { type: Number },
    price: { type: Number, required: true },
    description: { type: String },
    terms: { type: String },
    image: { type: String },
    points: { type: Number },
    completionLimit: { type: Number },
    completionWindow: { type: Number },
    completedCount: { type: Number, default: 0 },
    startDate: { type: Date },
    endDate: { type: Date },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

offerSchema.methods.isOfferExists = async function (
  id: string,
): Promise<TOffer | null> {
  const existOffer = await this.model('Offer').findOne({ _id: id }).exec();
  return existOffer;
};

export const Offer = model<TOffer, OfferModel>('Offer', offerSchema);
