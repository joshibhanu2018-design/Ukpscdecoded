// Single source of truth for payment details.
// CONSOLIDATED APPROACH: All payment methods use the SAME UPI ID
// This ensures all transactions go to one account (Bank of Baroda)
// and avoids hitting transaction limits across multiple accounts.

// SINGLE UPI ID for ALL payment methods (Bank of Baroda)
// Customer can pay via Google Pay, PhonePe, Paytm, or QR code
// Money always arrives at: 9632662418@ptyes (Bank of Baroda account)
export const UPI_ID_GPAY = "9632662418@ptyes";     // Google Pay → BoB
export const UPI_ID_PAYTM = "9632662418@ptyes";   // Paytm → BoB
export const UPI_ID_PHONEPE = "9632662418@ptyes"; // PhonePe → BoB
export const UPI_ID_QR = "9632662418@ptyes";      // QR Code → BoB

// Kept for backward compatibility with any other file still importing UPI_ID directly
export const UPI_ID = UPI_ID_GPAY; // Master UPI (BoB account)

export const AMOUNT = 499;
export const BUSINESS_NAME = "UKPSC Decoded";

// Helper function: Get UPI for any payment method
// All methods now route to the same Bank of Baroda account
export function getUPIforPaymentMethod(method: 'googlepay' | 'paytm' | 'phonepe' | 'qr'): string {
  return "9632662418@ptyes"; // All payments consolidated to BoB
}
