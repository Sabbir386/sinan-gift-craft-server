import express from 'express';
import { PaypalController } from './paypal.controller';
import auth from '../middleware/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.post('/create-order', auth(USER_ROLE.user), PaypalController.createOrder);
router.post('/capture-payment', PaypalController.capturePayment);
router.get('/complete-order', PaypalController.completeOrder);
router.get('/cancel-order', PaypalController.cancelOrder);

export const PaypalRoutes = router;