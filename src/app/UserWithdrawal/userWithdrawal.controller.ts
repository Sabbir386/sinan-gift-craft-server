import { Request, Response } from 'express';
import { UserWithdrawalServices } from './userWithdrawal.service';
import httpStatus from 'http-status';
import sendResponse from '../utilis/sendResponse';
import catchAsync from '../utilis/catchAsync';

export const UserWithdrawalControllers = {
  // Get all withdrawals
  getAllWithdrawals: catchAsync(async (req: Request, res: Response) => {
    const withdrawals = await UserWithdrawalServices.getAllWithdrawals();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'All withdrawals retrieved successfully',
      data: withdrawals,
    });
  }),

  // Get a single withdrawal by ID
  getSingleWithdrawal: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const withdrawal = await UserWithdrawalServices.getWithdrawalById(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Withdrawal retrieved successfully',
      data: withdrawal,
    });
  }),


  // get multiple withdrwa history by single user 
  getUserMultipleWithdrawalHistory: catchAsync(async (req: Request, res: Response) => {
    const { userEmail } = req.query; // Get `userEmail` from query params

    // Validate userEmail
    if (!userEmail || typeof userEmail !== 'string') {
      return sendResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: 'Invalid or missing email parameter',
        data: null,
      });
    }

    // Fetch withdrawals matching the userEmail
    const withdrawals = await UserWithdrawalServices.getWithdrawalsByEmail(userEmail);

    // Send the response
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `Withdrawals retrieved successfully for email: ${userEmail}`,
      data: withdrawals,
    });
  }),
  // Create a withdrawal request
  createWithdrawal: catchAsync(async (req: Request, res: Response) => {
    const withdrawalData = req.body;

    // Call the service to create a withdrawal request
    const newWithdrawal = await UserWithdrawalServices.createWithdrawal(withdrawalData);

    // Send the response
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Withdrawal request created successfully',
      data: newWithdrawal,
    });
  }),

  // Update withdrawal status
  updateWithdrawalStatus: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const status = req.query.status as string;

    // Validate the status query parameter
    if (!status || (status !== 'completed' && status !== 'failed')) {
      return res.status(httpStatus.BAD_REQUEST).send({
        success: false,
        message: 'Status query parameter must be either "completed" or "failed"',
      });
    }
    const updatedWithdrawal = await UserWithdrawalServices.updateWithdrawalStatus(
      id,
      status
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Withdrawal status updated successfully',
      data: updatedWithdrawal,
    });
  }),

  getWithdrawalsByStatus: catchAsync(async (req: Request, res: Response) => {
    const { status } = req.query;

    // Validate the status query parameter
    if (!status || !['pending', 'completed', 'failed'].includes(status as string)) {
      return sendResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: 'Invalid status parameter. Must be one of: pending, completed, failed',
        data: null,
      });
    }

    // Fetch withdrawals matching the status
    const withdrawals = await UserWithdrawalServices.getWithdrawalsByStatus(status as string);

    // Send the response
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `Withdrawals retrieved successfully for status: ${status}`,
      data: withdrawals,
    });
  }),

  // Delete a withdrawal
  deleteWithdrawal: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    await UserWithdrawalServices.deleteWithdrawal(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Withdrawal deleted successfully',
      data: null,
    });
  }),

  // Toggle withdrawal status
  toggleWithdrawalStatus: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updatedWithdrawal = await UserWithdrawalServices.toggleWithdrawalStatus(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Withdrawal status toggled successfully',
      data: updatedWithdrawal,
    });
  }),
};
