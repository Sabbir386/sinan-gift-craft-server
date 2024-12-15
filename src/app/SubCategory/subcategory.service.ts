// SubCategory Service
import mongoose from 'mongoose';
import AppError from '../errors/AppError';
import { SubCategory } from './subcategory.model';
import httpStatus from 'http-status';
import { TSubCategory } from './subcategory.interface';

const createSubCategoryIntoDB = async (payload: TSubCategory) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const newSubCategory = await SubCategory.create([payload], { session });

        if (!newSubCategory.length) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create SubCategory');
        }

        await session.commitTransaction();
        await session.endSession();

        return newSubCategory;
    } catch (err: any) {
        await session.abortTransaction();
        await session.endSession();
        throw new Error(err);
    }
};

const getAllSubCategoriesFromDB = async (query: Record<string, unknown>) => {
    const result = await SubCategory.find(query);
    return { result };
};

const getSingleSubCategoryFromDB = async (id: string) => {
    const result = await SubCategory.findById(id);
    return result;
};

const deleteSubCategoryFromDB = async (id: string) => {
    const result = await SubCategory.findByIdAndDelete(id);
    return result;
};

const updateSubCategoryIntoDB = async (
    id: string,
    payload: Partial<TSubCategory>
) => {
    const result = await SubCategory.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });

    return result;
};

export const SubCategoryServices = {
    createSubCategoryIntoDB,
    getAllSubCategoriesFromDB,
    getSingleSubCategoryFromDB,
    deleteSubCategoryFromDB,
    updateSubCategoryIntoDB,
};
