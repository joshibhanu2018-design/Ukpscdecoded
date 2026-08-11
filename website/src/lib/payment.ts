// Single source of truth for payment details.
// If you switch bank accounts / UPI ID again, change it ONLY here —
// every page that builds a payment link imports from this file, so
// there's no risk of one page updating and another being missed.

export const UPI_ID = "9632662418@ptyes"; // Bank of Baroda, via Paytm
export const AMOUNT = 499;
export const BUSINESS_NAME = "UKPSC Decoded";
