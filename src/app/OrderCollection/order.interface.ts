// order.interface.ts
import { Types } from 'mongoose';

export interface TOrder {
  orderId: string;
  userInfo: {
    firstName: string;
    lastName: string;
    city: string;
    country?: string;
    address: string;
    email: string;
    phone: string;
  };
  items: {
    productId: string;
    name?: string;
    quantity: number;
    price: number;
    colour?: string;
    size?: number;
  }[];
  totalAmount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: Date;
  updatedAt: Date;
}
