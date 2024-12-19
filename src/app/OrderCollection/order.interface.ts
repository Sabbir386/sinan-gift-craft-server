// order.interface.ts
import { Types } from 'mongoose';

export interface TOrder {
  orderId: string;
  userInfo: {
    firstName: string;
    lastName: string;
    city: string;
    country: string;
    address: string;
    email: string;
    phone: string;
  };
  items: {
    productId: Types.ObjectId;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: Date;
  updatedAt: Date;
}
