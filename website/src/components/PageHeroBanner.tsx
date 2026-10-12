import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { formatINR, type Package } from "@/lib/packages";
import { formatFoundingLabel, getPriceInfo } from "@/lib/pricing";

/**
 * The product's designed carousel banner (public/banners/) at the top of a
 * store page, with its price and a Buy Now button straight to checkout.
 * Hidden inside the Android app (no purchases or prices there).
 */
export default function PageHeroBanner({
  pkg,
  owned,
  desktop,
  mobile,
  alt,
}: {
  pkg: Package;
  owned?: boolean;
  desktop: string;
  mobile: string;
  alt: string;
}) {
  const priceInfo = getPriceInfo(pkg);
  const foundingLabel = formatFoundingLabel(priceInfo);
  const detailHref = `/courses/${pkg.slug}`;
  const buyHref = owned ? detailHref : `/checkout/${pkg.slug}`;
  const picture = (
    <picture>
      <source media="(max-width: 639px)" srcSet={mobile} />
      {/* eslint-disable-next-line @next/next/no-img-element -- pre-sized WebP in public/banners */}
      <img
        src={desktop}
        alt={alt}
        width={1920}
        height={600}
        fetchPriority="high"
        decoding="async"
        className="block aspect-square w-full object-cover sm:aspect-[16/5]"
      />
    </picture>
  );

  return (
    <section className="web-only overflow-hidden rounded-2xl border border-saffron-400/40 bg-graphite-900 shadow-2xl shadow-black/40">
      <Link href={buyHref} className="block">
        {picture}
      </Link>
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="font-display text-lg font-bold text-white">{pkg.package_name}</p>
          <p className="text-sm text-graphite-300">
            <span className="text-xl font-bold text-saffron-300">{formatINR(priceInfo.amount)}</span>
            {foundingLabel && <span className="ml-2 text-xs font-medium text-saffron-300/90">{foundingLabel}</span>}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Link
            href={detailHref}
            className="min-h-[44px] rounded-lg border border-graphite-700 px-5 py-2.5 text-center text-sm font-semibold text-graphite-100 hover:border-saffron-400/60"
          >
            View details
          </Link>
          {owned ? (
            <span className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-lg border border-success-500/30 bg-success-500/10 px-5 py-2.5 text-sm font-semibold text-success-400">
              <CheckCircle2 className="h-4 w-4" /> Purchased
            </span>
          ) : (
            <>
              <Link
                href={buyHref}
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-saffron-400 px-6 py-2.5 text-sm font-bold text-graphite-900 shadow-lg shadow-saffron-500/20 transition-colors hover:bg-saffron-300"
              >
                Buy Now <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
