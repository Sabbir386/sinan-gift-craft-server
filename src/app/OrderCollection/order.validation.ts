// order.validation.ts
import { z } from 'zod';

export const orderValidationSchema = {
  createOrder: z.object({
    body: z.object({
      userInfo: z.object({
        firstName: z.string(),
        lastName: z.string(),
        city: z.string(),
        country: z.string(),
        address: z.string(),
        email: z.string().email(),
        phone: z.string(),
      }),
      items: z.array(
        z.object({
          productId: z.string().optional(),
          quantity: z.number().int().positive(),
          price: z.number().positive(),
        })
      ),
      totalAmount: z.number().positive(),
      status: z.enum(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']).optional(),
    }),
  }),
  updateOrder: z.object({
    body: z.object({
      userInfo: z
        .object({
          firstName: z.string().optional(),
          lastName: z.string().optional(),
          city: z.string().optional(),
          country: z.string().optional(),
          address: z.string().optional(),
          email: z.string().email().optional(),
          phone: z.string().optional(),
        })
        .optional(),
      items: z
        .array(
          z.object({
            productId: z.string().optional(),
            quantity: z.number().int().positive().optional(),
            price: z.number().positive().optional(),
          })
        )
        .optional(),
      totalAmount: z.number().positive().optional(),
      status: z.enum(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']).optional(),
    }),
  }),
  getOrdersByEmail: z.object({
    query: z.object({
      email: z.string().email("Invalid email address").nonempty("Email is required"),
    }),
  }),
};
