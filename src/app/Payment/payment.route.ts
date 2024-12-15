import express from 'express';
import { PaymentController } from './payment.controller';
import auth from '../middleware/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

// Route for creating a payment intent
router.post(
  '/create-payment-intent',
  auth(USER_ROLE.user),
  PaymentController.createPaymentIntent
);

// Route for saving payment info
router.post(
  '/save-payment-info',
  auth(USER_ROLE.user),
  PaymentController.savePaymentInfo
);

// Route for getting the logged-in user's payment info
router.get(
  '/payment-info',
  auth(USER_ROLE.user),
  PaymentController.getPaymentInfo
);

// Route for getting all users' payment history
router.get(
  '/all-payments',
  PaymentController.getAllPayments
);

router.get(
  '/recent-payments',
  auth(USER_ROLE.user, USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.advertiser),
  PaymentController.getRecentPayments  // New route for recent payments
);

export const PaymentRoutes = router;
