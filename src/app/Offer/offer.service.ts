import mongoose from 'mongoose';
import httpStatus from 'http-status';
import AppError from '../errors/AppError';
import { Offer } from './offer.model';
import { TOffer } from './offer.interface';
import QueryBuilder from '../builder/QueryBuilder';
import { OfferSearchableFields } from './offer.constant';
import { Network } from '../Network/network.model';
const createOfferIntoDB = async (
  payload: TOffer,
  id: string,
  role: string,
  userObjectId: mongoose.Types.ObjectId,
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Assign the logged-in user's ID to the userTrack field and userRole Field
    payload.userTrack = userObjectId;
    payload.userRole = role;

    // Create the offer
    const newOffer = await Offer.create([payload], { session });

    if (!newOffer.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create offer');
    }

    await session.commitTransaction();
    await session.endSession();

    return newOffer;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const getAllOffersFromDB = async (query: Record<string, unknown>) => {
  console.log('Incoming query:', query);

  const offerQuery = new QueryBuilder(Offer.find(), query)
    .lookup([
      {
        from: 'categories',
        localField: 'category',
        foreignField: '_id',
        as: 'categoryInfo',
      },
      {
        from: 'networks',
        localField: 'network',
        foreignField: '_id',
        as: 'networkInfo',
      },
    ])
    .filter()
    .search(OfferSearchableFields)
    .sort()
    .paginate()
    .fields();

  const result = await offerQuery.modelQuery.exec();
  const total = await Offer.countDocuments(query);

  return {
    result,
    meta: {
      page: 1,
      limit: Offer.length,
      total: total,
      totalPage: Math.ceil(total / 10),
    },
  };
};

const getSingleOfferFromDB = async (id: string) => {
  const result = await Offer.findById(id);
  return result;
};

// const updateOfferInDb = async (id: string, payload: Partial<TOffer>) => {
//   const { name, ...remainingOfferData } = payload;
//   const modifiedUpdatedData: Record<string, unknown> = {
//     ...remainingOfferData,
//   };

//   if (name && Object.keys(name).length) {
//     modifiedUpdatedData.name = name; // Set the entire name object in the payload
//   }

//   const result = await Offer.findByIdAndUpdate(id, modifiedUpdatedData, {
//     new: true,
//     runValidators: true,
//   });

//   return result;
// };
// const updateOfferInDb = async (id: string, payload: Partial<TOffer>) => {
//   const result = await Offer.findByIdAndUpdate(id, payload, {
//     new: true,
//     runValidators: true,
//   });

//   return result;
// };
const updateOfferInDb = async (id: string, payload: Partial<TOffer>) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid ID format');
  }

  const result = await Offer.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new Error('Offer not found');
  }

  return result;
};
const toggleOfferStatusInDb = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid ID format');
  }

  const offer = await Offer.findById(id);
  if (!offer) {
    throw new Error('Offer not found');
  }

  offer.offerStatus = offer.offerStatus === 'active' ? 'inactive' : 'active';
  const result = await offer.save();

  return result;
};

const deleteOfferFromDB = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // const deletedOffer = await Offer.findByIdAndUpdate(
    //   id,
    //   { isDeleted: true },
    //   { new: true, session },
    // );
    const deletedOffer = await Offer.findByIdAndDelete(id, { session });

    if (!deletedOffer) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete offer');
    }

    // Optionally, perform any additional cleanup or related operations her

    await session.commitTransaction();
    await session.endSession();

    return deletedOffer;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};
const getAdminOffersFromDb = async () => {
  const result = await Offer.find({ userRole: 'admin' }).sort({
    point: -1,
  });
  return result;
};

const getAdvertiserOffersFromDb = async () => {
  const result = await Offer.find({ userRole: 'advertiser' });
  return result;
};

const getDailyCompletedOfferReportFromDb = async () => {
  const currentDate = new Date();

  const startDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate(),
    0,
    0,
    0,
    0,
  );

  const endDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate(),
    23,
    59,
    59,
    999,
  );

  const report = await Offer.find({
    offerStatus: 'completed',
    createdAt: { $gte: startDate, $lte: endDate },
  });
  return report;
};
const getNetworksWithOffersFromDb = async () => {
  try {
    const networksWithOffers = await Offer.aggregate([
      {
        $lookup: {
          from: 'networks',
          localField: 'network',
          foreignField: '_id',
          as: 'networkDetails',
        },
      },
      {
        $unwind: '$networkDetails',
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryDetails',
        },
      },
      {
        $unwind: '$categoryDetails',
      },
      {
        $group: {
          _id: '$networkDetails._id',
          networkName: { $first: '$networkDetails.networkName' },
          offers: {
            $push: {
              _id: '$_id',
              userTrack: '$userTrack',
              userRole: '$userRole',
              name: '$name',
              network: '$network',
              category: '$category',
              categoryName: '$categoryDetails.categoryName',
              device: '$device',
              country: '$country',
              gender: '$gender',
              offerLink: '$offerLink',
              offerStatus: '$offerStatus',
              dailyLimit: '$dailyLimit',
              totalLimit: '$totalLimit',
              price: '$price',
              description: '$description',
              terms: '$terms',
              image: '$image',
              points: '$points',
              completionLimit: '$completionLimit',
              completionWindow: '$completionWindow',
              completedCount: '$completedCount',
              startDate: '$startDate',
              endDate: '$endDate',
              isDeleted: '$isDeleted',
              createdAt: '$createdAt',
              updatedAt: '$updatedAt',
            },
          },
        },
      },
    ]);

    return networksWithOffers;
  } catch (error) {
    // Handle any potential errors here
    console.error('Error retrieving networks with offers:', error);
    throw error; // Optionally rethrow or handle as needed
  }
};

// survey wall offers 
const filterOffersByNetwork = async (networkName :any) => {
  console.log(networkName)
  try {
    const offers = await Offer.aggregate([
      {
        $lookup: {
          from: 'networks',
          localField: 'network',
          foreignField: '_id',
          as: 'networkDetails',
        },
      },
      {
        $unwind: '$networkDetails',
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryDetails',
        },
      },
      {
        $unwind: '$categoryDetails',
      },
      {
        $match: {
          'networkDetails.networkName': networkName, // Filtering by the network name from query params
        },
      },
      {
        $group: {
          _id: '$networkDetails._id',
          networkName: { $first: '$networkDetails.networkName' },
          offers: {
            $push: {
              // Include all the offer fields here
              _id: '$_id',
              userTrack: '$userTrack',
              userRole: '$userRole',
              name: '$name',
              network: '$network',
              category: '$category',
              categoryName: '$categoryDetails.categoryName',
              device: '$device',
              country: '$country',
              gender: '$gender',
              offerLink: '$offerLink',
              offerStatus: '$offerStatus',
              dailyLimit: '$dailyLimit',
              totalLimit: '$totalLimit',
              price: '$price',
              description: '$description',
              terms: '$terms',
              image: '$image',
              points: '$points',
              completionLimit: '$completionLimit',
              completionWindow: '$completionWindow',
              completedCount: '$completedCount',
              startDate: '$startDate',
              endDate: '$endDate',
              isDeleted: '$isDeleted',
              createdAt: '$createdAt',
              updatedAt: '$updatedAt',
            },
          },
        },
      },
    ]);

    return offers;
  } catch (error) {
    console.error('Error filtering offers by network:', error);
    throw error;
  }
};






export const OfferServices = {
  createOfferIntoDB,
  getAllOffersFromDB,
  getSingleOfferFromDB,
  deleteOfferFromDB,
  updateOfferInDb,
  getDailyCompletedOfferReportFromDb,
  getAdminOffersFromDb,
  getAdvertiserOffersFromDb,
  toggleOfferStatusInDb,
  getNetworksWithOffersFromDb,
  filterOffersByNetwork,
};
