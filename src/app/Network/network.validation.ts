import { z } from 'zod';
import { BloodGroup, Gender } from './network.constant';

const createUserNameValidationSchema = z.object({
  firstName: z.string().min(1).max(20),
  lastName: z.string().max(20),
});

export const createNetworkValidationSchema = z.object({
  body: z.object({
    userTrack: z.string().optional(),
    networkName: z.string(),
  }),
});

const updateUserNameValidationSchema = z.object({
  firstName: z.string().min(3).max(20).optional(),
  middleName: z.string().min(3).max(20).optional(),
  lastName: z.string().min(3).max(20).optional(),
});

export const updateNetworkValidationSchema = z.object({
  body: z.object({
    userTrack: z.string().optional(),
    networkName: z.string(),
  }),
});

export const NetworkValidations = {
  createNetworkValidationSchema,
  updateNetworkValidationSchema,
};
