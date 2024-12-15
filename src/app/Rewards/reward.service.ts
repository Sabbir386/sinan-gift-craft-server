import Reward from "./reward.model";

interface ClaimBonusData {
  userId: string;
  day: number; // Current day
  month: string; // Current month as a name
}
interface TaskCompletedData {
  userId: string;
  taskReward: number;
}
export const claimBonus = async ({ userId, day, month }: ClaimBonusData) => {
  let userReward = await Reward.findOne({ userId });

  // If user doesn't have a reward record, create one
  if (!userReward) {
    userReward = new Reward({
      userId,
      claimedDays: [],
      loginRewards: 0,
      claimCount: 0,  // Initialize claim count to 0
      taskCompletedRewards: 0, // Initialize with 0
      taskClaimCount: 0, // Initialize with 0
      surveyCompletedRewards: 0,
    });
  }

  // Check if the bonus has already been claimed for the current day and month
  const hasClaimed = userReward.claimedDays.some(
    (entry) => entry.day === day && entry.month === month
  );

  if (hasClaimed) {
    throw new Error("Bonus already claimed for this day and month.");
  }

  // Update claimed days and total CZ
  userReward.claimedDays.push({ day, month });
  userReward.loginRewards += 5; // Assuming the bonus is 5 CZ
  userReward.claimCount += 1; // Increment the claim count

  // Save the updated record
  await userReward.save();

  return userReward;
};



export const getUserReward = async (userId: string) => {
  const userReward = await Reward.findOne({ userId });
  return userReward;
};

export const updateTaskCompletedReward = async (userId: string, taskReward: number) => {
  let userReward = await Reward.findOne({ userId });

  // If user doesn't have a reward record, create one
  if (!userReward) {
    userReward = new Reward({
      userId,
      taskCompletedRewards: taskReward,  // Initialize with the passed reward value
      taskClaimCount: 0,  // Initialize taskClaimCount 
      claimedDays: [],
      loginRewards: 0,
      claimCount: 0,  // Initialize claim count to 0
      surveyCompletedRewards: 0,
    });
  } else {
    // Add the current task reward to the existing value
    userReward.taskCompletedRewards += taskReward;
  }

  // Save the updated record
  await userReward.save();

  return userReward;
};

export const updateSurveyCompletedReward = async (userId: string, surveyReward: number) => {
  let userReward = await Reward.findOne({ userId });

  // Create a new reward record if none exists
  if (!userReward) {
    userReward = new Reward({
      userId,
      surveyCompletedRewards: surveyReward,
      claimedDays: [],
      loginRewards: 0,
      claimCount: 0,  // Initialize claim count to 0
      taskCompletedRewards: 0, // Initialize with 0
      taskClaimCount: 0, // Initialize with 0

    });
  } else {
    // Update survey and total rewards
    userReward.surveyCompletedRewards += surveyReward;
  }

  await userReward.save();
  return userReward;
};

export const updateOfferCompletedReward = async (userId: string, offerReward: number) => {
  let userReward = await Reward.findOne({ userId });

  // Create a new reward record if none exists
  if (!userReward) {
    userReward = new Reward({
      userId,
      offerCompletedRewards: offerReward,
      claimedDays: [],
      loginRewards: 0,
      claimCount: 0,
      taskCompletedRewards: 0,
      taskClaimCount: 0,
      surveyCompletedRewards: 0,
      socialMediaRewards: 0,
    });
  } else {
    // Update the existing offerCompletedRewards value
    userReward.offerCompletedRewards += offerReward;
  }

  await userReward.save();
  return userReward;
};

// calcualte user total rewqarsd/points 
export const getUserTotalRewards = async (userId: string) => {
  const userReward = await Reward.findOne({ userId });

  if (!userReward) {
    return {
      loginRewards: 0,
      taskCompletedRewards: 0,
      surveyCompletedRewards: 0,
      socialMediaRewards: 0,
      offerCompletedRewards: 0, // Include offerCompletedRewards
      signUpBonus: 0,
      referralRewards: 0, 
      userTotalRewards: 0,
      referralCommissionRewards: 0,
    };
  }

  const loginRewards = userReward.loginRewards || 0;
  const taskCompletedRewards = userReward.taskCompletedRewards || 0;
  const surveyCompletedRewards = userReward.surveyCompletedRewards || 0;
  const socialMediaRewards = userReward.socialMediaRewards || 0;
  const offerCompletedRewards = userReward.offerCompletedRewards || 0; // Include offerCompletedRewards
  const referralRewards = userReward.referralRewards || 0;
  const signUpBonus = userReward.signUpBonus || 0;
  const referralCommissionRewards = userReward.referralCommissionRewards || 0;

  const userTotalRewards =
    loginRewards +
    taskCompletedRewards +
    surveyCompletedRewards +
    socialMediaRewards +
    offerCompletedRewards +
    referralRewards +
    signUpBonus+
    referralCommissionRewards;

  return {
    signUpBonus,
    loginRewards,
    taskCompletedRewards,
    surveyCompletedRewards,
    socialMediaRewards,
    offerCompletedRewards,
    referralRewards,
    userTotalRewards,
    referralCommissionRewards,
  };
};

export const updateSocialMediaPostReward = async (userId: string, socialMediaReward: number) => {
  let userReward = await Reward.findOne({ userId });

  // Create a new reward record if none exists
  if (!userReward) {
    userReward = new Reward({
      userId,
      socialMediaRewards: socialMediaReward, // Initialize with the reward value
      claimedDays: [],
      loginRewards: 0,
      claimCount: 0,
      taskCompletedRewards: 0,
      taskClaimCount: 0,
      surveyCompletedRewards: 0,
    });
  } else {
    // Add the reward to the existing socialMediaRewards value
    userReward.socialMediaRewards += socialMediaReward;
  }

  await userReward.save();

  return userReward;
};
export const updateReferralCompletedReward = async (userId: string, referralReward: number) => {
  let userReward = await Reward.findOne({ userId });

  if (!userReward) {
    userReward = new Reward({
      userId,
      referralRewards: referralReward, // Initialize with the passed reward value
      referralClaimCount: 0, // Initialize referralClaimCount
      claimedDays: [],
      loginRewards: 0,
      claimCount: 0,
      taskCompletedRewards: 0,
      taskClaimCount: 0,
      surveyCompletedRewards: 0,
      referralCommissionRewards: 0,
    });
  } else {
    // Add the current referral reward to the existing value
    userReward.referralRewards += referralReward;
  }

  await userReward.save();

  return userReward;
};


