import express from 'express';
import { ReferralController } from './referral.controller';
import validateRequest from '../middleware/validateRequest';
import { referralValidationSchema } from './referral.validation';

const router = express.Router();

router.get(
  '/referred-users',
//   validateRequest(referralValidationSchema), // Middleware to validate `referralId`
  ReferralController.getReferredUsers
);

export const ReferralRoutes = router;
