import { Request, Response } from "express";
import { claimBonus, getUserReward, getUserTotalRewards, updateOfferCompletedReward, updateReferralCompletedReward, updateSocialMediaPostReward, updateSurveyCompletedReward, updateTaskCompletedReward } from "./reward.service";
import Reward from "./reward.model";

export const claimBonusController = async (req: Request, res: Response) => {
  const { objectId } = req.user; // Ensure this comes from decoded token

  try {
    const today = new Date();
    const day = today.getDate();
    const month = today.toLocaleString('default', { month: 'long' });

    const reward = await claimBonus({ userId: objectId, day, month });

    res.json({
      message: "Bonus claimed successfully.",
      loginRewards: reward.loginRewards,
      claimedDays: reward.claimedDays,
      claimCount: reward.claimCount,
      taskCompletedRewards: reward.taskCompletedRewards, // Include the new field
      taskClaimCount: reward.taskClaimCount, // Include the new field
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};




export const getUserRewardController = async (req: Request, res: Response) => {
  const { objectId } = req.user; // Ensure objectId is from decoded token

  try {
    let reward = await getUserReward(objectId);

    if (!reward) {
      // If no reward is found, create a new one with initial values
      reward = new Reward({
        userId: objectId,
        claimedDays: [],
        loginRewards: 0,
        claimCount: 0,
        taskCompletedRewards: 0,
        taskClaimCount: 0,
        surveyCompletedRewards: 0,
        offerCompletedRewards: 0,
        socialMediaRewards: 0,
        signUpBonus: 0,
        referralRewards: 0, // Initialize with 0
        referralClaimCount: 0, // Initialize with 0
        referralCommissionRewards: 0, // Initialize with 0
      });
      await reward.save(); // Save the new reward record
    }

    // Respond with all fields
    res.json({
      loginRewards: reward.loginRewards,
      claimedDays: reward.claimedDays,
      claimCount: reward.claimCount,
      taskCompletedRewards: reward.taskCompletedRewards,
      taskClaimCount: reward.taskClaimCount,
      surveyCompletedRewards: reward.surveyCompletedRewards,
      offerCompletedRewards: reward.offerCompletedRewards,
      socialMediaRewards: reward.socialMediaRewards,
      signUpBonus: reward.signUpBonus,
      referralRewards: reward.referralRewards, // Include the new field
      referralClaimCount: reward.referralClaimCount, // Include the new field
      referralCommissionRewards: reward.referralCommissionRewards, // Include the new field
    });
  } catch (error: any) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const taskCompletedController = async (req: Request, res: Response) => {
  const { userId, taskReward } = req.query; // Use query parameters as per the requirement

  // Ensure userId and taskReward are provided
  if (!userId || !taskReward) {
    return res.status(400).json({ error: "userId and taskReward are required." });
  }

  try {
    // Update task rewards and increment taskClaimCount
    const reward = await updateTaskCompletedReward(userId.toString(), Number(taskReward));

    // Increment the taskClaimCount
    reward.taskClaimCount += 1;

    // Save the updated reward
    await reward.save();

    // Send the response with updated reward information
    res.json({
      message: "Task completed reward updated successfully.",
      taskCompletedRewards: reward.taskCompletedRewards,
      taskClaimCount: reward.taskClaimCount, // Return the updated taskClaimCount
      loginRewards: reward.loginRewards, // Optional: Include login rewards if needed
      claimedDays: reward.claimedDays, // Optional: Include claimed days if needed
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};


// survey  copmleted  
export const surveyCompletedController = async (req: Request, res: Response) => {
  const { userId, surveyReward } = req.query;

  // Ensure `userId` and `surveyReward` are present
  if (!userId || !surveyReward) {
    return res.status(400).json({ error: "userId and surveyReward are required." });
  }

  try {
    // Update survey rewards and loginRewards
    const reward = await updateSurveyCompletedReward(userId.toString(), Number(surveyReward));

    res.json({
      message: "Survey reward updated successfully.",
      surveyCompletedRewards: reward.surveyCompletedRewards,
      loginRewards: reward.loginRewards,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const offerCompletedController = async (req: Request, res: Response) => {
  const { userId, offerReward } = req.query;

  // Ensure `userId` and `offerReward` are provided
  if (!userId || !offerReward) {
    return res.status(400).json({ error: "userId and offerReward are required." });
  }

  try {
    // Update offer rewards
    const reward = await updateOfferCompletedReward(userId.toString(), Number(offerReward));

    res.json({
      message: "Offer completed reward updated successfully.",
      offerCompletedRewards: reward.offerCompletedRewards,
      loginRewards: reward.loginRewards,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const socialMediaPostController = async (req: Request, res: Response) => {
  const { userId, socialMediaReward } = req.query; // Expecting query parameters

  if (!userId || !socialMediaReward) {
    return res.status(400).json({ error: "userId and socialMediaReward are required." });
  }

  try {
    // Update social media rewards
    const reward = await updateSocialMediaPostReward(userId.toString(), Number(socialMediaReward));

    res.json({
      message: "Social media post reward updated successfully.",
      socialMediaRewards: reward.socialMediaRewards,
      loginRewards: reward.loginRewards, // Include login rewards if needed
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const referralCompletedController = async (req: Request, res: Response) => {
  const { userId, referralReward } = req.query;

  // Ensure userId and referralReward are provided
  if (!userId || !referralReward) {
    return res.status(400).json({ error: "userId and referralReward are required." });
  }

  try {
    // Update referral rewards and increment referralClaimCount
    const reward = await updateReferralCompletedReward(userId.toString(), Number(referralReward));

    reward.referralClaimCount += 1; // Increment referral claim count

    await reward.save();

    res.json({
      message: "Referral reward updated successfully.",
      referralRewards: reward.referralRewards,
      referralClaimCount: reward.referralClaimCount, // Include updated claim count
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// user totatl rewarsd/points 

export const userTotalRewardsController = async (req: Request, res: Response) => {
  const { userId } = req.query;

  if (!userId) {
    return res
      .status(400)
      .json({ error: 'userId is required in the query parameters.' });
  }

  try {
    // Get the total rewards for the user
    const totalRewards = await getUserTotalRewards(userId.toString());

    return res.json({
      message: 'User total rewards retrieved successfully.',
      ...totalRewards,
    });
  } catch (error: any) {
    console.error('Error fetching user rewards:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
