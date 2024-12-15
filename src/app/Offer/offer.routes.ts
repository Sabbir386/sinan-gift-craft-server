import express from 'express';

import validateRequest from '../middleware/validateRequest';
import { offerValidationSchema } from './offer.validation';
import { OfferControllers } from './offer.controller';
import { USER_ROLE } from '../User/user.constant';
import auth from '../middleware/auth';
const router = express.Router();
router.get(
  '/admin-offer',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  OfferControllers.getAdminOffersFromDb,
);
router.get(
  '/advertiser-offer',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  OfferControllers.getAdvertiserOffersFromDb,
);
router.get(
  '/daily-completed-report',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  OfferControllers.getDailyCompletedOfferReportFromDb,
);
router.post(
  '/create-offer',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(offerValidationSchema),
  OfferControllers.createOffer,
);
router.get(
  '/',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.user,
    USER_ROLE.advertiser,
  ),
  OfferControllers.getAllOffers,
);
router.get(
  '/:id',
  // auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.user,USER_ROLE.advertiser),
  OfferControllers.getSingleOffer,
);
router.delete(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  OfferControllers.deleteOffer,
);
router.put(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  OfferControllers.updateOfferController,
);

router.put(
  '/toggle-status/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  OfferControllers.toggleOfferStatus,
);
router.get(
  '/networks-with-offers/bynetwork',
  // auth(USER_ROLE.superAdmin, USER_ROLE.admin,USER_ROLE.user,USER_ROLE.advertiser),
  OfferControllers.getNetworksWithOffers,
);
// for survey wall 
router.get(
  '/surveyWall/networks-offers-filter-by-survey-wall', 
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.user, USER_ROLE.advertiser),
  OfferControllers.getNetworkOffersFilterBySurveyWall 
);


export const OfferRoutes = router;
