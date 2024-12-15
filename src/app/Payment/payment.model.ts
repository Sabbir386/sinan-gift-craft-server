import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  transactionId: { type: String, required: true },
  amount: { type: Number, required: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  userEmail: { type: String, required: true },
  paymentType: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Payment', PaymentSchema);
