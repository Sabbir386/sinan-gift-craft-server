import express from 'express';

import { USER_ROLE } from '../User/user.constant';

import auth from '../middleware/auth';
import validateRequest from '../middleware/validateRequest';

import { updateAdvertiserValidationSchema } from './advertiser.validation';
import { AdvertiserControllers } from './advertiser.controller';

const router = express.Router();

router.get(
  '/',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  AdvertiserControllers.getAllAdvertisers,
);

router.get(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  AdvertiserControllers.getSingleAdvertiser,
);

router.patch(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(updateAdvertiserValidationSchema),
  AdvertiserControllers.updateAdvertiser,
);

router.delete(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  AdvertiserControllers.deleteAdvertiser,
);

export const AdvertiserRoutes = router;
