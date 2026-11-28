import type { ReactNode } from "react";
import Link from "next/link";
import { CalendarCheck, CheckCircle2, ClipboardList, Clock, PlayCircle } from "lucide-react";
import { cardLabel, examTab, formatINR, type Package, type Savings } from "@/lib/packages";
import type { PriceInfo } from "@/lib/pricing";
import { EXAM_PAGES } from "@/lib/catalog";
import { courseTone } from "@/components/CourseHeader";
import CourseEnquiryButton from "@/components/CourseEnquiryButton";
import AppPurchaseNote from "@/components/AppPurchaseNote";

const KIND_LABEL: Record<string, string> = {
  test_series: "Test Series",
  video_course: "Video Course",
  combo_bundle: "Course + Tests",
  mentorship: "Mentorship",
};

/**
 * The banner at the top of a course page: product colour with soft light,
 * exam chips, the name in Poppins, what you get, the price with the offer,
 * one big Buy Now (a small "Question? Ask on WhatsApp" link beside it), and (desktop) a "What you get" panel. Everything
 * comes from the package, so it never needs redesigning when a price changes.
 */
export default function CourseHero({
  pkg,
  title,
  tagline,
  priceInfo,
  savings,
  seatsRemaining,
  owned,
  buyHref,
  buyLabel,
  validityLabel,
  liveTests,
  hasVideos,
}: {
  pkg: Package;
  title: string;
  tagline: string | null;
  priceInfo: PriceInfo;
  savings: Savings | null;
  seatsRemaining: number | null;
  owned: boolean;
  buyHref: string;
  buyLabel: ReactNode;
  validityLabel: string | null;
  liveTests: number;
  hasVideos: boolean;
}) {
  const tab = examTab(pkg);
  const label = cardLabel(pkg);
  const was = priceInfo.isFounding && priceInfo.regularPrice && priceInfo.regularPrice > priceInfo.amount ? priceInfo.regularPrice : null;
  const offPercent = was ? Math.round(((was - priceInfo.amount) / was) * 100) : savings?.savingPercent ?? 0;
  const offerTill =
    was && priceInfo.foundingEndsAt
      ? new Date(priceInfo.foundingEndsAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", timeZone: "Asia/Kolkata" })
      : null;
  const facts = [
    hasVideos && { icon: PlayCircle, text: "Video lessons + PDF notes" },
    liveTests > 0 && { icon: ClipboardList, text: `${liveTests} test${liveTests === 1 ? "" : "s"} live` },
    validityLabel && { icon: CalendarCheck, text: `Valid till ${validityLabel}` },
  ].filter(Boolean) as { icon: typeof PlayCircle; text: string }[];

  return (
    <section className="on-color relative overflow-hidden px-4 py-10 text-white sm:py-14" style={{ background: courseTone(pkg) }}>
      {/* soft light + fine grid, purely decorative */}
      <div aria-hidden className="pointer-events-none absolute -right-24 -top-32 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-[#F59307]/20 blur-3xl" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="container-custom relative mx-auto grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:gap-12">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em]">
            <span className="rounded-full bg-white/15 px-3 py-1 ring-1 ring-inset ring-white/25">{KIND_LABEL[pkg.package_type] ?? "Course"}</span>
            {tab && <span className="rounded-full bg-white/15 px-3 py-1 ring-1 ring-inset ring-white/25">{EXAM_PAGES[tab].label}</span>}
            {label && <span className="rounded-full bg-[#F59307] px-3 py-1 text-[#1c1917]">{label}</span>}
          </div>

          <h1 className="mt-4 font-display text-3xl font-bold leading-[1.15] tracking-tight sm:text-5xl">{title}</h1>
          {tagline && <p className="mt-3 max-w-2xl text-base font-medium leading-relaxed text-white/85 sm:text-lg">{tagline}</p>}
          {title.toLowerCase() !== pkg.package_name.toLowerCase() && (
            <p className="mt-1.5 text-sm text-white/70">{pkg.package_name}</p>
          )}

          {facts.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/90">
              {facts.map(({ icon: Icon, text }) => (
                <li key={text} className="inline-flex items-center gap-1.5">
                  <Icon className="h-4 w-4 text-[#fbbf24]" /> {text}
                </li>
              ))}
            </ul>
          )}

          <div className="web-only mt-6 flex flex-wrap items-end gap-x-3 gap-y-2">
            <span className="font-display text-4xl font-bold leading-none sm:text-5xl">{formatINR(priceInfo.amount)}</span>
            {was && <span className="pb-1 text-lg text-white/60 line-through">{formatINR(was)}</span>}
            {offPercent >= 5 && (
              <span className="mb-1 rounded-full bg-[#fde68a] px-2.5 py-0.5 text-xs font-bold text-[#78350f]">
                {was ? `${offPercent}% off` : `Save ${offPercent}%`}
              </span>
            )}
            {seatsRemaining != null && (
              <span className="mb-1 rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-semibold">{seatsRemaining} seats left</span>
            )}
          </div>
          {offerTill && was && (
            <p className="web-only mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-[#fde68a]">
              <Clock className="h-4 w-4" /> Offer price till {offerTill}, then {formatINR(was)}
            </p>
          )}

          {!owned && <AppPurchaseNote className="mt-6 max-w-sm" />}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            {owned ? (
              <Link
                href="/test-platform"
                className="inline-flex items-center rounded-xl border border-white/40 bg-white/10 px-6 py-3 text-sm font-bold"
              >
                Purchased: go to My Courses
              </Link>
            ) : (
              <Link
                href={buyHref}
                className="web-only inline-flex w-full items-center justify-center rounded-xl bg-[#F59307] px-8 py-3.5 text-base font-bold text-[#1c1917] shadow-lg shadow-black/20 transition hover:bg-[#ffa726] sm:w-auto"
              >
                {buyLabel}
              </Link>
            )}
            {!owned && <CourseEnquiryButton courseName={pkg.package_name} slug={pkg.slug} variant="link" />}
          </div>
        </div>

        {pkg.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element -- admin-supplied URL from any host; next/image would need every host allow-listed
          <img src={pkg.image_url} alt="" decoding="async" className="aspect-[16/9] w-full rounded-2xl object-cover shadow-2xl" />
        ) : (
          pkg.highlights.length > 0 && (
            <div className="hidden rounded-2xl bg-white/10 p-6 ring-1 ring-inset ring-white/20 backdrop-blur-sm lg:block">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/70">What you get</p>
              <ul className="mt-4 space-y-3">
                {pkg.highlights.slice(0, 6).map((h) => (
                  <li key={h} className="flex items-start gap-2.5 text-[15px] leading-snug">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#fbbf24]" /> {h}
                  </li>
                ))}
              </ul>
            </div>
          )
        )}
      </div>
    </section>
  );
}
