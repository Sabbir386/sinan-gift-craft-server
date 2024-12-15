import { Types } from "mongoose";

export interface IUserWithdrawal {
  userId: Types.ObjectId;
  userName?: string; 
  userRegisterId?: string; 
  userEmail: string; 
  profileImg?: string;
  paypalEmail?: string;              
  btcAddress?: string;               
  networkType?: string;              
  description?: string;              
  method?: string;           
  amount: number;
  transactionId?: string;
  invoiceId?: string;             
  country?: string;               
  status?: 'pending' | 'completed' | 'failed';
  timestamps: {
    requestedAt: Date;
    processedAt?: Date;
  };
}