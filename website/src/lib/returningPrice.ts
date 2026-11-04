import { supabaseAdmin } from "./supabase";
import { getPriceInfo, type PriceInfo, type PricedPackage } from "./pricing";

/**
 * Returning-buyer price (schema-phase37). A package can carry
 * metadata.returning_price (e.g. 500): students who already own any other
 * paid package, except the ones in metadata.returning_excludes (or, by
 * default, Premium / Complete Prelims Pack / Mentorship, which already
 * include these tests), pay that price instead. Applied on the server at
 * checkout, so it can't be faked from the browser.
 */
const DEFAULT_EXCLUDES = ["premium-test-series", "complete-prelims-pack", "prelims-mentorship"];

type Meta = { returning_price?: unknown; returning_excludes?: unknown } | null | undefined;

export async function qualifiesForReturningPrice(userId: string, packageId: string, metadata: Meta): Promise<boolean> {
  const price = Number(metadata?.returning_price);
  if (!Number.isFinite(price) || price <= 0) return false;
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
  const returningPrice = Number(pkg.metadata?.returning_price);
  if (Number.isFinite(returningPrice) && returningPrice > 0 && returningPrice < base.amount) {
    if (await qualifiesForReturningPrice(userId, pkg.id, pkg.metadata)) {
      return { ...base, amount: returningPrice, isFounding: false, regularPrice: base.amount, returning: true };
    }
  }
  return { ...base, returning: false };
}
