import schedule from "@content/finalMonthSchedule.json";
import { getActivePackages, getOwnedPackageIds, getPackageIncludes, getUserActiveEnrollments, type Package } from "./packages";
import { getPriceInfo } from "./pricing";
import { getBuyerPriceInfo, type BuyerPriceKind } from "./returningPrice";

/** The two last-month products (schema-phase37/38). */
export const REVISION_SLUG = "revision-test-series";
export const MAHASANGRAM_SLUG = "mock-mahasangram";

export type ScheduleKind = "mock" | "uk" | "ca" | "csat";
export type ScheduleItem = { date: string; kind: ScheduleKind; name: string; testId: string };

export const FINAL_SCHEDULE = schedule.tests as ScheduleItem[];
export const EXAM_DATE = schedule.examDate;

export const KIND_LABEL: Record<ScheduleKind, string> = {
  mock: "Full mock · live rank",
  uk: "Uttarakhand GK · 100 Q",
  ca: "Current Affairs · 100 Q",
  csat: "CSAT · 100 Q",
};

export type ProductState = {
  pkg: Package | null;
  owned: boolean;
  /** What this visitor pays now. */
  price: number | null;
  /** The normal price, when the visitor pays less. */
  wasPrice: number | null;
  kind: BuyerPriceKind;
};

/** Days left to the exam (IST), 0 on exam day. */
export function daysToExam(now = Date.now()): number {
  const exam = new Date(`${EXAM_DATE}T00:00:00+05:30`).getTime();
  return Math.max(0, Math.ceil((exam - now) / 86400000));
}

/** "Thu 12 Nov" for a yyyy-mm-dd date. */
export function shortDate(date: string): { weekday: string; day: string; month: string } {
  const d = new Date(`${date}T12:00:00+05:30`);
  const part = (o: Intl.DateTimeFormatOptions) => d.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", ...o });
  return { weekday: part({ weekday: "short" }), day: part({ day: "numeric" }), month: part({ month: "short" }) };
}

/** Both products as this visitor sees them: owned or not, and their price. */
export async function getFinalMonthState(userId: string | null): Promise<Record<string, ProductState>> {
  const all = await getActivePackages();
  let ownedIds = new Set<string>();
  if (userId) {
    const [includes, enrollments] = await Promise.all([getPackageIncludes(), getUserActiveEnrollments(userId)]);
    ownedIds = getOwnedPackageIds(enrollments, includes, all);
  }

  const out: Record<string, ProductState> = {};
  for (const slug of [REVISION_SLUG, MAHASANGRAM_SLUG]) {
    const pkg = all.find((p) => p.slug === slug) ?? null;
    if (!pkg) {
      out[slug] = { pkg: null, owned: false, price: null, wasPrice: null, kind: null };
      continue;
    }
    const owned = ownedIds.has(pkg.id);
    const base = getPriceInfo(pkg);
    if (!userId || owned) {
      out[slug] = { pkg, owned, price: base.amount, wasPrice: null, kind: null };
      continue;
    }
    const buyer = await getBuyerPriceInfo(userId, pkg);
    out[slug] = {
      pkg,
      owned,
      price: buyer.amount,
      wasPrice: buyer.returning ? base.amount : null,
      kind: buyer.kind,
    };
  }
  return out;
}
