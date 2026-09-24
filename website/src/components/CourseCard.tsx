import Link from "next/link";
import { Check } from "lucide-react";
import { formatINR, type Package } from "@/lib/packages";
import { formatFoundingLabel, getPriceInfo } from "@/lib/pricing";

export default function CourseCard({
  pkg,
  mostPopular,
  owned,
}: {
  pkg: Package;
  mostPopular?: boolean;
  owned?: boolean;
}) {
  const priceInfo = getPriceInfo(pkg);
  const foundingLabel = formatFoundingLabel(priceInfo);
  const detailHref = `/courses/${pkg.slug}`;
  const checkoutHref = `/checkout/${pkg.slug}`;

  return (
    <div className="relative flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
      {mostPopular && (
        <span className="absolute left-4 top-4 z-10 rounded-full bg-yellow-500 px-3 py-1 text-xs font-bold text-slate-900">
          सबसे लोकप्रिय / Most Popular
        </span>
      )}

      <Link href={detailHref} className="block">
        <div
          className="h-28 w-full"
          style={{ background: "linear-gradient(135deg, #f59307, #78300d)" }}
          aria-hidden
        />
        <div className="p-5">
          <h3 className="font-bold text-white">{pkg.package_name}</h3>
          {pkg.highlights.length > 0 && (
            <ul className="mt-2 space-y-1">
              {pkg.highlights.slice(0, 4).map((h) => (
                <li key={h} className="flex items-start gap-1.5 text-xs text-slate-400">
                  <Check className="mt-0.5 h-3 w-3 flex-shrink-0 text-yellow-500" /> {h}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-xl font-bold text-white">{formatINR(priceInfo.amount)}</span>
          </div>
          {foundingLabel && <p className="mt-1 text-[11px] font-medium text-yellow-400">{foundingLabel}</p>}
        </div>
      </Link>

      <div className="px-5 pb-5">
        {owned ? (
          <div className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-2.5 text-center text-sm font-semibold text-green-400">
            Purchased
          </div>
        ) : (
          <Link
            href={checkoutHref}
            className="block rounded-lg bg-yellow-500 px-4 py-2.5 text-center text-sm font-bold text-slate-900 transition-colors hover:bg-yellow-400"
          >
            Buy Now
          </Link>
        )}
      </div>
    </div>
  );
}
