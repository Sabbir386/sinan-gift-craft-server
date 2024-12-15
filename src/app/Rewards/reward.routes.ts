import { Router } from "express";
import { claimBonusController, getUserRewardController, offerCompletedController, referralCompletedController, socialMediaPostController, surveyCompletedController, taskCompletedController, userTotalRewardsController } from "./reward.controller";
import auth from "../middleware/auth";
import { USER_ROLE } from "../User/user.constant";

const router = Router();

// Route to claim the bonus
router.post("/claim", auth(USER_ROLE.user), claimBonusController);

// Route to get user reward data
router.get("/user", auth(USER_ROLE.user), getUserRewardController);

router.post("/taskCompleted", auth(USER_ROLE.user), taskCompletedController);
router.post("/surveyCompletedRewards", auth(USER_ROLE.user), surveyCompletedController);
router.post("/offerCompletedRewards", auth(USER_ROLE.user), offerCompletedController);

router.post("/socialMediaPostRewards", auth(USER_ROLE.superAdmin), socialMediaPostController);
router.post("/referralCompletedRewards", auth(USER_ROLE.user), referralCompletedController);
// New route to calculate total rewards
router.get("/userTotalRewards", auth(USER_ROLE.user), userTotalRewardsController);


export const RewardsRoutes = router;
