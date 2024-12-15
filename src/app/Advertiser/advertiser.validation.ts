import { z } from 'zod';
import { BloodGroup, Gender } from './advertiser.constant';

export const createAdvertiserValidationSchema = z.object({
  body: z.object({
    password: z.string().max(20).optional(),
    advertiser: z.object({
      designation: z.string(),
      name: z.string().max(60), // Updated to single string
      gender: z.enum([...Gender] as [string, ...string[]]),
      dateOfBirth: z.string().optional(),
      email: z.string().email(),
      contactNo: z.string(),
      emergencyContactNo: z.string(),
      bloodGroup: z.enum([...BloodGroup] as [string, ...string[]]),
      presentAddress: z.string(),
      permanentAddress: z.string(),
    }),
  }),
});

export const updateAdvertiserValidationSchema = z.object({
  body: z.object({
    advertiser: z.object({
      name: z.string().max(60).optional(), // Updated to single string
      designation: z.string().max(30).optional(),
      gender: z.enum([...Gender] as [string, ...string[]]).optional(),
      dateOfBirth: z.string().optional(),
      email: z.string().email().optional(),
      contactNo: z.string().optional(),
      emergencyContactNo: z.string().optional(),
      bloodGroup: z.enum([...BloodGroup] as [string, ...string[]]).optional(),
      presentAddress: z.string().optional(),
      permanentAddress: z.string().optional(),
    }),
  }),
});
