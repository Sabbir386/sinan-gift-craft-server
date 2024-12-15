import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utilis/catchAsync';
import { stripe } from './payment.service';
import paymentModel from './payment.model';

// Utility function to calculate time difference for "time ago" formatting
const getTimeAgo = (createdAt: Date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - createdAt.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minutes ago`;
  } else {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hours ago`;
  }
};

// Create a payment intent
const createPaymentIntent = catchAsync(async (req: Request, res: Response) => {
  const { price } = req.body;
  const amount = price * 100;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method_types: ['card'],
    });

    res.status(httpStatus.OK).send({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      success: false,
      message: 'PaymentIntent creation failed',
      error: error.message,
    });
  }
});

// Save payment info
const savePaymentInfo = catchAsync(async (req: Request, res: Response) => {
  const { transactionId, amount, email, name } = req.body;
  const { email: userEmail } = req.user;

  if (!userEmail) {
    return res.status(httpStatus.BAD_REQUEST).send({
      success: false,
      message: 'Missing userEmail',
    });
  }

  try {
    const payment = new paymentModel({
      transactionId,
      amount,
      email,
      name,
      userEmail,
      paymentType: 'stripe',
    });

    await payment.save();
    res.status(httpStatus.OK).send({ success: true });
  } catch (error: any) {
    console.error('Error saving payment info:', error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      success: false,
      message: 'Failed to save payment info',
      error: error.message,
    });
  }
});

// Get logged-in user's payment info
const getPaymentInfo = catchAsync(async (req: Request, res: Response) => {
  const { email: userEmail } = req.user;

  if (!userEmail) {
    return res.status(httpStatus.UNAUTHORIZED).send({
      success: false,
      message: 'User not authenticated',
    });
  }

  try {
    const payments = await paymentModel.find({ userEmail });

    if (payments.length === 0) {
      return res.status(httpStatus.NOT_FOUND).send({
        success: false,
        message: 'No payment records found',
        payments: [],
      });
    }

    res.status(httpStatus.OK).send({
      success: true,
      payments,
    });
  } catch (error: any) {
    console.error('Error fetching payment info:', error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      success: false,
      message: 'Failed to fetch payment info',
      error: error.message,
    });
  }
});

// Get all users' payment info
const getAllPayments = catchAsync(async (req: Request, res: Response) => {
  try {
    const payments = await paymentModel.find(); // Fetch all payment records

    if (payments.length === 0) {
      return res.status(httpStatus.NOT_FOUND).send({
        success: false,
        message: 'No payment records found',
      });
    }

    res.status(httpStatus.OK).send({
      success: true,
      payments,
    });
  } catch (error: any) {
    console.error('Error fetching all payments:', error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      success: false,
      message: 'Failed to fetch all payments',
      error: error.message,
    });
  }
});

// Get recent payments made between 1 second and 3 hours ago
const getRecentPayments = catchAsync(async (req: Request, res: Response) => {
  try {
    // Set the time window to 3 hours ago (in milliseconds)
    const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60000); // 3 hours = 180 minutes

    // Find payments created between 0 seconds ago and 3 hours ago
    const recentPayments = await paymentModel.find({
      createdAt: { $gte: threeHoursAgo },
    }).sort({ createdAt: -1 }).lean(); // Use lean() to get plain JS objects

    if (recentPayments.length === 0) {
      console.log('No recent payments found in the last 3 hours');
      return res.status(httpStatus.NOT_FOUND).send({

        "success": true,
        "message": "No recent payments found",
        "payments": []


      });
    }


    // Format the response with the time ago information
    const formattedPayments = recentPayments.map(payment => ({
      ...payment,
      timeAgo: getTimeAgo(payment.createdAt), // Calculate how many seconds, minutes, or hours ago
    }));

    res.status(httpStatus.OK).send({
      success: true,
      payments: formattedPayments,
    });
  } catch (error: any) {
    console.error('Error fetching recent payments:', error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      success: false,
      message: 'Failed to fetch recent payments',
      error: error.message,
    });
  }
});

export const PaymentController = {
  createPaymentIntent,
  savePaymentInfo,
  getPaymentInfo,
  getAllPayments,
  getRecentPayments,
};
