import mongoose, { Schema } from 'mongoose';
import { TProduct } from './product.interface';

const productSchema = new Schema<TProduct>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  salePrice: { type: Number },
  colours: { type: [String] }, 
  sizes: { type: [Number] },
  sku: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  subCategory: { type: Schema.Types.ObjectId, ref: 'SubCategory' },
  slug: { type: String, required: true, unique: true },
  images: { type: [String] },
});

export const Product = mongoose.model<TProduct>('Product', productSchema);
