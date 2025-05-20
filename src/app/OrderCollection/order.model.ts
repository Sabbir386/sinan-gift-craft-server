// order.model.ts
import mongoose, { Schema } from 'mongoose';
import { TOrder } from './order.interface';

const orderSchema = new Schema<TOrder>(
  {
    orderId: { type: String, required: true, unique: true },
    userInfo: {
      firstName: { type: String, required: true },
      lastName: { type: String },
      city: { type: String, required: true },
      country: { type: String },
      address: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    items: [
      {
        // productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        productId: { type: String },
        name: { type: String },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        size: { type: Number },
        colour: { type: String },
      },
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' },
  },
  { timestamps: true }
);

export const Order = mongoose.model<TOrder>('Order', orderSchema);