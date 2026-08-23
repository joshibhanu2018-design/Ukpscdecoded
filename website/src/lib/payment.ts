// Consolidated Payment Configuration
// All payment methods unified to single Bank of Baroda UPI account
// Deployment #1: Payment Consolidation (Commit 699a593)
// Updated: August 22, 2026

// ✅ SINGLE UNIFIED UPI ACCOUNT (Bank of Baroda)
// All payment methods (Google Pay, PhonePe, Paytm, QR) route to this account
export const UPI_ID_GPAY = "9632662418@ptyes";
export const UPI_ID_PAYTM = "9632662418@ptyes";
export const UPI_ID_PHONEPE = "9632662418@ptyes";
export const UPI_ID_QR = "9632662418@ptyes";

// Master UPI ID for reference
export const UPI_ID = "9632662418@ptyes";

// Payment constants
export const AMOUNT = 499;
export const BUSINESS_NAME = "UKPSC Decoded";

// Helper function to get UPI for any payment method
export function getUPIforPaymentMethod(
  method: "googlepay" | "paytm" | "phonepe" | "qr"
): string {
  // All methods now use the same Bank of Baroda account
  return "9632662418@ptyes";
}

// Payment status enum
export enum PaymentMethod {
  GOOGLE_PAY = "googlepay",
  PAYTM = "paytm",
  PHONEPE = "phonepe",
  QR_CODE = "qr",
}

// Generate UPI payment link
export function generateUPILink(
  method: PaymentMethod,
  amount: number = AMOUNT,
  businessName: string = BUSINESS_NAME
): string {
  const upiId = getUPIforPaymentMethod(method as any);
  const encodedBusinessName = encodeURIComponent(businessName);
  const baseParams = `pa=${upiId}&pn=${encodedBusinessName}&am=${amount}&tn=UKPSC%20Book%20Purchase`;

  switch (method) {
    case PaymentMethod.GOOGLE_PAY:
      return `tez://upi/pay?${baseParams}`;
    case PaymentMethod.PAYTM:
      return `paytmmp://pay?${baseParams}`;
    case PaymentMethod.PHONEPE:
      return `phonepe://pay?${baseParams}`;
    case PaymentMethod.QR_CODE:
      return `upi://pay?${baseParams}`;
    default:
      return `upi://pay?${baseParams}`;
  }
}

// Transaction details for logging/verification
export interface TransactionDetails {
  upiId: string;
  amount: number;
  businessName: string;
  timestamp: string;
  method: PaymentMethod;
  orderId: string;
}

// Log transaction
export function logTransaction(details: TransactionDetails): void {
  console.log("📊 Payment Transaction:", {
    upiId: details.upiId,
    amount: `₹${details.amount}`,
    business: details.businessName,
    method: details.method,
    orderId: details.orderId,
    timestamp: details.timestamp,
  });
}