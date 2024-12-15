import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { ReferralServices } from './referral.service';
import sendResponse from '../utilis/sendResponse';
import catchAsync from '../utilis/catchAsync';

const getReferredUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { referralId } = req.query as { referralId: string }; // Parse `referralId` from query params

    const referredUsers = await ReferralServices.getReferredUsers(referralId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Referred users fetched successfully',
      data: referredUsers,
    });
  }
);

export const ReferralController = {
  getReferredUsers,
};
