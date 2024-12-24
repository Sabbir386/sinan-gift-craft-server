import express from 'express';
import validateRequest from '../middleware/validateRequest';
import { OrderControllers } from './order.controller';
import { orderValidationSchema } from './order.validation';
import { USER_ROLE } from '../User/user.constant';
import auth from '../middleware/auth';

const router = express.Router();

router.post(
    '/create-order',
    validateRequest(orderValidationSchema.createOrder),
    OrderControllers.createOrder
);
router.get(
    '/userEmail',
    validateRequest(orderValidationSchema.getOrdersByEmail), // Validates query parameters
    OrderControllers.getOrdersByEmail
  );
  
  
router.get('/',auth(USER_ROLE.superAdmin, USER_ROLE.admin),OrderControllers.getAllOrders);
router.get('/:id',auth(USER_ROLE.superAdmin, USER_ROLE.admin), OrderControllers.getSingleOrder);
router.put(
    '/:id',auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(orderValidationSchema.updateOrder),
    OrderControllers.updateOrder
);
router.delete('/:id',auth(USER_ROLE.superAdmin, USER_ROLE.admin), OrderControllers.deleteOrder);

export const OrderRoutes = router;