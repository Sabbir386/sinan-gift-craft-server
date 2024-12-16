/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../errors/AppError';
import { TUser } from './user.interface';
import { User } from './user.model';
import { Admin } from '../Admin/admin.model';
import { TAdmin } from '../Admin/admin.interface';
import config from '../config';
import mongoose from 'mongoose';
import {
  generateAdminId,
  generateAdvertiserId,
  generateid,
} from './user.utils';
import { sendImageToCloudinary } from '../utilis/sendImageToCloudinary';
import { TAdvertiser } from '../Advertiser/advertiser.interface';
import { Advertiser } from '../Advertiser/advertiser.model';
import { TNormalUser } from '../NormalUser/normalUser.interface';
import { NormalUser } from '../NormalUser/normalUser.model';
import Reward from '../Rewards/reward.model';


const createUserIntoDb = async (
  file: any,
  password: string,
  payload: TNormalUser,
) => {
  const userData: Partial<TUser> = {};
  userData.password = password || 'defaultPassword';
  userData.role = 'user';
  userData.isDeleted = false;
  userData.email = payload.email;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // Generate unique ID and referral ID
    userData.id = await generateid();
    userData.referralId = `CZ${userData.id}`;
    payload.referralId = userData.referralId;

    // Handle referredBy logic
    if (!payload.referredBy) {
      payload.referredBy = 'self';
    } else {
      const referrer = await User.findOne({ referralId: payload.referredBy }).session(session);

      if (!referrer) {
        console.warn(`Invalid referral ID (${payload.referredBy}). Defaulting to 'self'.`);
        payload.referredBy = 'self';
      } else {
        const userUpdateResult = await User.updateOne(
          { _id: referrer._id },
          { $inc: { refferCount: 1 } },
          { session }
        );
        const normalUserUpdateResult = await NormalUser.updateOne(
          { user: referrer._id },
          { $inc: { refferCount: 1 } },
          { session }
        );
        if (!userUpdateResult.modifiedCount || !normalUserUpdateResult.modifiedCount) {
          console.error(`Failed to increment referrer count for: ${referrer._id}`);
          throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to update referrer counts');
        }
      }
    }
    // **Set referredBy field in userData**
    userData.referredBy = payload.referredBy;

    // Handle image upload if file is provided
    if (file) {
      const imageName = `${userData.id}${payload?.name || 'default'}`;
      const path = file?.path;

      if (!path || typeof path !== 'string') {
        throw new AppError(httpStatus.BAD_REQUEST, 'File path is required and must be a string');
      }

      const { secure_url } = await sendImageToCloudinary(imageName, path);
      payload.profileImg = secure_url as string;
    }
    // Temporarily commenting out IP-related functionality
    // payload.ip = '114.130.152.s354s'; // Example IP field
    // Create User document
    const newUser = await User.create([userData], { session });
    if (!newUser.length) throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create User');

    // Create NormalUser document
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id;
    payload.refferCount = 0; // Initialize new user's refferCount to 0
    const newNormalUser = await NormalUser.create([payload], { session });

    if (!newNormalUser.length) throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create NormalUser');

    // Initialize the reward record for the user
    // const reward = new Reward({
    //   userId: newUser[0]._id,
    //   claimedDays: [],
    //   loginRewards: 0,
    //   claimCount: 0,
    //   taskCompletedRewards: 0,
    //   taskClaimCount: 0,
    //   surveyCompletedRewards: 0,
    //   signUpBonus: 500, 
    // });
    // await reward.save();

    // Commit the transaction
    await session.commitTransaction();
    await session.endSession();

    return newNormalUser;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();

    if (err.code === 11000 && err.keyPattern.email) {
      throw new AppError(httpStatus.CONFLICT, 'Email already exists');
    }

    console.error('Unexpected error during user creation:', err);
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'An unexpected error occurred');
  }
};


const findByEmailIntoDb = async (email: string) => {
  const user = await User.findOne({ email }).populate({
    path: 'user',
    options: { strictPopulate: false },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  return user;
};
const createAdminIntoDB = async (
  file: any,
  password: string,
  payload: TAdmin,
) => {
  // create a user object
  const userData: Partial<TUser> = {};

  //if password is not given , use deafult password
  userData.password = password || (config.default_password as string);

  //set user role
  userData.role = 'admin';
  //set admin email
  userData.email = payload.email;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //set  generated id
    userData.id = await generateAdminId();

    if (file) {
      const imageName = `${userData.id}${payload?.name?.firstName}`;
      const path = file?.path;
      //send image to cloudinary
      const { secure_url } = await sendImageToCloudinary(imageName, path);
      payload.profileImg = secure_url as string;
    }

    // create a user (transaction-1)
    const newUser = await User.create([userData], { session });

    //create a admin
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }
    // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id

    // create a admin (transaction-2)
    const newAdmin = await Admin.create([payload], { session });

    if (!newAdmin.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }

    await session.commitTransaction();
    await session.endSession();

    return newAdmin;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};
const createAdvertiserIntoDB = async (
  file: any,
  password: string,
  payload: TAdvertiser,
) => {
  // create a user object
  const userData: Partial<TUser> = {};

  //if password is not given , use deafult password
  userData.password = password || (config.default_password as string);

  //set user role
  userData.role = 'advertiser';
  //set admin email
  userData.email = payload.email;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //set  generated id
    userData.id = await generateAdvertiserId();

    if (file) {
      const imageName = `${userData.id}${payload?.name}`;
      const path = file?.path;
      //send image to cloudinary
      const { secure_url } = await sendImageToCloudinary(imageName, path);
      payload.profileImg = secure_url as string;
    }

    // create a user (transaction-1)
    const newUser = await User.create([userData], { session });

    //create a admin
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create advertiser');
    }
    // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id

    // create a admin (transaction-2)
    const newAdvertiser = await Advertiser.create([payload], { session });

    if (!newAdvertiser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Advertiser');
    }

    await session.commitTransaction();
    await session.endSession();

    return newAdvertiser;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};
const getMe = async (id: string, role: string) => {
  let result = null;
  console.log('from get me service', id, role);
  if (role === 'user') {
    // result = await User.findOne({ id: id }).populate('user');
    result = await User.findOne({ id: id }).populate({
      path: 'user',
      options: { strictPopulate: false },
    });
  }
  if (role === 'admin') {
    // result = await Admin.findOne({ id: id }).populate('user');
    result = await Admin.findOne({ id: id }).populate({
      path: 'user',
      options: { strictPopulate: false },
    });
  }

  return result;
};

const changeStatus = async (id: string, payload: { status: string }) => {
  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};
export const UserServices = {
  createUserIntoDb,
  createAdminIntoDB,
  createAdvertiserIntoDB,
  getMe,
  changeStatus,
  findByEmailIntoDb,
};
