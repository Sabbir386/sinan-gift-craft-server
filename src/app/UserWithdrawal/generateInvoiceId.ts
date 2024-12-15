import { UserWithdrawal } from './userWithdrawal.model';

export const generateInvoiceId = async (): Promise<string> => {
    // Define the prefix for the invoice ID
    const prefix = 'CZ';

    // Get the most recent invoiceId from the database
    const lastWithdrawal = await UserWithdrawal.findOne()
        .sort({ createdAt: -1 }) // Sort by creation date in descending order
        .select('invoiceId') // Only retrieve the invoiceId field
        .lean();

    // Extract the numeric part of the last invoiceId
    let lastNumericId = 679860387; // Starting value if no previous invoices exist
    if (lastWithdrawal?.invoiceId) {
        const numericPart = lastWithdrawal.invoiceId.replace(prefix, ''); // Remove prefix
        lastNumericId = parseInt(numericPart, 10); // Convert to an integer
    }

    // Increment the numeric part to generate the next invoiceId
    const nextNumericId = lastNumericId + 1;

    // Combine the prefix and the new numeric part to create the new invoiceId
    return `${prefix}${nextNumericId}`;
};
