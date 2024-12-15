import { Router } from 'express';
import { UserRoutes } from '../User/user.route';
import { AdminRoutes } from '../Admin/admin.route';
import { AuthRoutes } from '../Auth/auth.route';
import { OfferRoutes } from '../Offer/offer.routes';
import { AdvertiserRoutes } from '../Advertiser/advertiser.route';
import { NormalUserRoutes } from '../NormalUser/normalUser.route';
import { CategoryRoutes } from '../Category/category.route';
import { NetworkRoutes } from '../Network/network.route';
import { CompletedOfferRoutes } from '../CompletedOffer/completedOffer.route';
import { PaymentRoutes } from '../Payment/payment.route';
import { PaypalRoutes } from '../Paypal/paypal.route';
import { RewardsRoutes } from '../Rewards/reward.routes';
import { ReferralRoutes } from '../AffiliateReferral/referral.routes';
import { UserWithdrawalRoutes } from '../UserWithdrawal/userWithdrawal.routes';
import { SocialMediaPostRoutes } from '../SocialMediaPost/socialMediaPost.routes';
import { AffiliateRewardsRoutes } from '../AffiliateReward/affiliateReward.routes';
import { SurveyCompletedRoutes } from '../SurveyCompleted/surveyCompleted.routes';
import { BonusRewardsRoutes } from '../BonusReward/BonusRewardRoutes';
import { SubCategoryRoutes } from '../SubCategory/subcategory.routes';
import { ProductRoutes } from '../Product/product.routes';



const router = Router();

const moduleRoutes = [
  {
    path: '/payment',
    route: PaymentRoutes,
  },
  {
    path: '/paypal',
    route: PaypalRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/normalUsers',
    route: NormalUserRoutes,
  },
  {
    path: '/admins',
    route: AdminRoutes,
  },
  {
    path: '/advertisers',
    route: AdvertiserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/offer',
    route: OfferRoutes,
  },
  {
    path: '/products',
    route: ProductRoutes,
  },
  {
    path: '/completedOffer',
    route: CompletedOfferRoutes,
  },
  {
    path: '/surveys',
    route: SurveyCompletedRoutes,
  },
  {
    path: '/category',
    route: CategoryRoutes,
  },
  {
    path: '/subCategory',
    route: SubCategoryRoutes,
  },
  {
    path: '/network',
    route: NetworkRoutes,
  },
  {
    path: '/affiliateReferral',
    route: ReferralRoutes,
  },
  {
    path: '/affiliateRewards',
    route: AffiliateRewardsRoutes,
  },
  {
    path: '/reward',
    route: RewardsRoutes,
  },
  {
    path: '/bonusReward',
    route: BonusRewardsRoutes,
  },
  {
    path: '/user/withdrawal',
    route: UserWithdrawalRoutes,
  },
  {
    path: '/user/social-media',
    route: SocialMediaPostRoutes,
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
