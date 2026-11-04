import { supabaseAdmin } from "./supabase";
import { getPriceInfo, type PriceInfo, type PricedPackage } from "./pricing";

/**
 * Returning-buyer price (schema-phase37). A package can carry
 * metadata.returning_percent_off (e.g. 20) or metadata.returning_price
 * (a fixed price): students who already own any other
 * paid package, except the ones in metadata.returning_excludes (or, by
 * default, Premium / Complete Prelims Pack / Mentorship, which already
 * include these tests), pay that price instead. Applied on the server at
 * checkout, so it can't be faked from the browser.
 */
const DEFAULT_EXCLUDES = ["premium-test-series", "complete-prelims-pack", "prelims-mentorship"];

type Meta = { returning_price?: unknown; returning_percent_off?: unknown; returning_excludes?: unknown } | null | undefined;

/** The returning-buyer price for a base price, or null when the package has none. */
function returningAmount(base: number, metadata: Meta): number | null {
  const pct = Number(metadata?.returning_percent_off);
  if (Number.isFinite(pct) && pct > 0 && pct < 100) return Math.round(base * (1 - pct / 100));
  const fixed = Number(metadata?.returning_price);
  if (Number.isFinite(fixed) && fixed > 0) return fixed;
  return null;
}

export async function qualifiesForReturningPrice(userId: string, packageId: string, metadata: Meta): Promise<boolean> {
  if (returningAmount(100, metadata) === null) return false;
  const excludes = Array.isArray(metadata?.returning_excludes)
    ? (metadata!.returning_excludes as string[])
    : DEFAULT_EXCLUDES;

  const today = new Date().toISOString().slice(0, 10);
  const { data: rows } = await supabaseAdmin()
    .from("enrollments")
    .select("package_id")
    .eq("user_id", userId)
    .eq("status", "active")
    .or(`access_valid_till.is.null,access_valid_till.gte.${today}`);
  const ids = [...new Set((rows ?? []).map((r) => r.package_id as string))].filter((id) => id !== packageId);
  if (ids.length === 0) return false;

  const { data: pkgs } = await supabaseAdmin().from("packages").select("slug, price").in("id", ids);
  return (pkgs ?? []).some((p) => !(p.slug && excludes.includes(p.slug as string)) && Number(p.price) > 0);
}

/** The price this user pays: the returning price if they qualify and it is lower. */
export async function getBuyerPriceInfo(
  userId: string,
  pkg: PricedPackage & { id: string; metadata?: Meta },
  overrideEndsAt?: string | null
): Promise<PriceInfo & { returning: boolean }> {
  const base = getPriceInfo(pkg, Date.now(), overrideEndsAt);
  const returningPrice = returningAmount(base.amount, pkg.metadata);
  if (returningPrice !== null && returningPrice < base.amount) {
    if (await qualifiesForReturningPrice(userId, pkg.id, pkg.metadata)) {
      return { ...base, amount: returningPrice, isFounding: false, regularPrice: base.amount, returning: true };
    }
  }
  return { ...base, returning: false };
}
