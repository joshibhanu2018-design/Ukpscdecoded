import { supabaseAdmin } from "./supabase";
import { getPriceInfo, type PriceInfo, type PricedPackage } from "./pricing";

/**
 * Lower prices for students who already bought from us (schema-phase37/38),
 * applied on the server at checkout so they can't be faked from the browser.
 *
 *  - metadata.upgrade_from = { "<slug>": price }: owners of that package pay
 *    that price (e.g. Mock Mahasangram owners upgrade to the Revision Test
 *    Series for ₹500).
 *  - metadata.returning_percent_off (e.g. 20) or metadata.returning_price:
 *    owners of any other paid package, except metadata.returning_excludes
 *    (default Premium / Complete Prelims Pack / Mentorship, which include
 *    these products anyway), get that discount.
 * The lowest price that applies wins.
 */
const DEFAULT_EXCLUDES = ["premium-test-series", "complete-prelims-pack", "prelims-mentorship"];

type Meta =
  | {
      returning_price?: unknown;
      returning_percent_off?: unknown;
      returning_excludes?: unknown;
      upgrade_from?: unknown;
    }
  | null
  | undefined;

export type BuyerPriceKind = "upgrade" | "returning" | null;

/** The returning-buyer price for a base price, or null when the package has none. */
function returningAmount(base: number, metadata: Meta): number | null {
  const pct = Number(metadata?.returning_percent_off);
  if (Number.isFinite(pct) && pct > 0 && pct < 100) return Math.round(base * (1 - pct / 100));
  const fixed = Number(metadata?.returning_price);
  if (Number.isFinite(fixed) && fixed > 0) return fixed;
  return null;
}

function upgradePrices(metadata: Meta): Record<string, number> {
  const raw = metadata?.upgrade_from;
  if (!raw || typeof raw !== "object") return {};
  const out: Record<string, number> = {};
  for (const [slug, v] of Object.entries(raw as Record<string, unknown>)) {
    const n = Number(v);
    if (Number.isFinite(n) && n > 0) out[slug] = n;
  }
  return out;
}

/** Slugs and prices of the paid packages this user directly owns (active enrollments), excluding one package. */
async function ownedPaidPackages(userId: string, excludePackageId: string): Promise<{ slug: string | null; price: number }[]> {
  const today = new Date().toISOString().slice(0, 10);
  const { data: rows } = await supabaseAdmin()
    .from("enrollments")
    .select("package_id")
    .eq("user_id", userId)
    .eq("status", "active")
    .or(`access_valid_till.is.null,access_valid_till.gte.${today}`);
  const ids = [...new Set((rows ?? []).map((r) => r.package_id as string))].filter((id) => id !== excludePackageId);
  if (ids.length === 0) return [];
  const { data: pkgs } = await supabaseAdmin().from("packages").select("slug, price").in("id", ids);
  return (pkgs ?? []).map((p) => ({ slug: (p.slug as string | null) ?? null, price: Number(p.price) }));
}

/** The price this user pays: an upgrade or returning-buyer price if one applies and is lower. */
export async function getBuyerPriceInfo(
  userId: string,
  pkg: PricedPackage & { id: string; metadata?: Meta },
  overrideEndsAt?: string | null
): Promise<PriceInfo & { returning: boolean; kind: BuyerPriceKind }> {
  const base = getPriceInfo(pkg, Date.now(), overrideEndsAt);
  const upgrades = upgradePrices(pkg.metadata);
  const returning = returningAmount(base.amount, pkg.metadata);
  if (Object.keys(upgrades).length === 0 && returning === null) return { ...base, returning: false, kind: null };

  const owned = await ownedPaidPackages(userId, pkg.id);
  let best: { amount: number; kind: BuyerPriceKind } | null = null;

  for (const p of owned) {
    if (p.slug && upgrades[p.slug] !== undefined && (!best || upgrades[p.slug] < best.amount)) {
      best = { amount: upgrades[p.slug], kind: "upgrade" };
    }
  }

  if (returning !== null) {
    const excludes = Array.isArray(pkg.metadata?.returning_excludes)
      ? (pkg.metadata!.returning_excludes as string[])
      : DEFAULT_EXCLUDES;
    const qualifies = owned.some((p) => !(p.slug && excludes.includes(p.slug)) && p.price > 0);
    if (qualifies && (!best || returning < best.amount)) best = { amount: returning, kind: "returning" };
  }

  if (best && best.amount < base.amount) {
    return { ...base, amount: best.amount, isFounding: false, regularPrice: base.amount, returning: true, kind: best.kind };
  }
  return { ...base, returning: false, kind: null };
}
