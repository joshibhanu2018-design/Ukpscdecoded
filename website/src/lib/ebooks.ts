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

/**
 * A 5-minute Supabase URL for the file itself; the browser downloads it directly.
 * If the file isn't at its expected name (e.g. uploaded with its original
 * name), falls back to the only PDF in the bucket, so a naming slip doesn't
 * block paying buyers.
 */
export async function signedEbookUrl(pdfId: EbookId): Promise<string | null> {
  const ebook = EBOOKS[pdfId];
  const bucket = supabaseAdmin().storage.from(EBOOK_BUCKET);
  const sign = (path: string) => bucket.createSignedUrl(path, 300, { download: ebook.fileName });

  const first = await sign(ebook.storagePath);
  if (first.data?.signedUrl) return first.data.signedUrl;

  const { data: files, error: listError } = await bucket.list("", { limit: 100 });
  const pdfs = (files ?? []).filter((f) => f.name.toLowerCase().endsWith(".pdf"));
  if (pdfs.length === 1) {
    console.warn(`[ebook] ${ebook.storagePath} not found; using ${pdfs[0].name}`);
    const fallback = await sign(pdfs[0].name);
    if (fallback.data?.signedUrl) return fallback.data.signedUrl;
  }
  console.error(
    `[ebook] Could not sign ${EBOOK_BUCKET}/${ebook.storagePath}:`,
    first.error?.message,
    listError?.message ?? `bucket has ${pdfs.length} PDF(s): ${pdfs.map((f) => f.name).join(", ")}`,
  );
  return null;
}
