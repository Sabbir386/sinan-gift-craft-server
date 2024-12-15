import axios from 'axios';

const PAYPAL_BASE_URL = process.env.PAYPAL_BASE_URL || 'https://api-m.sandbox.paypal.com';
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID!;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET!;

const generateAccessToken = async (): Promise<string> => {
  try {
    const response = await axios.post(
      `${PAYPAL_BASE_URL}/v1/oauth2/token`,
      'grant_type=client_credentials',
      {
        auth: {
          username: PAYPAL_CLIENT_ID,
          password: PAYPAL_SECRET,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    console.log("access", response.data.access_token);
    return response.data.access_token;
  } catch (error: any) {
    console.error('Failed to generate access token:', error.response?.data || error.message);
    throw new Error('Could not generate PayPal access token');
  }
};

const createOrder = async (userEmail: string): Promise<string> => {
  try {
    const accessToken = await generateAccessToken();

    const response = await axios.post(
      `${PAYPAL_BASE_URL}/v2/checkout/orders`,
      {
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: '100.00',
            },
          },
        ],
        application_context: {
          return_url: `${process.env.BASE_URL}/api/v1/paypal/complete-order?userEmail=${encodeURIComponent(userEmail)}`,
          cancel_url: `${process.env.BASE_URL}/api/v1/paypal/cancel-order`,
          shipping_preference: 'NO_SHIPPING',
          user_action: 'PAY_NOW',
          brand_name: 'Cashooz',
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const approvalLink = response.data.links.find(
      (link: { rel: string; href: string }) => link.rel === 'approve'
    )?.href;

    if (!approvalLink) {
      throw new Error('Approval link not found in the response');
    }

    return approvalLink;
  } catch (error: any) {
    console.error('Order creation failed:', error.response?.data || error.message);
    throw new Error('Order creation failed');
  }
};



const capturePayment = async (orderId: string): Promise<any> => {
  console.log(orderId);
  try {
    const accessToken = await generateAccessToken();

    const response = await axios.post(
      `${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log('response', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Payment capture failed:', error.response?.data || error.message);
    throw new Error('Payment capture failed');
  }
};

export default { createOrder, capturePayment };
