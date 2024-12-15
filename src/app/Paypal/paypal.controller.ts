import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utilis/catchAsync';
import paypalService from './paypal.service';
import Payment from '../Payment/payment.model';

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const { email: userEmail } = req.user;

  if (!userEmail) {
    return res.status(httpStatus.BAD_REQUEST).send({
      success: false,
      message: 'Missing userEmail',
    });
  }

  try {
    const orderUrl = await paypalService.createOrder(userEmail as string); // Pass the email to the service
    res.status(httpStatus.OK).send({
      success: true,
      orderUrl,
    });
  } catch (error: any) {
    console.error('Error creating PayPal order:', error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      success: false,
      message: 'Order creation failed',
      error: error.message,
    });
  }
});


const capturePayment = catchAsync(async (req: Request, res: Response) => {
  const { orderId } = req.body;

  try {
    const captureData = await paypalService.capturePayment(orderId);

    if (captureData.status === 'COMPLETED') {
      return res.status(httpStatus.OK).send({
        success: true,
        message: 'Payment captured successfully',
        transactionId: captureData.id,
      });
    } else {
      return res.status(httpStatus.BAD_REQUEST).send({
        success: false,
        message: 'Payment not completed',
      });
    }
  } catch (error: any) {
    console.error('Error capturing PayPal payment:', error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      success: false,
      message: 'Failed to capture PayPal payment',
      error: error.message,
    });
  }
});

const completeOrder = catchAsync(async (req: Request, res: Response) => {
  console.log('Complete order route hit');

  const { token, PayerID, userEmail } = req.query;
  console.log(userEmail)

  // Ensure that query parameters are properly validated
  if (!token || !PayerID || !userEmail) {
    return res.status(httpStatus.BAD_REQUEST).send({
      success: false,
      message: 'Missing required query parameters',
    });
  }

  try {
    // Capture the payment using the provided token
    const captureData = await paypalService.capturePayment(token as string);

    if (!captureData || !captureData.id || !captureData.purchase_units) {
      throw new Error('Invalid capture data');
    }

    const transactionId = captureData.id;
    const amount = parseFloat(captureData.purchase_units[0].payments.captures[0].amount.value);
    const email = captureData.payer.email_address;
    const name = `${captureData.payer.name.given_name} ${captureData.payer.name.surname}`;

    // Create and save the payment document
    const payment = new Payment({
      transactionId,
      amount,
      email,
      name,
      userEmail: userEmail as string,

    });
    payment.paymentType = "paypal";
    await payment.save();
    res.redirect('https://cashooz-838b0.web.app/dashboard/payment');
    res.status(httpStatus.OK).send({
      success: true,
      message: 'Order completed successfully',

    });
  } catch (error: any) {
    console.error('Error completing PayPal order:', error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      success: false,
      message: 'Order completion failed',
      error: error.message,
    });
  }
});



const cancelOrder = catchAsync(async (req: Request, res: Response) => {
  res.status(httpStatus.OK).send({ success: true, message: 'Order canceled successfully' });
});

export const PaypalController = {
  createOrder,
  capturePayment,
  completeOrder,
  cancelOrder,
};
