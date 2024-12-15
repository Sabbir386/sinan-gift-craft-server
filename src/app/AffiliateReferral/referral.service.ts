import { NormalUser } from '../NormalUser/normalUser.model';
const getReferredUsers = async (referralId: string) => {
  try {
    // Fetch referred users with rewards data
    const referredUsersWithRewards = await NormalUser.aggregate([
      {
        $match: {
          referredBy: referralId,
          isDeleted: false,
        },
      },
      {
        $lookup: {
          from: 'rewards', // Collection name for rewards
          localField: 'user', // Field in `NormalUser` model
          foreignField: 'userId', // Field in `Reward` model
          as: 'rewardData',
        },
      },
      {
        $unwind: {
          path: '$rewardData',
          preserveNullAndEmptyArrays: true, // Handle users with no rewards
        },
      },
      {
        $addFields: {
          userTotalRewards: {
            $ifNull: [
              {
                $add: [
                  // { $ifNull: ['$rewardData.loginRewards', 0] },
                  // { $ifNull: ['$rewardData.taskCompletedRewards', 0] },
                  { $ifNull: ['$rewardData.surveyCompletedRewards', 0] },
                  // { $ifNull: ['$rewardData.socialMediaRewards', 0] },
                  { $ifNull: ['$rewardData.offerCompletedRewards', 0] },
                  // { $ifNull: ['$rewardData.referralRewards', 0] },
                  // { $ifNull: ['$rewardData.signUpBonus', 0] },
                ],
              },
              0,
            ],
          },
        },
      },
      {
        $addFields: {
          fifteenPercentOfRewards: {
            $multiply: ['$userTotalRewards', 0.15],
          },
        },
      },
      {
        $project: {
          _id: 1,
          id: 1,
          user: 1,
          country: 1,
          name: 1,
          email: 1,
          referralId: 1,
          referredBy: 1,
          refferCount: 1,
          userTotalRewards: 1,
          fifteenPercentOfRewards: 1,
        },
      },
    ]);

    // Calculate total referrals and total earnings
    const totalReferrals = referredUsersWithRewards.length;
    const totalEarnings = referredUsersWithRewards.reduce(
      (sum, user) => sum + (user.fifteenPercentOfRewards || 0),
      0
    );

    // Format the response
    return {
      totalReferrals,
      totalEarnings,
      referredUsers: referredUsersWithRewards,
    };

  } catch (error) {
    console.error('Error fetching referred users:', error);
    throw new Error('Failed to fetch referred users');
  }
};

export const ReferralServices = {
  getReferredUsers,
};
