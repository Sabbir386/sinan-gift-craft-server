import express from 'express';
import { USER_ROLE } from '../User/user.constant';
import auth from '../middleware/auth';
import validateRequest from '../middleware/validateRequest';
import { NetworkControllers } from './network.controller';
import { updateNetworkValidationSchema } from './network.validation';

const router = express.Router();
router.post(
  
  '/create-Network',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  NetworkControllers.createNetwork,
);
router.get(
  '/',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  NetworkControllers.getAllNetworks,
);

router.get(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  NetworkControllers.getSingleNetwork,
);
router.put(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(updateNetworkValidationSchema),
  NetworkControllers.updateNetwork,
);

router.delete(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  NetworkControllers.deleteNetwork,
);



export const NetworkRoutes = router;
