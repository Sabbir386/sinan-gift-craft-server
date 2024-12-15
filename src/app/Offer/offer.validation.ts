import { z } from 'zod';

const valueLabelSchema = z.object({
  value: z.string(),
  label: z.string(),
});

export const userTrackValidationSchema = z.object({
  body: z.object({
    country: z.string(),
    device: z.string(),
    ip: z.string(),
    browser: z.string(),
    age: z.number().int().min(0),
    gender: z.string(),
    macAddress: z.string(),
  }),
});

export const offerValidationSchema = z.object({
  body: z.object({
    userTrack: z.string().optional(),
    name: z.string(),
    network: z.string(),
    category: z.string(),
    device: z.array(valueLabelSchema).optional(),
    country: z.array(valueLabelSchema).optional(),
    gender: z.array(z.string()).optional(),
    offerLink: z.string(),
    offerStatus: z.string(),
    dailyLimit: z.number().int().min(0).optional(),
    totalLimit: z.number().int().min(0).optional(),
    price: z.number().min(0),
    description: z.string(),
    terms: z.string(),
    image: z.string().optional(),
    points: z.number().int().min(0).optional(),
    completionLimit: z.number().int().min(0),
    completionWindow: z.number().int().min(0).optional(),
    completedCount: z.number().int().min(0).default(0),
    startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid date format',
    }),
    endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid date format',
    }),
  }),
});
