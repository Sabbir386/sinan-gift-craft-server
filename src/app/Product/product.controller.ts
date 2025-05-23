// product.controller.ts
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import sendResponse from '../utilis/sendResponse';
import catchAsync from '../utilis/catchAsync';
import { ProductServices } from './product.service';

const createProduct = catchAsync(async (req: Request, res: Response) => {
  const productData = req.body;
  const result = await ProductServices.createProduct(productData);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Product created successfully',
    data: result,
  });
});

const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductServices.getAllProducts();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Products retrieved successfully',
    data: result,
  });
});


// with categories 
const getAllCategoriesWithProducts = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductServices.getAllCategoriesWithProducts();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Categories with products retrieved successfully',
    data: result,
  });
});  
// all product by single category 
const getAllProductsByCategory = catchAsync(async (req: Request, res: Response) => {
  const { categoryId } = req.params; // Retrieve categoryId from route params
  const result = await ProductServices.getAllProductsByCategory(categoryId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Products retrieved successfully by category',
    data: result,
  });
});


const getSingleProduct = catchAsync(async (req: Request, res: Response) => {
  const productId = req.params.id;
  const result = await ProductServices.getSingleProduct(productId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product retrieved successfully',
    data: result,
  });
});

const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const productId = req.params.id;
  const productData = req.body;
  const result = await ProductServices.updateProduct(productId, productData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product updated successfully',
    data: result,
  });
});

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const productId = req.params.id;
  await ProductServices.deleteProduct(productId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product deleted successfully',
    data:null,
  });
});

export const ProductControllers = {
  createProduct,
  getAllProducts,
  getAllProductsByCategory, // New method
  getAllCategoriesWithProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};