// Consolidated Payment Configuration
// All payment methods unified to single Bank of Baroda UPI account
// Updated: August 23, 2026

export const UPI_ID_GPAY = "9632662418@ptyes";
export const UPI_ID_PAYTM = "9632662418@ptyes";
export const UPI_ID_PHONEPE = "9632662418@ptyes";
export const UPI_ID_QR = "9632662418@ptyes";
export const UPI_ID = "9632662418@ptyes";
export const AMOUNT = 499;
export const BUSINESS_NAME = "UKPSC Decoded";

export function getUPIforPaymentMethod(
  method: "googlepay" | "paytm" | "phonepe" | "qr"
): string {
  return "9632662418@ptyes";
}

export enum PaymentMethod {
  GOOGLE_PAY = "googlepay",
  PAYTM = "paytm",
  PHONEPE = "phonepe",
  QR_CODE = "qr",
}

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

export interface TransactionDetails {
  upiId: string;
  amount: number;
  businessName: string;
  timestamp: string;
  method: PaymentMethod;
  orderId: string;
}

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
