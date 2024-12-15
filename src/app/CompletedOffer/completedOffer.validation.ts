import { z } from 'zod';

const createUserNameValidationSchema = z.object({
  firstName: z.string().min(1).max(20),
  lastName: z.string().max(20),
});

export const createCompletedOfferValidationSchema = z.object({
  query: z.object({
    OfferId: z.string().optional(),
    userId: z.string().optional(),
    clickId:z.string().optional(),
    points:z.string().optional(),
  }),
});

const updateUserNameValidationSchema = z.object({
  firstName: z.string().min(3).max(20).optional(),
  middleName: z.string().min(3).max(20).optional(),
  lastName: z.string().min(3).max(20).optional(),
});

export const updateCompletedOfferValidationSchema = z.object({
  query: z.object({
    OfferId: z.string().optional(),
    userId: z.string().optional(),
    clickId:z.string().optional(),
  }),
});

export const CompletedOfferValidations = {
  createCompletedOfferValidationSchema,
  updateCompletedOfferValidationSchema,
};
