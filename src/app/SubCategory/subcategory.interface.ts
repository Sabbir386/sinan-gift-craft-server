// SubCategory Interface
import { Model, Types } from 'mongoose';

export type TSubCategory = {
  categoryId: Types.ObjectId;
  subCategory: string;
};

export interface SubCategoryModel extends Model<TSubCategory> {}