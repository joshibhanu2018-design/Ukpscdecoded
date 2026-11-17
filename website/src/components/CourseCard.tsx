import Link from "next/link";
import { BookOpen, Check, ClipboardList, Layers, Star, UserRound, type LucideIcon } from "lucide-react";
import { cardLabel, formatINR, type Package } from "@/lib/packages";
import { getPriceInfo } from "@/lib/pricing";
import { courseHeader } from "@/lib/course-display";
import CourseCardActions from "./CourseCardActions";
import T from "@/components/T";

// One colour per kind of product: a thin strip on top, the label and its icon.
const KINDS: Record<string, { color: string; en: string; hi: string; icon: LucideIcon }> = {
  test_series: { color: "#9f1d3a", en: "Test Series", hi: "टेस्ट सीरीज़", icon: ClipboardList },
  video_course: { color: "#0f766e", en: "Video Course", hi: "वीडियो कोर्स", icon: BookOpen },
  combo_bundle: { color: "#9a6a0c", en: "Course + Tests", hi: "कोर्स + टेस्ट", icon: Layers },
  mentorship: { color: "#6d28d9", en: "Mentorship", hi: "मेंटरशिप", icon: UserRound },
};

/**
 * A product card for the white theme: coloured strip and kind label, the
 * name in dark text, what you get, the price (with the old price struck
 * out during an offer) and the buttons. `owned` may be passed by a page
 * that already knows; otherwise the buttons check in the browser.
 */
export default function CourseCard({
  pkg,
  badge,
  owned,
  size = "md",
  wide = false,
}: {
  pkg: Package;
  /** Highlighted card: saffron border + this label in a strip on top, e.g. "Best Buy". */
  badge?: string;
  owned?: boolean;
  /** "lg" for the three premium plans, "sm" for the standalone packs. */
  size?: "sm" | "md" | "lg";
  /** Name and price beside the details from 768px (a single course on its own row). */
  wide?: boolean;
}) {
  const priceInfo = getPriceInfo(pkg);
  const offerTill =
    priceInfo.isFounding && priceInfo.foundingEndsAt
      ? new Date(priceInfo.foundingEndsAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" })
      : null;
  const detailHref = `/courses/${pkg.slug}`;
  const { title, tagline } = courseHeader(pkg);
  const kind = KINDS[pkg.package_type] ?? KINDS.combo_bundle;
  const KindIcon = kind.icon;
  const was = priceInfo.isFounding && priceInfo.regularPrice && priceInfo.regularPrice > priceInfo.amount ? priceInfo.regularPrice : null;
  const offPercent = was ? Math.round(((was - priceInfo.amount) / was) * 100) : 0;
  const titleSize = size === "lg" ? "text-2xl" : size === "sm" ? "text-lg" : "text-xl";
  const label = cardLabel(pkg);
  // metadata.separate_total: what the parts cost bought one by one (bundles).
  const separateRaw = Number(pkg.metadata?.separate_total);
  const separate = Number.isFinite(separateRaw) && separateRaw > priceInfo.amount ? separateRaw : null;

  return (
    <div
      className={`relative flex flex-col overflow-hidden rounded-2xl border bg-graphite-900 shadow-sm transition-shadow hover:shadow-lg ${
        badge ? "border-saffron-400 ring-2 ring-saffron-400/60" : "border-graphite-800"
      }`}
    >
      {badge ? (
        <p className="flex items-center justify-center gap-1.5 bg-saffron-400 px-3 py-1.5 text-center text-xs font-bold text-graphite-900">
          <Star className="h-3.5 w-3.5 flex-shrink-0 fill-current" /> {badge}
        </p>
      ) : (
        <div aria-hidden className="h-1.5" style={{ background: kind.color }} />
      )}

      <div className={`flex flex-1 flex-col ${wide ? "md:flex-row" : ""}`}>
        <Link href={detailHref} className={`block p-5 pb-0 ${wide ? "md:w-2/5 md:flex-shrink-0 md:pb-5" : ""}`}>
          {pkg.image_url && (
            // eslint-disable-next-line @next/next/no-img-element -- admin-supplied URL from any host
            <img src={pkg.image_url} alt="" loading="lazy" decoding="async" className="mb-4 aspect-[16/9] w-full rounded-xl object-cover" />
          )}
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide"
            style={{ color: kind.color, background: `${kind.color}14` }}
          >
            <KindIcon className="h-3.5 w-3.5" /> <T en={kind.en} hi={kind.hi} />
          </span>
          {label && (
            <span className="ml-2 inline-flex items-center rounded-full border border-graphite-700 px-2.5 py-1 text-[11px] font-semibold text-graphite-300">
              {label}
            </span>
          )}
          <h3 className={`mt-3 font-display ${titleSize} font-bold leading-snug text-white`}>{title}</h3>
          {tagline && <p className="mt-1.5 text-sm font-medium leading-snug text-graphite-300">{tagline}</p>}
        </Link>

        <div className="flex flex-1 flex-col">
          <Link href={detailHref} className="block flex-1 px-5 pt-4">
            {pkg.highlights.length > 0 && (
              <ul className="space-y-1.5">
                {pkg.highlights.slice(0, 4).map((h) => (
                  <li key={h} className="flex items-start gap-2 text-sm text-graphite-300">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0" style={{ color: kind.color }} /> {h}
                  </li>
                ))}
              </ul>
            )}
          </Link>

          <div className="mt-4 border-t border-graphite-800 px-5 pb-5 pt-4">
            <div className="web-only mb-3">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className={`font-display font-bold text-white ${size === "lg" ? "text-3xl" : "text-2xl"}`}>{formatINR(priceInfo.amount)}</span>
                {was && <span className="text-sm text-graphite-400 line-through">{formatINR(was)}</span>}
                {offPercent >= 5 && (
                  <span className="rounded-full bg-success-500/10 px-2 py-0.5 text-xs font-bold text-success-400">
                    {offPercent}% <T en="off" hi="छूट" />
                  </span>
                )}
              </div>
              {was && offerTill && (
                <p className="mt-1 text-xs font-medium leading-snug text-saffron-300">
                  <T en={<>Offer price till {offerTill}</>} hi={<>ऑफ़र कीमत {offerTill} तक</>} />
                </p>
              )}
              {separate && (
                <p className="mt-1 text-xs leading-snug text-graphite-400">
                  <T
                    en={<>Bought separately: <span className="line-through">{formatINR(separate)}</span> · you save {formatINR(separate - priceInfo.amount)}</>}
                    hi={<>अलग-अलग खरीदने पर: <span className="line-through">{formatINR(separate)}</span> · आपकी बचत {formatINR(separate - priceInfo.amount)}</>}
                  />
                </p>
              )}
            </div>
            <CourseCardActions packageId={pkg.id} slug={pkg.slug} owned={owned} />
          </div>
        </div>
      </div>
    </div>
  );
}
