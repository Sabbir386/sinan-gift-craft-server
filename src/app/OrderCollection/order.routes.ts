import express from 'express';
import validateRequest from '../middleware/validateRequest';
import { OrderControllers } from './order.controller';
import { orderValidationSchema } from './order.validation';

const router = express.Router();

router.post(
    '/create-order',
    validateRequest(orderValidationSchema.createOrder),
    OrderControllers.createOrder
);

router.get('/', OrderControllers.getAllOrders);
router.get('/:id', OrderControllers.getSingleOrder);
router.put(
    '/:id',
    validateRequest(orderValidationSchema.updateOrder),
    OrderControllers.updateOrder
);
router.delete('/:id', OrderControllers.deleteOrder);

export const OrderRoutes = router;