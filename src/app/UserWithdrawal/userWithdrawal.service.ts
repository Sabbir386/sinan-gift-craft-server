import { UserWithdrawal } from './userWithdrawal.model';
import { generateInvoiceId } from './generateInvoiceId';

export const UserWithdrawalServices = {
  // Get all withdrawals
  async getAllWithdrawals() {
    return await UserWithdrawal.find();
  },

  // Get a withdrawal by ID
  async getWithdrawalById(id: string) {
    return await UserWithdrawal.findById(id);
  },
  // Get all  withdrawal history by userEmail 
  async getWithdrawalsByEmail(userEmail: string) {
    return await UserWithdrawal.find({ userEmail }); // Query by email
  },
  // Create a withdrawal
  async createWithdrawal(payload: any) {
    // Generate the invoiceId dynamically
    const invoiceId = await generateInvoiceId();

    // Attach the generated invoiceId to the payload
    payload.invoiceId = invoiceId;

    // Create the withdrawal entry in the database
    return await UserWithdrawal.create(payload);
  },

  // Update withdrawal status
  async updateWithdrawalStatus(id: string, status: 'completed' | 'failed') {
    return await UserWithdrawal.findByIdAndUpdate(
      id,
      { status, 'timestamps.processedAt': new Date() },
      { new: true }
    );
  },

    // Get withdrawals by status
    async getWithdrawalsByStatus(status: string) {
      return await UserWithdrawal.find({ status });
    },
  

  // Delete a withdrawal
  async deleteWithdrawal(id: string) {
    return await UserWithdrawal.findByIdAndDelete(id);
  },

  // Toggle withdrawal status
  async toggleWithdrawalStatus(id: string) {
    const withdrawal = await UserWithdrawal.findById(id);
    if (withdrawal) {
      withdrawal.status =
        withdrawal.status === 'pending' ? 'completed' : 'pending';
      withdrawal.timestamps.processedAt = new Date();
      return await withdrawal.save();
    }
    throw new Error('Withdrawal not found');
  },
};
