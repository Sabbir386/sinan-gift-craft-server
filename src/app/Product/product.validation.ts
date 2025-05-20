import { z } from 'zod';
import { Types } from 'mongoose';

const objectIdSchema = z.string().refine((id) => Types.ObjectId.isValid(id), {
  message: 'Invalid ObjectId',
});

export const productValidationSchema = {
  createProduct: z.object({
    body: z.object({
      name: z.string(),
      description: z.string(),
      quantity: z.number().int().nonnegative(),
      price: z.number().nonnegative(),
      salePrice: z.number().nonnegative().optional(),
      colours: z.array(z.string()).optional(), 
      sizes: z.array(z.number()).optional(),
      sku: z.string().optional(),
      category: objectIdSchema,
      subCategory: objectIdSchema.optional(),
      slug: z.string().optional(),
      images: z.array(z.string()).optional(),
    }),
  }),
  updateProduct: z.object({
    body: z.object({
      name: z.string().optional(),
      description: z.string().optional(),
      quantity: z.number().int().nonnegative().optional(),
      price: z.number().nonnegative().optional(),
      salePrice: z.number().nonnegative().optional(),
      colours: z.array(z.string()).optional(), // Validation for string array
      sizes: z.array(z.number()).optional(),   // Validation for number array
      sku: z.string().optional(),
      category: objectIdSchema.optional(),
      subCategory: objectIdSchema.optional(),
      slug: z.string().optional(),
      images: z.array(z.string()).optional(),
    }),
  }),
};
