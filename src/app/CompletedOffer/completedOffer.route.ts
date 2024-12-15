import express from 'express';

import { CompletedOfferControllers } from './completedOffer.controller';
import auth from '../middleware/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();
router.post(
  '/create-completedOffer',
  CompletedOfferControllers.createCompletedOffer,
);

router.get(
  '/create-completedOffer',
  CompletedOfferControllers.createCompletedOfferGet,
);
router.post(
  '/create-clicked-id',
  CompletedOfferControllers.createCompletedOffer,
);

router.get(
  '/',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.user),
  CompletedOfferControllers.getAllCompletedOffers,
);
router.get(
  '/total-offer-counts',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  CompletedOfferControllers.getTotalOfferCounts,
);
router.get(
  '/daily-offer-totals',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  CompletedOfferControllers.getDailyTotalsOffer,
);
router.get(
  '/specific-user-total-offer-counts',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  CompletedOfferControllers.getUserTotalOfferCounts,
);
router.get(
  '/specific-offer-total-counts',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  CompletedOfferControllers.getSpecificOfferLiveTimeTotalCounts,
);
router.get(
  '/specific-user-daily-offer-totals',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  CompletedOfferControllers.getUserDailyTotals,
);
router.get(
  '/per-day-total-offer-count',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  CompletedOfferControllers.getPerDayTotalOfferCounts,
);
router.get(
  '/loggedIn-user-total-offer-counts',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.advertiser,
    USER_ROLE.user,
  ),
  CompletedOfferControllers.getLoggedInUserTotalOfferCounts,
);
router.get(
  '/loggedIn-user-daily-completed-offer-counts',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.advertiser,
    USER_ROLE.user,
  ),
  CompletedOfferControllers.getLoggedInUserDailyTotals,
);
router.get(
  '/hours-left/:offerId',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.advertiser,
    USER_ROLE.user,
  ),
  CompletedOfferControllers.getOfferHoursLeft,
);

///new routes 
router.get(
  '/loggedIn-user-offer-name-counts',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.advertiser,
    USER_ROLE.user,
  ),
  CompletedOfferControllers.getLoggedInUserOfferNameCounts,
);

export const CompletedOfferRoutes = router;
