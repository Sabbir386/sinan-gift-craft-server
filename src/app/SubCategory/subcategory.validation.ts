// SubCategory Validation
import { z } from 'zod';

export const createSubCategoryValidationSchema = z.object({
  body: z.object({
    categoryId: z.string(),
    subCategory: z.string(),
  }),
});

export const updateSubCategoryValidationSchema = z.object({
  body: z.object({
    categoryId: z.string().optional(),
    subCategory: z.string().optional(),
  }),
});

export const SubCategoryValidations = {
  createSubCategoryValidationSchema,
  updateSubCategoryValidationSchema,
};
