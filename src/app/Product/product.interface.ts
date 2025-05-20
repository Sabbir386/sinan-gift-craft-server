// product.interface.ts
import { Types } from 'mongoose';
export interface TProduct {
  name: string;
  description: string;
  quantity: number;
  price: number;
  salePrice?: number;
  colours?: string[]; 
  sizes?: number[]; 
  sku: string;
  category: Types.ObjectId;
  subCategory?: Types.ObjectId;
  slug: string;
  images?: string[];
}