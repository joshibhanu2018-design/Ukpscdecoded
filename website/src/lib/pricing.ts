export type PricedPackage = {
  price: number;
  founding_price: number | null;
  regular_price: number | null;
  founding_ends_at: string | null;
};

export type PriceInfo = {
  amount: number;
  isFounding: boolean;
  foundingPrice: number | null;
  regularPrice: number | null;
  foundingEndsAt: string | null;
};

function hasFoundingTier(pkg: PricedPackage): boolean {
  return pkg.founding_price != null && pkg.regular_price != null && pkg.founding_ends_at != null;
}

/**
 * Whether founding pricing is currently active. founding_ends_at is a
 * genuine timestamptz (see schema-phase5-pricing.sql), so it parses
 * correctly regardless of server timezone — no naive-timestamp footgun.
 * If founding_price equals regular_price (e.g. mentorship, no launch
 * discount), this is always false — there's no "phase" worth flagging.
 */
export function isFoundingActive(
  pkg: PricedPackage,
  now: number = Date.now(),
  overrideEndsAt?: string | null
): boolean {
  if (!hasFoundingTier(pkg)) return false;
  if (pkg.founding_price === pkg.regular_price) return false;

  const endsAt = overrideEndsAt ?? pkg.founding_ends_at!;
  return now < new Date(endsAt).getTime();
}

/**
 * The effective price right now. `overrideEndsAt` lets a multi-use
 * price-lock coupon extend founding eligibility past the package's own
 * founding_ends_at for one specific order — see src/lib/coupons.ts.
 */
export function getPriceInfo(pkg: PricedPackage, now: number = Date.now(), overrideEndsAt?: string | null): PriceInfo {
  const founding = isFoundingActive(pkg, now, overrideEndsAt);
  const amount = hasFoundingTier(pkg) ? (founding ? pkg.founding_price! : pkg.regular_price!) : pkg.price;

  return {
    amount,
    isFounding: founding,
    foundingPrice: pkg.founding_price,
    regularPrice: pkg.regular_price,
    foundingEndsAt: pkg.founding_ends_at,
  };
}

export function formatFoundingLabel(info: PriceInfo): string | null {
  if (!info.isFounding || info.regularPrice == null) return null;
  return `फाउंडिंग मूल्य ₹${info.foundingPrice} — 1 अक्टूबर से ₹${info.regularPrice} हो जाएगा / Founding price ₹${info.foundingPrice}, becomes ₹${info.regularPrice} on 1 October`;
}
