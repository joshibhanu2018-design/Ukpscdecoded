import Link from "next/link";
import { Check, Star } from "lucide-react";
import { formatINR, type Package } from "@/lib/packages";
import { formatFoundingLabel, getPriceInfo } from "@/lib/pricing";
import CourseHeader from "./CourseHeader";

export default function CourseCard({
  pkg,
  mostPopular,
  owned,
  size = "md",
  wide = false,
}: {
  pkg: Package;
  mostPopular?: boolean;
  owned?: boolean;
  /** "lg" for the three premium plans, "sm" for the standalone packs. */
  size?: "sm" | "md" | "lg";
  /** Header beside the details from 768px (a single course on its own row). */
  wide?: boolean;
}) {
  const priceInfo = getPriceInfo(pkg);
  const foundingLabel = formatFoundingLabel(priceInfo);
  const detailHref = `/courses/${pkg.slug}`;
  const checkoutHref = `/checkout/${pkg.slug}`;

  return (
    <div
      className={`relative flex flex-col overflow-hidden rounded-2xl border bg-graphite-900 shadow-xl shadow-black/30 ${
        mostPopular ? "border-saffron-400 ring-2 ring-saffron-400/60" : "border-graphite-800"
      } ${wide ? "md:flex-row" : ""}`}
    >
      {mostPopular && (
        <p className={`flex items-center justify-center gap-1.5 bg-saffron-400 px-3 py-1.5 text-xs font-bold text-graphite-900 ${wide ? "md:hidden" : ""}`}>
          <Star className="h-3.5 w-3.5 fill-current" /> Most Popular
        </p>
      )}

      <Link href={detailHref} className={`block ${wide ? "md:w-2/5 md:flex-shrink-0" : ""}`}>
        <CourseHeader pkg={pkg} size={size} titleAs="h3" className={`w-full ${wide ? "h-full min-h-[8rem]" : "min-h-[8rem]"}`} />
      </Link>

      <div className="flex flex-1 flex-col">
        <Link href={detailHref} className="block flex-1 p-5">
          {pkg.image_url && <h3 className="font-bold text-white">{pkg.package_name}</h3>}
          {pkg.highlights.length > 0 && (
            <ul className={`space-y-1.5 ${pkg.image_url ? "mt-2" : ""}`}>
              {pkg.highlights.slice(0, 4).map((h) => (
                <li key={h} className={`flex items-start gap-1.5 text-graphite-300 ${size === "lg" ? "text-sm" : "text-xs"}`}>
                  <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-saffron-400" /> {h}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 flex items-baseline gap-2">
            <span className={`font-bold text-white ${size === "lg" ? "text-2xl" : "text-xl"}`}>{formatINR(priceInfo.amount)}</span>
          </div>
          {foundingLabel && <p className="mt-1 text-[11px] font-medium text-saffron-300">{foundingLabel}</p>}
        </Link>

        <div className="px-5 pb-5">
          {owned ? (
            <div className="rounded-lg border border-success-500/30 bg-success-500/10 px-4 py-2.5 text-center text-sm font-semibold text-success-400">
              Purchased
            </div>
          ) : (
            <Link
              href={checkoutHref}
              className="block min-h-[44px] rounded-lg bg-saffron-400 px-4 py-2.5 text-center text-sm font-bold text-graphite-900 transition-colors hover:bg-saffron-300"
            >
              Buy Now
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
