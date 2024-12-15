/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import mongoose from 'mongoose';

import AppError from '../errors/AppError';
import { User } from '../User/user.model';
import QueryBuilder from '../builder/QueryBuilder';
import { Category } from './category.model';
import { CategorySearchableFields } from './category.constant';
import { TCategory } from './category.interface';
const createCategoryIntoDB = async (
  payload: TCategory,
  // userObjectId: mongoose.Types.ObjectId,
) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // Assign the logged-in user's ID to the userTrack field and userRole Field
    // payload.userTrack = userObjectId;
    // Create the Category
    const newCategory = await Category.create([payload], { session });

    if (!newCategory.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Category');
    }

    await session.commitTransaction();
    await session.endSession();

    return newCategory;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};
const getAllCategorysFromDB = async (query: Record<string, unknown>) => {
  const CategoryQuery = new QueryBuilder(Category.find(), query)
    .search(CategorySearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await CategoryQuery.modelQuery;
  const meta = await CategoryQuery.countTotal();
  console.log(meta);
  return {
    result,
    meta,
  };
};
const getSingleCategoryFromDB = async (id: string) => {
  const result = await Category.findById(id);
  return result;
};
const deleteCategoryFromDB = async (id: string) => {
  const result = await Category.findByIdAndDelete(id);
  return result;
};
const updateCategoryIntoDB = async (id: string, payload: Partial<TCategory>) => {
  const result = await Category.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};
export const CategoryServices = {
  getAllCategorysFromDB,
  createCategoryIntoDB,
  getSingleCategoryFromDB,
  updateCategoryIntoDB,
  deleteCategoryFromDB,
};
