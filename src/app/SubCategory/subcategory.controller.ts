// SubCategory Controller
import httpStatus from 'http-status';
import catchAsync from '../utilis/catchAsync';
import sendResponse from '../utilis/sendResponse';
import { SubCategoryServices } from './subcategory.service';

const createSubCategory = catchAsync(async (req, res) => {
  const subCategoryData = req.body;
  const result = await SubCategoryServices.createSubCategoryIntoDB(
    subCategoryData
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'SubCategory is created successfully',
    data: result,
  });
});

const getAllSubCategories = catchAsync(async (req, res) => {
  const result = await SubCategoryServices.getAllSubCategoriesFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'SubCategories are retrieved successfully',
    data: result.result,
  });
});

const getSingleSubCategory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SubCategoryServices.getSingleSubCategoryFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'SubCategory is retrieved successfully',
    data: result,
  });
});

const deleteSubCategory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SubCategoryServices.deleteSubCategoryFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'SubCategory is deleted successfully',
    data: result,
  });
});

const updateSubCategory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const result = await SubCategoryServices.updateSubCategoryIntoDB(id, data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'SubCategory is updated successfully',
    data: result,
  });
});

export const SubCategoryControllers = {
  createSubCategory,
  getAllSubCategories,
  getSingleSubCategory,
  deleteSubCategory,
  updateSubCategory,
};