import { z } from "zod";

export const userWithdrawalValidationSchema = z.object({
  body: z.object({
    userId: z.string().nonempty("User ID is required"),
    userEmail: z.string().email("Valid email is required"),
    userName: z.string().optional(),
    userRegisterId: z.string().optional(),
    profileImg: z.string().optional(), 
    paypalEmail: z.string().optional(),
    btcAddress: z.string().optional(),
    method: z.string().optional(),
    networkType: z.string().optional(),
    description: z.string().optional(),
    amount: z.number().positive("Amount must be greater than zero"),
    transactionId: z.string().optional(),
    invoiceId: z.string().optional(), // Validate optional Invoice ID
    country: z.string().optional(),  // Validate optional Country
    status: z.enum(['pending', 'completed', 'failed']).optional(),
    timestamps: z
      .object({
        requestedAt: z.union([z.date(), z.string().optional()]).optional(), // Accepts Date, string, or undefined
        processedAt: z.union([z.date(), z.null(), z.string().optional()]).optional(), // Accepts Date, null, string, or undefined
      })
      .optional(),
  }),
});
