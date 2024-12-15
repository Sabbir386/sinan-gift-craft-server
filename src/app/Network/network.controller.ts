import httpStatus from 'http-status';
import catchAsync from '../utilis/catchAsync';
import sendResponse from '../utilis/sendResponse';
import { NetworkServices } from './network.service';

const createNetwork = catchAsync(async (req, res) => {
  const NetworkData = req.body;
  //you can decode,[id,email] field
  const { email, id, role, objectId } = req.user;

  console.log('controller', email, id, role, objectId);
  const result = await NetworkServices.createNetworkIntoDB(
    NetworkData,
    objectId,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Network is created successfully',
    data: result,
  });
});

const getAllNetworks = catchAsync(async (req, res) => {
  const result = await NetworkServices.getAllNetworksFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Networks are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});
const getSingleNetwork = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await NetworkServices.getSingleNetworkFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Network is retrieved successfully',
    data: result,
  });
});
const deleteNetwork = catchAsync(async (req, res) => {
  const { id } = req.params;
  console.log('controller', id);
  const result = await NetworkServices.deleteNetworkFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Network is deleted successfully',
    data: result,
  });
});
const updateNetwork = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  console.log('from -controller', id, data);
  const result = await NetworkServices.updateNetworkIntoDB(id, data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Network is updated successfully',
    data: result,
  });
});
export const NetworkControllers = {
  getAllNetworks,
  createNetwork,
  getSingleNetwork,
  deleteNetwork,
  updateNetwork,
};
