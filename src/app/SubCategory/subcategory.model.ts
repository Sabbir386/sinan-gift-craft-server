// SubCategory Schema
import { Schema, model } from 'mongoose';
import { SubCategoryModel, TSubCategory } from './subcategory.interface';

const SubCategorySchema = new Schema<TSubCategory, SubCategoryModel>(
  {
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    subCategory: {
      type: String,
      required: [true, 'SubCategory name is required'],
    },
  },
  {
    timestamps: true,
  }
);

export const SubCategory = model<TSubCategory, SubCategoryModel>(
  'SubCategory',
  SubCategorySchema
);