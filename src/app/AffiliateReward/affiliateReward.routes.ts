import express from 'express';
import { AffiliateRewardController } from './affiliateReward.controller';

const router = express.Router();

// POST route to create affiliate reward
router.post('/createReward', AffiliateRewardController.createReward);

// GET route to claim affiliate rewardvercel --prod
router.get('/totalRewards', AffiliateRewardController.totalRewards);

export const AffiliateRewardsRoutes = router;
