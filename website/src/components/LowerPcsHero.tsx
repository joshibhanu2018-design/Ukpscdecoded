import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { formatINR, type Package } from "@/lib/packages";
import { getPriceInfo } from "@/lib/pricing";
import T from "@/components/T";

/**
 * Homepage banner for the Lower PCS + RO/ARO Complete: "one course, two exams".
 * Price and offer date come from the package (hidden in the Android app).
 */
export default function LowerPcsHero({ pkg }: { pkg: Package }) {
  const info = getPriceInfo(pkg);
  const was = info.isFounding && info.regularPrice && info.regularPrice > info.amount ? info.regularPrice : null;
  const offerTill =
    was && info.foundingEndsAt
      ? new Date(info.foundingEndsAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" })
      : null;
  const points = [
    { en: "65+ video lectures with PDF notes", hi: "65+ वीडियो लेक्चर, PDF नोट्स के साथ" },
    { en: "81 tests incl. 10 Lower PCS full length tests", hi: "81 टेस्ट, 10 लोअर PCS फुल लेंथ टेस्ट सहित" },
    { en: "General Aptitude (CSAT) classes + 12 sectionals", hi: "सामान्य बुद्धि (CSAT) क्लास + 12 सेक्शनल" },
    { en: "Valid till 30 April 2027", hi: "30 अप्रैल 2027 तक मान्य" },
  ];

  return (
    <section className="bg-graphite-950 px-4 pt-6 sm:pt-8">
      <div className="container-custom mx-auto">
        <div className="on-color overflow-hidden rounded-2xl bg-gradient-to-br from-[#f59307] via-[#e67e22] to-[#b45309] p-6 text-white shadow-lg sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/85">
                UKPSC Lower PCS · 27 Dec 2026 &nbsp;+&nbsp; RO/ARO Prelims · April 2027
              </p>
              <h2 className="mt-2 font-display text-3xl font-extrabold leading-tight sm:text-4xl">एक course, दो exams</h2>
              <p className="mt-2 text-base font-semibold text-white/95 sm:text-lg">
                <T en="Lower PCS + RO/ARO Complete: same syllabus, one preparation" hi="लोअर PCS + RO/ARO कम्पलीट: एक सिलेबस, एक तैयारी" />
              </p>
              <ul className="mt-4 grid gap-1.5 text-sm sm:grid-cols-2">
                {points.map((p) => (
                  <li key={p.en} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0" /> <T en={p.en} hi={p.hi} />
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl bg-white/10 p-5 backdrop-blur-sm">
              <div className="web-only">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="font-display text-4xl font-extrabold">{formatINR(info.amount)}</span>
                  {was && <span className="text-base text-white/75 line-through">{formatINR(was)}</span>}
                </div>
                {offerTill && (
                  <p className="mt-1 text-sm font-semibold">
                    <T en={<>Offer price till {offerTill}</>} hi={<>ऑफ़र कीमत {offerTill} तक</>} />
                  </p>
                )}
              </div>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row lg:flex-col">
                <Link
                  href={`/courses/${pkg.slug}`}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#1c1917] px-5 py-3 text-sm font-bold text-white hover:bg-black"
                >
                  <T en="See what's included" hi="देखें क्या-क्या मिलेगा" /> <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/lower-pcs"
                  className="inline-flex flex-1 items-center justify-center rounded-lg border border-white/60 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
                >
                  <T en="All Lower PCS & RO/ARO courses" hi="सभी लोअर PCS और RO/ARO कोर्स" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
