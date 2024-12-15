import { z } from 'zod';

export const referralValidationSchema = z.object({
    referralId: z.string({
        required_error: 'Referral ID is required',
    }),
});
