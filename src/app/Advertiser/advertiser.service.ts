import httpStatus from 'http-status';
import mongoose from 'mongoose';
import AppError from '../errors/AppError';
import { User } from '../User/user.model';
import QueryBuilder from '../builder/QueryBuilder';
import { AdvertiserSearchableFields } from './advertiser.constant';
import { TAdvertiser } from './advertiser.interface';
import { Advertiser } from './advertiser.model';

const getAllAdvertisersFromDB = async (query: Record<string, unknown>) => {
  const advertiserQuery = new QueryBuilder(
    Advertiser.find({ isDeleted: false }).select(
      '_id id user designation name gender dateOfBirth email contactNo emergencyContactNo bloodGroup presentAddress permanentAddress profileImg isDeleted'
    ), // Select specific fields and filter by isDeleted
    query
  )
    .search(AdvertiserSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await advertiserQuery.modelQuery;
  const meta = await advertiserQuery.countTotal();

  return {
    result,
    meta,
  };
};


const getSingleAdvertiserFromDB = async (id: string) => {
  const result = await Advertiser.findById(id);
  return result;
};

const updateAdvertiserIntoDB = async (
  id: string,
  payload: Partial<TAdvertiser>,
) => {
  const result = await Advertiser.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteAdvertiserFromDB = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const deletedAdvertiser = await Advertiser.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );
    

    if (!deletedAdvertiser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete advertiser');
    }

    // get user _id from deletedAdvertiser
    const userId = deletedAdvertiser.user;

    const deletedUser = await User.findByIdAndDelete(userId, { session });

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user');
    }

    await session.commitTransaction();
    await session.endSession();

    return deletedAdvertiser;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

export const AdvertiserServices = {
  getAllAdvertisersFromDB,
  getSingleAdvertiserFromDB,
  updateAdvertiserIntoDB,
  deleteAdvertiserFromDB,
};
