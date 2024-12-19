import { TOrder } from './order.interface';
import { Order } from './order.model';

// Custom unique ID generator
const generateUniqueId = (prefix: string = 'ORD', length: number = 6): string => {
  const timestamp = Date.now().toString(36).toUpperCase(); // Encode timestamp in base36
  const randomPart = Math.random().toString(36).substr(2, length).toUpperCase(); // Generate a random alphanumeric string
  return `${prefix}${timestamp}${randomPart}`; // Combine prefix, timestamp, and random part
};

const createOrder = async (payload: TOrder) => {
  const orderId = generateUniqueId(); // Use the custom ID generator
  payload.orderId = orderId;
  return await Order.create(payload);
};

const getAllOrders = async () => {
  return await Order.find();
};

const getSingleOrder = async (id: string) => {
  return await Order.findById(id);
};

const updateOrder = async (id: string, payload: Partial<TOrder>) => {
  return await Order.findByIdAndUpdate(id, payload, { new: true });
};

const deleteOrder = async (id: string) => {
  await Order.findByIdAndDelete(id);
};

export const OrderServices = {
  createOrder,
  getAllOrders,
  getSingleOrder,
  updateOrder,
  deleteOrder,
};
