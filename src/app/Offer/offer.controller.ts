import { NextFunction, Request, Response } from 'express';

import httpStatus from 'http-status';
import sendResponse from '../utilis/sendResponse';
import catchAsync from '../utilis/catchAsync';
import { OfferServices } from './offer.service';
import { TOffer } from './offer.interface';

const createOffer = catchAsync(async (req, res) => {
  const offerData = req.body;
  //you can decode,[id,email] field
  const { email, id, role, objectId } = req.user;

  console.log('controller', email, id, role, objectId);
  const result = await OfferServices.createOfferIntoDB(
    offerData,
    id,
    role,
    objectId,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offer is created successfully',
    data: result,
  });
});
const getAllOffers = catchAsync(async (req, res) => {
  const { offerStatus, device, CountryCode, role } = req.query;
  // const { role } = req.query;
  console.log('role', role);
  // Define the query object using the interface
  let query: any = {};

  if (offerStatus) {
    query.offerStatus = offerStatus;
  }  
  if (role !== 'superAdmin' && role !== 'admin') {
    if (device) {
      query.device = { $elemMatch: { value: device } }; 
    }
    if (CountryCode) {
      query.country = { $elemMatch: { value: CountryCode } };
    }
  }
  if (req) console.log('Controller received query:', query);
  const result = await OfferServices.getAllOffersFromDB(query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offers are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});
const getSingleOffer = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await OfferServices.getSingleOfferFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offer is retrieved successfully',
    data: result,
  });
});
const deleteOffer = catchAsync(async (req, res) => {
  const { id } = req.params;
  console.log('controller', id);
  const result = await OfferServices.deleteOfferFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offer is deleted successfully',
    data: result,
  });
});
const updateOfferController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  console.log('from -controller', id, data);
  const result = await OfferServices.updateOfferInDb(id, data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offer is updated successfully',
    data: result,
  });
});
const toggleOfferStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await OfferServices.toggleOfferStatusInDb(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offer status toggled successfully',
    data: result,
  });
});

const getAdminOffersFromDb = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // const queryParams: any = req.query;
    const result = await OfferServices.getAdminOffersFromDb();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: ' Admin Offers are retrieved succesfully',
      data: result,
    });
  } catch (err: any) {
    // console.error(error);
    next(err);
  }
};
const getAdvertiserOffersFromDb = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // const queryParams: any = req.query;
    const result = await OfferServices.getAdvertiserOffersFromDb();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Advertiser Offers are retrieved succesfully',
      data: result,
    });
  } catch (err: any) {
    // console.error(error);
    next(err);
  }
};
const getDailyCompletedOfferReportFromDb = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const startDateString = req.query.startDate as string | undefined;
    const endDateString = req.query.endDate as string | undefined;

    if (!startDateString || !endDateString) {
      throw new Error(
        'Both startDate and endDate are required query parameters',
      );
    }

    // Convert the date strings to Date objects
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);

    // Check if the conversion was successful
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new Error('Invalid date format');
    }
    const result = await OfferServices.getDailyCompletedOfferReportFromDb();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'daily Completed Offers reports are retrieved succesfully',
      data: result,
    });
  } catch (err: any) {
    // console.error(error);
    next(err);
  }
};
const getNetworksWithOffers = catchAsync(async (req, res) => {
  const result = await OfferServices.getNetworksWithOffersFromDb();
  if (!result) {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'No networks with offers found',
      data: null,
    });
    return;
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Networks with their offers are retrieved successfully',
    data: result,
  });
});

// survey wall data
const getNetworkOffersFilterBySurveyWall = async (req:Request, res:Response) => {
  try {
    const { networkName } = req.query; // Get the network name from query parameters
   console.log("NetworkControllers",networkName)
    // Validate the input
    if (!networkName) {
      return res.status(400).json({
        success: false,
        message: 'Network name is required as a query parameter',
      });
    }

    // Call the service layer to get the filtered offers
    const offers = await OfferServices.filterOffersByNetwork(networkName);

    if (offers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No offers found for the specified network',
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: `Offers for the network "${networkName}" retrieved successfully`,
      data: offers,
    });
  } catch (error:any) {
    console.error('Error retrieving offers by network:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching offers by network',
      error: error.message,
    });
  }
};

export const OfferControllers = {
  createOffer,
  getAllOffers,
  getSingleOffer,
  deleteOffer,
  updateOfferController,
  getDailyCompletedOfferReportFromDb,
  getAdminOffersFromDb,
  getAdvertiserOffersFromDb,
  toggleOfferStatus,
  getNetworksWithOffers,
  getNetworkOffersFilterBySurveyWall,
};
