// SubCategory Routes
import express from 'express';
import { USER_ROLE } from '../User/user.constant';
import auth from '../middleware/auth';
import validateRequest from '../middleware/validateRequest';
import { SubCategoryControllers } from './subcategory.controller';
import { updateSubCategoryValidationSchema } from './subcategory.validation';

const router = express.Router();

router.post(
  '/create-subcategory',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  SubCategoryControllers.createSubCategory
);

router.get(
  '/',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  SubCategoryControllers.getAllSubCategories
);

router.get(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  SubCategoryControllers.getSingleSubCategory
);

router.put(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(updateSubCategoryValidationSchema),
  SubCategoryControllers.updateSubCategory
);

router.delete(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  SubCategoryControllers.deleteSubCategory
);

export const SubCategoryRoutes = router;