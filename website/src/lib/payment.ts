// Single source of truth for payment details.
// If you switch bank accounts / UPI ID again, change it ONLY here —
// every page that builds a payment link imports from this file, so
// there's no risk of one page updating and another being missed.

// Two separate UPI IDs used across different apps, to spread transaction
// volume across two bank accounts and reduce failed payments from any
// single account hitting its daily UPI limit.
export const UPI_ID_GPAY = "bhanujoshi1910-1@oksbi"; // State Bank of India, via Google Pay
export const UPI_ID_PAYTM = "9632662418@ptyes"; // Bank of Baroda, via Paytm

// Kept for backward compatibility with any other file still importing UPI_ID directly
export const UPI_ID = UPI_ID_GPAY;

export const AMOUNT = 499;
export const BUSINESS_NAME = "UKPSC Decoded";
