import { BonusReward, IBonusReward } from "./BonusReward";

export const createBonusReward = async (data: IBonusReward) => {
  const bonusReward = new BonusReward(data);
  return bonusReward.save();
};

export const getUserBonusRewards = async (userId: string) => {
  return BonusReward.find({ userId });
};
