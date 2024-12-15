import mongoose from 'mongoose';
import { AffiliateReward } from './affiliateReward.model';
import Reward from '../Rewards/reward.model';

const createAffiliateReward = async (
  userId: string,
  referralId: string,
  claimedAmount: number
) => {
  // Check if userId is valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user ID format.");
  }

  // Convert userId to ObjectId
  const objectIdUser = new mongoose.Types.ObjectId(userId);

  // Fetch existing rewards for this user and referralId
  const existingRewards = await AffiliateReward.find({
    user: objectIdUser,
    referralId,
    isDeleted: false,
  });

  // Calculate total claimed rewards
  const totalClaimedRewards = existingRewards.reduce(
    (total, reward) => total + reward.referralRewardsAmount,
    0
  );

  // Validate if the claimed amount is valid
  const adjustedClaimedAmount = claimedAmount - totalClaimedRewards;
  if (adjustedClaimedAmount <= 0) {
    throw new Error(
      `Claimed amount is invalid. Total already claimed: ${totalClaimedRewards}`
    );
  }

  // Create a new affiliate reward
  const affiliateReward = new AffiliateReward({
    user: objectIdUser,
    referralId,
    referralRewardsAmount: adjustedClaimedAmount,
  });

  await affiliateReward.save();

  //adding rewards on collection  this claim value value..
  //  adjustedClaimedAmount : Math.floor(claimedAmount - totalClaimedRewards);
   
  const aggregation = [
    {
      $match: {
        userId: objectIdUser, // Match the userId
      },
    },
    {
      $group: {
        _id: "$userId", // Group by userId
        totalClaimedAmount: { $sum: "$adjustedClaimedAmount" }, // Sum the claimedAmount
      },
    },
    {
      $merge: {
        into: "rewards", // Merge the result back into the Reward collection
        whenMatched: "merge", // Merge if matching document exists
        whenNotMatched: "insert", // Insert new document if no match
      },
    },
  ];

  // Run the aggregation pipeline
  await mongoose.connection.db.collection("affiliateRewards").aggregate(aggregation).toArray();

  // Find the updated reward document
  const reward = await Reward.findOne({ userId: objectIdUser });

  if (!reward) {
    throw new Error("No reward record found for the given user.");
  }

  // Update the referralCommissionRewards field with the summed value
  reward.referralCommissionRewards += adjustedClaimedAmount;

  // Save the updated document
  await reward.save();

  // Check if the update was successful
  // if (!result) {
  //   throw new Error("No matching reward document found for the user.");
  // }


  return {
    userId,
    referralId,
    claimedAmount: adjustedClaimedAmount,
  };
};


const calculateTotalRewards = async (userId: string) => {
  // Convert userId to ObjectId
  const objectIdUser = new mongoose.Types.ObjectId(userId);

  // Fetch all rewards for the user
  const affiliateRewards = await AffiliateReward.find({
    user: objectIdUser,
    isDeleted: false,
  });

  if (affiliateRewards.length === 0) {
    return {
      totalRewards: 0,
    };
  }

  // Calculate total rewards
  const totalRewards = affiliateRewards.reduce(
    (total, reward) => total + reward.referralRewardsAmount,
    0
  );

  return {
    totalRewards,
  };
};

export const AffiliateRewardService = {
  createAffiliateReward,
  calculateTotalRewards,
};
