// order.controller.ts
import { Request, Response } from 'express';
import catchAsync from '../utilis/catchAsync';
import sendResponse from '../utilis/sendResponse';
import httpStatus from 'http-status';
import { OrderServices } from './order.service';
import { sendEmail } from '../utilis/sendEmail';

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const orderData = req.body;

  // Create a new order
  const result = await OrderServices.createOrder(orderData);

  // Send order confirmation email
  await sendEmail(orderData.userInfo.email, result.orderId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Order created successfully',
    data: result,
  });
});
// New endpoint to fetch orders by email
const getOrdersByEmail = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.query as { email: string }; // Ensure TypeScript knows the query structure
  const result = await OrderServices.getOrdersByEmail(email);
  if (result.length === 0) {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: "No orders found for the provided email",
      data: null,
    });
    return;
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Orders retrieved successfully",
    data: result,
  });
});


const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderServices.getAllOrders();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Orders retrieved successfully',
    data: result,
  });
});

const getSingleOrder = catchAsync(async (req: Request, res: Response) => {
  const orderId = req.params.id;
  const result = await OrderServices.getSingleOrder(orderId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order retrieved successfully',
    data: result,
  });
});

const updateOrder = catchAsync(async (req: Request, res: Response) => {
  const orderId = req.params.id;
  const orderData = req.body;
  const result = await OrderServices.updateOrder(orderId, orderData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order updated successfully',
    data: result,
  });
});

const deleteOrder = catchAsync(async (req: Request, res: Response) => {
  const orderId = req.params.id;
  await OrderServices.deleteOrder(orderId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Order deleted successfully',
    data: null,
  });
});

export const OrderControllers = {
  createOrder,
  getAllOrders,
  getSingleOrder,
  updateOrder,
  deleteOrder,
  getOrdersByEmail, 
};
