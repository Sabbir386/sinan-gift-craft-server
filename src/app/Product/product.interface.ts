// product.interface.ts
import { Types } from 'mongoose';

export enum Colours {
  RED = 'Red',
  BLUE = 'Blue',
  GREEN = 'Green',
  BLACK = 'Black',
  WHITE = 'White',
}

export enum Sizes {
  SMALL = 'Small',
  MEDIUM = 'Medium',
  LARGE = 'Large',
  XLARGE = 'X-Large',
}

export interface TProduct {
  name: string;
  description: string;
  quantity: number;
  price: number;
  salePrice?: number;
  colours?: Colours[];
  sizes?: Sizes[];
  sku: string;
  category: Types.ObjectId;
  subCategory?: Types.ObjectId;
  slug: string;
  images?: string[];
}