// product.routes.ts
import express from 'express';
import validateRequest from '../middleware/validateRequest';
import { ProductControllers } from './product.controller';
import auth from '../middleware/auth';
import { USER_ROLE } from '../User/user.constant';
import { productValidationSchema } from './product.validation';

const router = express.Router();

router.post(
  '/create-product',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(productValidationSchema.createProduct),
  ProductControllers.createProduct
);

router.get('/', ProductControllers.getAllProducts);
router.get('/:id', ProductControllers.getSingleProduct);

router.put(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(productValidationSchema.updateProduct),
  ProductControllers.updateProduct
);

router.delete(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  ProductControllers.deleteProduct
);

export const ProductRoutes = router;