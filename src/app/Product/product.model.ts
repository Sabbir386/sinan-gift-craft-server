import mongoose, { Schema, Types } from 'mongoose';
import { TProduct } from './product.interface';
import { Colours, Sizes } from './product.interface';

const productSchema = new Schema<TProduct>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  salePrice: { type: Number },
  colours: { type: [String], enum: Object.values(Colours) },
  sizes: { type: [String], enum: Object.values(Sizes) },
  sku: { type: String, required: true, unique: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  subCategory: { type: Schema.Types.ObjectId, ref: 'SubCategory' },
  slug: { type: String, required: true, unique: true },
  images: { type: [String] },
});

export const Product = mongoose.model<TProduct>('Product', productSchema);
