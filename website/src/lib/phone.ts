/** 10-digit Indian mobile number (no +91). */
export const PHONE_RE = /^[6-9]\d{9}$/;

export const PHONE_ERROR = "Enter a valid 10-digit Indian mobile number";

export function cleanPhone(value: unknown): string {
  if (typeof value !== "string") return "";
  const digits = value.replace(/\D/g, "");
  return digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits;
}
