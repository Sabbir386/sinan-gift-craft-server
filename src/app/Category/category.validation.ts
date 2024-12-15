import { z } from 'zod';
import { BloodGroup, Gender } from './category.constant';

const createUserNameValidationSchema = z.object({
  firstName: z.string().min(1).max(20),
  lastName: z.string().max(20),
});

export const createCategoryValidationSchema = z.object({
  body: z.object({
    // userTrack: z.string().optional(),
    categoryName: z.string(),
  }),
});

const updateUserNameValidationSchema = z.object({
  firstName: z.string().min(3).max(20).optional(),
  middleName: z.string().min(3).max(20).optional(),
  lastName: z.string().min(3).max(20).optional(),
});

export const updateCategoryValidationSchema = z.object({
  body: z.object({
    // userTrack: z.string().optional(),
    categoryName: z.string(),
  }),
});

export const CategoryValidations = {
  createCategoryValidationSchema,
  updateCategoryValidationSchema,
};
