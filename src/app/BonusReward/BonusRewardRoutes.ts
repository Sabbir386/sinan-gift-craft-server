import { Router } from "express";
import auth from "../middleware/auth";
import { USER_ROLE } from "../User/user.constant";
import { createBonusRewardController, getUserBonusRewardsController } from "./BonusRewardController";


const router = Router();

// Route to create a bonus reward
router.post("/createBonusReward", auth(USER_ROLE.user), createBonusRewardController);

// Route to get user bonus rewards
router.get("/bonusRewardByUser", auth(USER_ROLE.user), getUserBonusRewardsController);

export const BonusRewardsRoutes = router;
