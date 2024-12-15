import httpStatus from 'http-status';
import catchAsync from '../utilis/catchAsync';
import sendResponse from '../utilis/sendResponse';
import { AdvertiserServices } from './advertiser.service';

const getSingleAdvertiser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdvertiserServices.getSingleAdvertiserFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Advertiser is retrieved successfully',
    data: result,
  });
});

const getAllAdvertisers = catchAsync(async (req, res) => {
  const result = await AdvertiserServices.getAllAdvertisersFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Advertisers are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});


const updateAdvertiser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdvertiserServices.updateAdvertiserIntoDB(id, req.body.advertiser);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Advertiser updated successfully',
    data: result,
  });
});

const deleteAdvertiser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdvertiserServices.deleteAdvertiserFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Advertiser deleted successfully',
    data: result,
  });
});

export const AdvertiserControllers = {
  getSingleAdvertiser,
  getAllAdvertisers,
  updateAdvertiser,
  deleteAdvertiser,
};
