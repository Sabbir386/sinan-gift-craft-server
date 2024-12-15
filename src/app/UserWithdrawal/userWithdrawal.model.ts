import { Schema, model } from 'mongoose';
import { IUserWithdrawal } from './userWithdrawal.interface';

const userWithdrawalSchema = new Schema<IUserWithdrawal>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userName: {
      type: String, // Optional field for user name
    },
    userRegisterId: {
      type: String, // Optional field for user register ID
    },
    userEmail: {
      type: String,
      required: true,
    },
    profileImg: {
      type: String, // Optional field for profile image
    },
    paypalEmail: {
      type: String, // Optional field for PayPal email
    },
    btcAddress: {
      type: String, // Optional field for Bitcoin address
    },
    method: {
      type: String, // Optional field for Bitcoin address
    },
    networkType: {
      type: String, // Optional field for network type
    },
    description: {
      type: String, // Optional field for transaction description
    },
    amount: {
      type: Number,
      required: true,
    },
    transactionId: {
      type: String, // Optional Transaction ID
    },
    invoiceId: {
      type: String, // Optional Invoice ID
    },
    country: {
      type: String, // Optional Country
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    timestamps: {
      requestedAt: {
        type: Date,
        default: Date.now,
      },
      processedAt: {
        type: Date,
      },
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Export the model
export const UserWithdrawal = model<IUserWithdrawal>('UserWithdrawal', userWithdrawalSchema);
