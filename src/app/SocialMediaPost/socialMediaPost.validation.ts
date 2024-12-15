import { z } from "zod";

export const SocialMediaPostSchema = z.object({
  userName: z.string().nonempty("User name is required"),
  email: z.string().email("Invalid email"),
  userId: z.string().refine(
    (val) => /^[a-f\d]{24}$/i.test(val), // Validate MongoDB ObjectId format
    { message: "Invalid userId format" }
  ),
  link: z.string().nonempty("Link is required"),
  platform: z.string().nonempty("Platform is required"),
  rewardPoint: z.string().nonempty("rewardPoint is required"),

  status: z.enum(['completed', 'pending', 'invalid-link']).optional(),
});
