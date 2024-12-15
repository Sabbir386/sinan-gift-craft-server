/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import mongoose, { Types } from 'mongoose';
import moment from 'moment-timezone';
import AppError from '../errors/AppError';
import { User } from '../User/user.model';
import QueryBuilder from '../builder/QueryBuilder';
import { TCompletedOffer } from './completedOffer.interface';
import { CompletedOffer } from './completedOffer.model';
import { CompletedOfferSearchableFields } from './completedOffer.constant';
import { TOffer } from '../Offer/offer.interface';
import { Offer } from '../Offer/offer.model';
import { offerValidationSchema } from '../Offer/offer.validation';
interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
  [key: string]: unknown;
}
interface OfferInfo {
  offerId: Types.ObjectId;
  count: number;
  date: string;
}

interface UserDailyTotal {
  userId: Types.ObjectId;
  TotalCount: number;
  date: string;
  offerInfo: OfferInfo[];
}
interface OfferCount {
  offerId: Types.ObjectId;
  count: number;
  userId: Types.ObjectId;
  date: string;
}
interface DailyOfferTotal {
  offerId: Types.ObjectId;
  count: number;
  userId: Types.ObjectId;
  date: string;
}
interface DailyOfferTotalResponse {
  data: DailyOfferTotal[];
  TotalCount: number;
}

const createCompletedOfferIntoDB = async (
  clickId: string,
  offerId: string,
  userId: string,
  points: number
) => {
  try {
    const newCompletedOffer = await CompletedOffer.create({
      clickId,
      offerId: new mongoose.Types.ObjectId(offerId),
      userId: new mongoose.Types.ObjectId(userId),
      points, // Store points
    });

    if (!newCompletedOffer) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create CompletedOffer');
    }

    return newCompletedOffer;
  } catch (error: any) {
    throw new Error(error.message);
  }
};


const getAllCompletedOffersFromDB = async (
  query: Record<string, unknown>,
): Promise<{ result: any; meta: Meta | null; totalPoints: number }> => {

 
  // Modify the query to include pagination
  const CompletedOfferQuery = new QueryBuilder(CompletedOffer.find(), query)
    .search(CompletedOfferSearchableFields)
    .filter()
    .sort()
    .paginate() 
    .fields();

  const result = await CompletedOfferQuery.modelQuery;
  const meta: Meta | null = await CompletedOfferQuery.countTotal();

  // Calculate total points for the user using aggregation
  const totalPointsResult = await CompletedOffer.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(query.userId as string) } },
    { $group: { _id: null, totalPoints: { $sum: "$points" } } }
  ]);

  const totalPoints = totalPointsResult.length > 0 ? totalPointsResult[0].totalPoints : 0;

  return {
    result,
    meta,
    totalPoints,
  };
};



const getTotalOfferCounts = async (): Promise<OfferCount[]> => {
  const counts = await CompletedOffer.aggregate([
    {
      $group: {
        _id: {
          offerId: '$offerId',
          userId: '$userId',
          date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        },
        count: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: 'offers',
        localField: '_id.offerId',
        foreignField: '_id',
        as: 'offerDetails',
      },
    },
    {
      $unwind: '$offerDetails',
    },
    {
      $project: {
        _id: 0,
        offerId: '$_id.offerId',
        count: 1,
        userId: '$_id.userId',
        date: '$_id.date',
        name: '$offerDetails.name',
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);

  return counts;
};

const getDailyOfferTotals = async (): Promise<DailyOfferTotalResponse[]> => {
  const today = moment().startOf('day').toDate();
  const tomorrow = moment().add(1, 'day').startOf('day').toDate();

  const counts = await CompletedOffer.aggregate([
    {
      $match: {
        createdAt: {
          $gte: today,
          $lt: tomorrow,
        },
      },
    },
    {
      $group: {
        _id: {
          offerId: '$offerId',
          userId: '$userId',
          date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        count: 1,
        offerId: '$_id.offerId',
        userId: '$_id.userId',
        date: '$_id.date',
      },
    },
  ]);

  // Calculate the total count
  const totalCount = counts.reduce((acc, cur) => acc + cur.count, 0);

  // Return the response with the total count included
  return [
    {
      data: counts,
      TotalCount: totalCount,
    },
  ];
};

const getPerDayTotalOfferCountsFromDb = async (): Promise<any> => {
  const counts = await CompletedOffer.aggregate([
    {
      $group: {
        _id: {
          date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        },
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        date: '$_id.date',
        count: 1,
      },
    },
    {
      $sort: { date: 1 },
    },
  ]);

  const totalCount = counts.reduce((acc, curr) => acc + curr.count, 0);

  return {
    TotalCount: totalCount,
    offerInfo: counts,
  };
};

const getSpecificUserTotalOfferCounts = async (): Promise<UserDailyTotal[]> => {
  const counts = await CompletedOffer.aggregate([
    {
      $group: {
        _id: {
          userId: '$userId',
          offerId: '$offerId',
          date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: {
          userId: '$_id.userId',
        },
        TotalCount: { $sum: '$count' },
        offerInfo: {
          $push: {
            offerId: '$_id.offerId',
            count: '$count',
            date: '$_id.date',
          },
        },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id.userId',
        foreignField: '_id',
        as: 'userDetails',
      },
    },
    {
      $unwind: '$userDetails',
    },
    {
      $project: {
        _id: 0,
        userId: '$_id.userId',
        TotalCount: 1,
        offerInfo: 1,
        id: '$userDetails.id',
      },
    },
  ]);

  return counts;
};
const getSpecificOfferLiveTimeTotalCountsFromDb = async (): Promise<
  UserDailyTotal[]
> => {
  const counts = await CompletedOffer.aggregate([
    {
      $group: {
        _id: {
          userId: '$userId',
          offerId: '$offerId',
          date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: {
          offerId: '$_id.offerId',
        },
        TotalCount: { $sum: '$count' },
        offerInfo: {
          $push: {
            userId: '$_id.userId',
            count: '$count',
            date: '$_id.date',
          },
        },
      },
    },
    {
      $lookup: {
        from: 'offers',
        localField: '_id.offerId',
        foreignField: '_id',
        as: 'offerDetails',
      },
    },
    {
      $unwind: '$offerDetails',
    },
    {
      $project: {
        _id: 0,
        offerId: '$_id.offerId',
        TotalCount: 1,
        offerInfo: 1,
        name: '$offerDetails.name',
      },
    },
  ]);

  return counts;
};

const getSpecificUserDailyTotals = async (): Promise<UserDailyTotal[]> => {
  const today = moment().startOf('day').toDate();
  const tomorrow = moment().add(1, 'day').startOf('day').toDate();

  const counts = await CompletedOffer.aggregate([
    {
      $match: {
        createdAt: {
          $gte: today,
          $lt: tomorrow,
        },
      },
    },
    {
      $group: {
        _id: {
          userId: '$userId',
          date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        },
        TotalCount: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: 'completedoffers', // Use the correct collection name here
        let: { userId: '$_id.userId', date: '$_id.date' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$userId', '$$userId'] },
                  {
                    $eq: [
                      {
                        $dateToString: {
                          format: '%Y-%m-%d',
                          date: '$createdAt',
                        },
                      },
                      '$$date',
                    ],
                  },
                ],
              },
            },
          },
          {
            $group: {
              _id: '$offerId',
              count: { $sum: 1 },
            },
          },
          {
            $project: {
              _id: 0,
              offerId: '$_id',
              count: 1,
            },
          },
        ],
        as: 'offerInfo',
      },
    },
    {
      $project: {
        _id: 0,
        userId: '$_id.userId',
        TotalCount: 1,
        date: '$_id.date',
        offerInfo: 1,
      },
    },
  ]);

  return counts;
};
const getloggedInUserTotalOfferCountsFromDb = async (
  userId: string,
  date?: string,
): Promise<UserDailyTotal[]> => {
  const matchCriteria: any = { userId: new mongoose.Types.ObjectId(userId) };

  if (date) {
    const startOfDay = moment(date).startOf('day').toDate();
    const endOfDay = moment(date).endOf('day').toDate();
    matchCriteria.createdAt = {
      $gte: startOfDay,
      $lt: endOfDay,
    };
  }

  const counts = await CompletedOffer.aggregate([
    {
      $match: matchCriteria,
    },
    {
      $group: {
        _id: {
          userId: '$userId',
          offerId: '$offerId',
          date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: {
          userId: '$_id.userId',
        },
        TotalCount: { $sum: '$count' },
        offerInfo: {
          $push: {
            offerId: '$_id.offerId',
            count: '$count',
            date: '$_id.date',
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        userId: '$_id.userId',
        TotalCount: 1,
        offerInfo: 1,
      },
    },
  ]);

  return counts;
};

const getLoggedInUserDailyTotalsFromDb = async (
  userId: string,
): Promise<any> => {
  const today = moment().startOf('day').toDate();
  const tomorrow = moment().add(1, 'day').startOf('day').toDate();

  const result = await CompletedOffer.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        createdAt: {
          $gte: today,
          $lt: tomorrow,
        },
      },
    },
    {
      $group: {
        _id: {
          offerId: '$offerId',
        },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: null,
        TotalCount: { $sum: '$count' },
        offerInfo: {
          $push: {
            offerId: '$_id.offerId',
            count: '$count',
          },
        },
      },
    },
    {
      $addFields: {
        userId: new mongoose.Types.ObjectId(userId),
        date: moment(today).format('YYYY-MM-DD'),
      },
    },
    {
      $project: {
        _id: 0,
        TotalCount: 1,
        userId: 1,
        date: 1,
        offerInfo: 1,
      },
    },
  ]);

  if (result.length === 0) {
    return [
      {
        TotalCount: 0,
        userId: userId,
        date: moment(today).format('YYYY-MM-DD'),
        offerInfo: [],
      },
    ];
  }

  return result;
};
const getCompletionLimit = async (offerId: string): Promise<number> => {
  const offer = await Offer.findById(offerId).select('completionLimit').lean();
  if (!offer) {
    throw new Error('Offer not found');
  }
  if (offer.completionLimit === undefined) {
    throw new Error('Completion limit is not defined');
  }
  return offer.completionLimit ?? 0;
};

const getUserCompletedOffersToday = async (
  userId: string,
  offerId: string,
): Promise<number> => {
  const today = moment().startOf('day').toDate();
  const tomorrow = moment().add(1, 'day').startOf('day').toDate();

  const result = await CompletedOffer.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        offerId: new mongoose.Types.ObjectId(offerId),
        createdAt: {
          $gte: today,
          $lt: tomorrow,
        },
      },
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
      },
    },
  ]);

  return result.length > 0 ? result[0].count : 0;
};

// Calculate the hours left for completing the offer
const calculateHoursLeft = async (
  userId: string,
  offerId: string,
): Promise<any> => {
  try {
    const completionLimit = await getCompletionLimit(offerId);
    const completedToday = await getUserCompletedOffersToday(userId, offerId);

    if (completedToday >= completionLimit) {
      const lastCompletedOffer = await CompletedOffer.findOne({
        userId: new mongoose.Types.ObjectId(userId),
        offerId: new mongoose.Types.ObjectId(offerId),
      })
        .sort({ updatedAt: -1 })
        .select('updatedAt')
        .lean();

      if (!lastCompletedOffer) {
        return {
          success: true,
          statusCode: 200,
          message: `Offer completion status retrieved successfully`,
          data: {
            message: `Today's completion limit for this offer is reached. Next available completion time is in 10 hours.`,
            'hours-left': 10,
          },
        };
      }

      const lastCompletionTime = moment(lastCompletedOffer.updatedAt);
      const nextAvailableTime = lastCompletionTime.add(10, 'hours');
      const hoursLeft = nextAvailableTime.diff(moment(), 'hours');

      return {
        message: `Today's completion limit for this offer is reached. Next available completion time is in ${hoursLeft} hours.`,
        'hours-left': hoursLeft,
      };
    } else {
      return {
        message: `You have available completion time.`,
        'hours-left': 24,
      };
    }
  } catch (error: any) {
    if (error.message === 'Offer not found') {
      return {
        success: false,
        statusCode: 404,
        message: `Offer not found`,
      };
    }
    return {
      success: false,
      statusCode: 500,
      message: `An error occurred: ${error.message}`,
    };
  }
};

///new for offerName Loogeduser
const getLoggedInUserOfferNameCountsFromDb = async (
  userId: string,
): Promise<any[]> => {
  const matchCriteria: any = { userId: new mongoose.Types.ObjectId(userId) };

  const counts = await CompletedOffer.aggregate([
    {
      $match: matchCriteria,
    },
    {
      $group: {
        _id: {
          userId: '$userId',
          offerId: '$offerId',
        },
        count: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: 'offers', // Adjust the collection name based on your database
        localField: '_id.offerId',
        foreignField: '_id',
        as: 'offerDetails',
      },
    },
    {
      $unwind: '$offerDetails',
    },
    {
      $group: {
        _id: {
          userId: '$_id.userId',
        },
        TotalCount: { $sum: '$count' },
        offerInfo: {
          $push: {
            offerId: '$_id.offerId',
            offerName: '$offerDetails.name', // Adjust based on your schema
            count: '$count',
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        userId: '$_id.userId',
        TotalCount: 1,
        offerInfo: 1,
      },
    },
  ]);

  return counts;
};
export const CompletedOfferServices = {
  getAllCompletedOffersFromDB,
  createCompletedOfferIntoDB,
  getTotalOfferCounts,
  getDailyOfferTotals,
  getSpecificUserDailyTotals,
  getSpecificUserTotalOfferCounts,
  getSpecificOfferLiveTimeTotalCountsFromDb,
  getPerDayTotalOfferCountsFromDb,
  getloggedInUserTotalOfferCountsFromDb,
  getLoggedInUserDailyTotalsFromDb,
  calculateHoursLeft,
  getLoggedInUserOfferNameCountsFromDb,
  // getSingleCompletedOfferFromDB,
  // updateCompletedOfferIntoDB,
  // deleteCompletedOfferFromDB,
};
