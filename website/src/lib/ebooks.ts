import { createHmac, timingSafeEqual } from "crypto";
import { supabaseAdmin } from "./supabase";

/**
 * Paid e-books. The PDFs live in the private Supabase Storage bucket
 * "ebooks" (never in /public or the repo). After a verified payment the
 * buyer gets a signed download link; the download route checks it and
 * redirects to a short-lived Supabase signed URL.
 */
export const EBOOKS = {
  "polity-decoded": {
    name: "Polity Decoded: The Complete Visual e-Book for PCS Prelims cum Mains",
    amount: 5900, // ₹59 in paise — must match the price shown on /buy-ebooks
    description: "Visual e-book for PCS aspirants",
    storagePath: "polity-decoded.pdf",
    fileName: "Polity-Decoded-PCS-Guide.pdf",
  },
} as const;

export type EbookId = keyof typeof EBOOKS;

export const EBOOK_BUCKET = "ebooks";
export const DOWNLOAD_LINK_TTL_MS = 24 * 60 * 60 * 1000;

export function getEbook(id: unknown) {
  return typeof id === "string" && Object.hasOwn(EBOOKS, id) ? { id: id as EbookId, ...EBOOKS[id as EbookId] } : null;
}

function hmac(payload: string): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set.");
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

/** Signed, expiring proof that `paymentId` paid for `pdfId`. */
export function createDownloadToken(pdfId: EbookId, paymentId: string): string {
  const payload = Buffer.from(
    JSON.stringify({ pdf: pdfId, pay: paymentId, exp: Date.now() + DOWNLOAD_LINK_TTL_MS, p: "ebook" }),
  ).toString("base64url");
  return `${payload}.${hmac(payload)}`;
}

export function readDownloadToken(token: unknown): { pdfId: EbookId; paymentId: string } | null {
  if (typeof token !== "string") return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = Buffer.from(hmac(payload));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (data.p !== "ebook" || typeof data.exp !== "number" || data.exp < Date.now()) return null;
    const ebook = getEbook(data.pdf);
    return ebook && typeof data.pay === "string" ? { pdfId: ebook.id, paymentId: data.pay } : null;
  } catch {
    return null;
  }
}

/** A 5-minute Supabase URL for the file itself; the browser downloads it directly. */
export async function signedEbookUrl(pdfId: EbookId): Promise<string | null> {
  const ebook = EBOOKS[pdfId];
  const { data, error } = await supabaseAdmin()
    .storage.from(EBOOK_BUCKET)
    .createSignedUrl(ebook.storagePath, 300, { download: ebook.fileName });
  if (error || !data?.signedUrl) {
    console.error("[ebook] Could not sign download URL:", error?.message);
    return null;
  }
  return data.signedUrl;
}
