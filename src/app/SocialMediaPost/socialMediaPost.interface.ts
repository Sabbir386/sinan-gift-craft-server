import { Types } from "mongoose";

export interface SocialMediaPostData {
  userName: string;
  email: string;
  userId: Types.ObjectId;
  link: string;
  platform: string;
  rewardPoint: string;
  status?: 'completed' | 'pending' | 'invalid-link';
}
