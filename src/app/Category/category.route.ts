import express from 'express';
import { USER_ROLE } from '../User/user.constant';
import auth from '../middleware/auth';
import validateRequest from '../middleware/validateRequest';
import { CategoryControllers } from './category.controller';
import { updateCategoryValidationSchema } from './category.validation';

const router = express.Router();
router.post(
  '/create-category',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  CategoryControllers.createCategory,
);
router.get(
  '/',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  CategoryControllers.getAllCategorys,
);
router.get(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  CategoryControllers.getSingleCategory,
);
router.put(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(updateCategoryValidationSchema),
  CategoryControllers.updateCategory,
);

router.delete(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  CategoryControllers.deleteCategory,
);

export const CategoryRoutes = router;
