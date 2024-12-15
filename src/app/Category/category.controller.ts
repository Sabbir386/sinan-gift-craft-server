import httpStatus from 'http-status';

import catchAsync from '../utilis/catchAsync';
import sendResponse from '../utilis/sendResponse';
import { CategoryServices } from './category.service';

const createCategory = catchAsync(async (req, res) => {
  const CategoryData = req.body;
  //you can decode,[id,email] field
  // const { email, id, role, objectId } = req.user;

  // console.log('controller', email, id, role, objectId);
  const result = await CategoryServices.createCategoryIntoDB(
    CategoryData,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category is created successfully',
    data: result,
  });
});

const getAllCategorys = catchAsync(async (req, res) => {
  const result = await CategoryServices.getAllCategorysFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Categoriess are retrieved successfully',
    // meta: result.meta,
    data: result.result,
  });
});
const getSingleCategory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CategoryServices.getSingleCategoryFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category is retrieved successfully',
    data: result,
  });
});
const deleteCategory = catchAsync(async (req, res) => {
  const { id } = req.params;
  console.log('controller', id);
  const result = await CategoryServices.deleteCategoryFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category is deleted successfully',
    data: result,
  });
});
const updateCategory = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  console.log('from -controller', id, data);
  const result = await CategoryServices.updateCategoryIntoDB(id, data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category is updated successfully',
    data: result,
  });
});
export const CategoryControllers = {
  getAllCategorys,
  createCategory,
  getSingleCategory,
  deleteCategory,
  updateCategory,
};
