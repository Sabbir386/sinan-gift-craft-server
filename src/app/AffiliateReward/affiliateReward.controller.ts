import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import sendResponse from '../utilis/sendResponse';
import catchAsync from '../utilis/catchAsync';
import { AffiliateRewardService } from './affiliateReward.service';

// POST route to create an affiliate reward
const createReward = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId, referralId, claimedAmount } = req.body as {
      userId: string;
      referralId: string;
      claimedAmount: number;
    };

    // Validate body parameters
    if (!userId || !referralId || !claimedAmount) {
      return sendResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: 'Missing required parameters: userId, referralId, or claimedAmount',
        data: [],
      });
    }

    const createdReward = await AffiliateRewardService.createAffiliateReward(
      userId,
      referralId,
      claimedAmount
    );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Affiliate reward created successfully',
      data: createdReward,
    });
  }
);

// GET route to calculate total rewards for a user
const totalRewards = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.query as { userId: string };

    // Validate query parameters
    if (!userId) {
      return sendResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: 'Missing required query parameter: userId',
        data: [],
      });
    }

     // Call service to get total rewards
     const totalRewards = await AffiliateRewardService.calculateTotalRewards(userId);

     sendResponse(res, {
         statusCode: httpStatus.OK,
         success: true,
         message: "Total rewards calculated successfully",
         data: totalRewards,
     });
  }
);

export const AffiliateRewardController = {
  createReward,
  totalRewards,
};
