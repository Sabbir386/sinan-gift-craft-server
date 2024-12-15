import httpStatus from 'http-status';
import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utilis/catchAsync';
import sendResponse from '../utilis/sendResponse';
import { CompletedOfferServices } from './completedOffer.service';
import AppError from '../errors/AppError';


const createCompletedOfferLogic = async (req: Request) => {
  const { offerId, userId, points } = req.query;

  if (!offerId || !userId || !points) {
    throw new AppError(httpStatus.BAD_REQUEST, 'offerId, userId, and points are required');
  }

  const firstOfferId = Array.isArray(offerId) ? offerId[0] : offerId;
  const firstUserId = Array.isArray(userId) ? userId[0] : userId;
  const firstPoints = Array.isArray(points) ? points[0] : points;

  if (typeof firstOfferId !== 'string' || typeof firstUserId !== 'string' || typeof firstPoints !== 'string') {
    throw new AppError(httpStatus.BAD_REQUEST, 'offerId, userId, and points should be single string values');
  }

  const fullClickId = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  const trimmedClickId = fullClickId.trim();
  const trimmedOfferId = firstOfferId.trim();
  const trimmedUserId = firstUserId.trim();
  const trimmedPoints = parseInt(firstPoints.trim(), 10);

  if (!trimmedClickId || !trimmedOfferId || !trimmedUserId || isNaN(trimmedPoints)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid values for clickId, offerId, userId, or points');
  }

  const result = await CompletedOfferServices.createCompletedOfferIntoDB(
    trimmedClickId,
    trimmedOfferId,
    trimmedUserId,
    trimmedPoints
  );

  return result;
};


const createCompletedOffer = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await createCompletedOfferLogic(req);

      res.status(httpStatus.CREATED).json({
        success: true,
        message: 'CompletedOffer is created successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
);

const createCompletedOfferGet = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await createCompletedOfferLogic(req);

      res.status(httpStatus.CREATED).json({
        success: true,
        message: 'CompletedOffer is created successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
);

const getAllCompletedOffers = catchAsync(
  
  async (req: Request, res: Response) => {
    const result = await CompletedOfferServices.getAllCompletedOffersFromDB(req.query);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Completed Offers are retrieved successfully',
      meta: result.meta,
      data: result.result,
      totalPoints: result.totalPoints, // Include total points in the response
    });
  },
);

const getTotalOfferCounts = catchAsync(async (req: Request, res: Response) => {
  const counts = await CompletedOfferServices.getTotalOfferCounts();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Total Offer counts are retrieved successfully',
    data: counts,
  });
});

const getDailyTotalsOffer = catchAsync(async (req: Request, res: Response) => {
  const totals = await CompletedOfferServices.getDailyOfferTotals();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Daily totals offer are retrieved successfully',
    data: totals,
  });
});
const getUserTotalOfferCounts = catchAsync(
  async (req: Request, res: Response) => {
    const counts =
      await CompletedOfferServices.getSpecificUserTotalOfferCounts();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User Total Offer counts are retrieved successfully',
      data: counts,
    });
  },
);
const getSpecificOfferLiveTimeTotalCounts = catchAsync(
  async (req: Request, res: Response) => {
    const counts =
      await CompletedOfferServices.getSpecificOfferLiveTimeTotalCountsFromDb();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Specific Offer Live Time counts are retrieved successfully',
      data: counts,
    });
  },
);

const getUserDailyTotals = catchAsync(async (req: Request, res: Response) => {
  const totals = await CompletedOfferServices.getSpecificUserDailyTotals();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Daily totals offer are retrieved successfully',
    data: totals,
  });
});
const getPerDayTotalOfferCounts = catchAsync(
  async (req: Request, res: Response) => {
    const totals =
      await CompletedOfferServices.getPerDayTotalOfferCountsFromDb();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Per day total offer counts are retrieved successfully',
      data: totals,
    });
  },
);

const getLoggedInUserTotalOfferCounts = catchAsync(
  async (req: Request, res: Response) => {
    const { objectId } = req.user;
    const date = req.query.date;

    if (typeof date !== 'string' && typeof date !== 'undefined') {
      throw new AppError(httpStatus.BAD_REQUEST, 'invalid date format');
    }

    const counts =
      await CompletedOfferServices.getloggedInUserTotalOfferCountsFromDb(
        objectId,
        date,
      );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message:
        'Logged In User Total completed Offer counts are retrieved successfully',
      data: counts,
    });
  },
);
const getLoggedInUserDailyTotals = catchAsync(
  async (req: Request, res: Response) => {
    const { objectId } = req.user; // Assuming req.user contains the logged-in user info and userId is stored in req.user.id

    const dailyTotals =
      await CompletedOfferServices.getLoggedInUserDailyTotalsFromDb(objectId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message:
        'Looged In User Daily Completed offer are retrieved successfully',
      data: dailyTotals,
    });
  },
);
const getOfferHoursLeft = catchAsync(async (req: Request, res: Response) => {
  const { objectId } = req.user;
  const { offerId } = req.params;
  console.log(offerId);
  try {
    const hoursLeft = await CompletedOfferServices.calculateHoursLeft(
      objectId,
      offerId,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Offer completion status retrieved successfully',
      data: hoursLeft,
    });
  } catch (error) {
    console.log(error);
  }
});

//new for offerName looged user
const getLoggedInUserOfferNameCounts = catchAsync(
  async (req: Request, res: Response) => {
    const { objectId } = req.user;

    const counts =
      await CompletedOfferServices.getLoggedInUserOfferNameCountsFromDb(
        objectId,
      );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message:
        'Logged In User particular completed Offer counts are retrieved successfully',
      data: counts,
    });
  },
);
export const CompletedOfferControllers = {
  getAllCompletedOffers,
  createCompletedOffer,
  createCompletedOfferGet,
  getTotalOfferCounts,
  getDailyTotalsOffer,
  getUserTotalOfferCounts,
  getSpecificOfferLiveTimeTotalCounts,
  getUserDailyTotals,
  getPerDayTotalOfferCounts,
  getLoggedInUserTotalOfferCounts,
  getLoggedInUserDailyTotals,
  getOfferHoursLeft,
  getLoggedInUserOfferNameCounts,
  // getSingleCompletedOffer,
  // deleteCompletedOffer,
  // updateCompletedOffer,
};
