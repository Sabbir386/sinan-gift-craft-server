import { Request, Response } from "express";
import { createBonusReward, getUserBonusRewards } from "./BonusRewardService";


export const createBonusRewardController = async (req: Request, res: Response) => {
  const { userId, rewardName, rewardPoints, rewardFrom } = req.body;

  if (!userId || !rewardName || !rewardPoints || !rewardFrom) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const reward = await createBonusReward({
      userId,
      rewardName,
      rewardPoints,
      rewardStatus: "COMPLETED",
      rewardFrom,
      date: new Date(),
    } as any);

    res.status(201).json({
      message: "Bonus reward created successfully.",
      reward,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserBonusRewardsController = async (req: Request, res: Response) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "userId is required in the query parameters." });
  }

  try {
    const rewards = await getUserBonusRewards(userId.toString());

    res.status(200).json({
      message: "User bonus rewards retrieved successfully.",
      rewards,
    });
  } catch (error: any) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
