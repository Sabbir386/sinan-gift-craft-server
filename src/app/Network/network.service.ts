/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import mongoose from 'mongoose';

import AppError from '../errors/AppError';

import QueryBuilder from '../builder/QueryBuilder';


import { NetworkSearchableFields } from './network.constant';
import { Network } from './network.model';
import { TNetwork } from './network.interface';

const createNetworkIntoDB = async (
  payload: TNetwork,
  userObjectId: mongoose.Types.ObjectId,
) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // Assign the logged-in user's ID to the userTrack field and userRole Field
    payload.userTrack = userObjectId;
    // Create the Network
    const newNetwork = await Network.create([payload], { session });

    if (!newNetwork.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Network');
    }

    await session.commitTransaction();
    await session.endSession();

    return newNetwork;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};
const getAllNetworksFromDB = async (query: Record<string, unknown>) => {
  const NetworkQuery = new QueryBuilder(Network.find(), query)
    .search(NetworkSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await NetworkQuery.modelQuery;
  const meta = await NetworkQuery.countTotal();
  console.log(meta);
  return {
    result,
    meta,
  };
};

const getSingleNetworkFromDB = async (id: string) => {
  const result = await Network.findById(id);
  return result;
};
const deleteNetworkFromDB = async (id: string) => {
  const result = await Network.findByIdAndDelete(id);
  return result;
};
const updateNetworkIntoDB = async (id: string, payload: Partial<TNetwork>) => {
  const result = await Network.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

export const NetworkServices = {
  getAllNetworksFromDB,
  createNetworkIntoDB,
  getSingleNetworkFromDB,
  updateNetworkIntoDB,
  deleteNetworkFromDB,
};
