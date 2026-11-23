import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, BadgeCheck, CalendarDays, ExternalLink } from "lucide-react";
import { ORG_ID, PERSON_ID, SITE_URL, breadcrumbJsonLd, faqJsonLd, ldJson } from "@/lib/seo";

/**
 * Layout for the free exam-guide pages (Lower PCS, RO/ARO, previous papers,
 * free practice). Each page is plain, static text in English AND Hindi, both
 * visible, so Google can match searches in either language. No database
 * calls: these pages are built once and served from Vercel's cache.
 */

export type Fact = { label: string; labelHi: string; value: ReactNode; valueHi?: ReactNode };
export type GuideSection = { id: string; h: string; hHi: string; en: ReactNode; hi: ReactNode };
export type Faq = { q: string; qHi: string; a: string; aHi: string };
export type LinkItem = { href: string; label: string; labelHi?: string; note?: string };

type Props = {
  path: string;
  crumb: string;
  kicker: string;
  title: string;
  titleHi: string;
  intro: string;
  introHi: string;
  /** Date the facts were last checked, e.g. "23 Nov 2026". */
  updated: string;
  updatedIso: string;
  facts?: Fact[];
  factsNote?: ReactNode;
  sections: GuideSection[];
  faqs?: Faq[];
  sources?: LinkItem[];
  related?: LinkItem[];
  cta?: { href: string; label: string; labelHi: string; text: string; textHi: string };
};

export function Hi({ children }: { children: ReactNode }) {
  return (
    <div lang="hi" className="mt-3 border-l-2 border-saffron-400/50 pl-3 text-graphite-300">
      {children}
    </div>
  );
}

export default function ExamGuide(p: Props) {
  const url = `${SITE_URL}${p.path}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: p.title,
        description: p.intro,
        inLanguage: ["en-IN", "hi-IN"],
        dateModified: p.updatedIso,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        publisher: { "@id": ORG_ID },
        author: { "@id": PERSON_ID },
      },
      breadcrumbJsonLd([{ name: p.crumb, path: p.path }]),
      ...(p.faqs?.length ? [faqJsonLd(p.faqs.map((f) => ({ q: f.q, a: f.a })))] : []),
    ],
  };

  return (
    <div className="bg-graphite-950 px-4 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(jsonLd) }} />
      <article className="container-custom mx-auto max-w-3xl">
        <nav aria-label="Breadcrumb" className="text-xs text-graphite-400">
          <Link href="/" className="hover:text-saffron-400">
            Home
          </Link>{" "}
          / <span className="text-graphite-300">{p.crumb}</span>
        </nav>

        <header className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-saffron-400">{p.kicker}</p>
          <h1 className="mt-2 font-display text-3xl font-bold leading-tight text-white sm:text-4xl">{p.title}</h1>
          <p lang="hi" className="mt-1 font-display text-xl font-semibold text-saffron-300 sm:text-2xl">
            {p.titleHi}
          </p>
          <p className="mt-4 text-base leading-relaxed text-graphite-200">{p.intro}</p>
          <p lang="hi" className="mt-2 text-base leading-relaxed text-graphite-300">
            {p.introHi}
          </p>
          <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-graphite-400">
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5" aria-hidden /> Updated {p.updated}
            </span>
            <Link href="/bhanu-joshi" className="inline-flex items-center gap-1 hover:text-saffron-400">
              <BadgeCheck className="h-3.5 w-3.5 text-saffron-400" aria-hidden /> By Bhanu Joshi, UKPSC Rank 9
            </Link>
          </p>
        </header>

        {p.facts && p.facts.length > 0 && (
          <section className="mt-8 overflow-hidden rounded-2xl border border-graphite-800 bg-graphite-900/60" aria-label="Quick facts">
            <table className="w-full text-left text-sm">
              <tbody>
                {p.facts.map((f) => (
                  <tr key={f.label} className="border-b border-graphite-800 last:border-0 align-top">
                    <th scope="row" className="w-2/5 px-4 py-3 font-semibold text-white">
                      {f.label}
                      <span lang="hi" className="block text-xs font-normal text-graphite-400">
                        {f.labelHi}
                      </span>
                    </th>
                    <td className="px-4 py-3 text-graphite-200">
                      {f.value}
                      {f.valueHi && (
                        <span lang="hi" className="block text-xs text-graphite-400">
                          {f.valueHi}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {p.factsNote && <p className="border-t border-graphite-800 px-4 py-3 text-xs text-graphite-400">{p.factsNote}</p>}
          </section>
        )}

        {p.sections.length > 2 && (
          <nav aria-label="On this page" className="mt-8 rounded-2xl border border-graphite-800 p-4 text-sm">
            <p className="font-semibold text-white">On this page · इस पेज पर</p>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-graphite-300">
              {p.sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="hover:text-saffron-400">
                    {s.h}
                  </a>
                </li>
              ))}
              {p.faqs?.length ? (
                <li>
                  <a href="#faq" className="hover:text-saffron-400">
                    FAQs
                  </a>
                </li>
              ) : null}
            </ol>
          </nav>
        )}

        {p.sections.map((s) => (
          <section key={s.id} id={s.id} className="mt-10 scroll-mt-24">
            <h2 className="font-display text-2xl font-bold text-white">{s.h}</h2>
            <p lang="hi" className="font-display text-lg font-semibold text-saffron-300">
              {s.hHi}
            </p>
            <div className="guide-body mt-3 space-y-3 text-[15px] leading-relaxed text-graphite-200">{s.en}</div>
            <Hi>
              <div className="guide-body space-y-3 text-[15px] leading-relaxed">{s.hi}</div>
            </Hi>
          </section>
        ))}

        {p.cta && (
          <section className="mt-12 rounded-2xl border border-saffron-400/50 bg-saffron-400/10 p-5">
            <p className="text-sm text-graphite-200">{p.cta.text}</p>
            <p lang="hi" className="mt-1 text-sm text-graphite-300">
              {p.cta.textHi}
            </p>
            <Link
              href={p.cta.href}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-saffron-400 px-5 py-2.5 text-sm font-bold text-graphite-900 hover:bg-saffron-300"
            >
              {p.cta.label} · <span lang="hi">{p.cta.labelHi}</span> <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </section>
        )}

        {p.faqs && p.faqs.length > 0 && (
          <section id="faq" className="mt-12 scroll-mt-24">
            <h2 className="font-display text-2xl font-bold text-white">Frequently asked questions</h2>
            <p lang="hi" className="font-display text-lg font-semibold text-saffron-300">
              अक्सर पूछे जाने वाले प्रश्न
            </p>
            <div className="mt-4 space-y-3">
              {p.faqs.map((f) => (
                <details key={f.q} className="rounded-xl border border-graphite-800 bg-graphite-900/60 p-4">
                  <summary className="cursor-pointer font-semibold text-white">
                    {f.q}
                    <span lang="hi" className="block text-sm font-normal text-graphite-300">
                      {f.qHi}
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-graphite-200">{f.a}</p>
                  <p lang="hi" className="mt-2 text-sm leading-relaxed text-graphite-300">
                    {f.aHi}
                  </p>
                </details>
              ))}
            </div>
          </section>
        )}

        {p.related && p.related.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display text-xl font-bold text-white">
              Keep preparing · <span lang="hi">तैयारी जारी रखें</span>
            </h2>
            <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {p.related.map((r) => (
                <li key={r.href}>
                  <Link
                    href={r.href}
                    className="flex h-full items-start justify-between gap-2 rounded-xl border border-graphite-800 p-4 hover:border-saffron-400/60"
                  >
                    <span>
                      <span className="block font-semibold text-white">{r.label}</span>
                      {r.labelHi && (
                        <span lang="hi" className="block text-sm text-graphite-300">
                          {r.labelHi}
                        </span>
                      )}
                      {r.note && <span className="mt-1 block text-xs text-graphite-400">{r.note}</span>}
                    </span>
                    <ArrowRight className="mt-1 h-4 w-4 flex-shrink-0 text-saffron-400" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {p.sources && p.sources.length > 0 && (
          <section className="mt-12 rounded-2xl border border-graphite-800 p-4 text-xs leading-relaxed text-graphite-400">
            <p className="font-semibold text-graphite-200">Official sources · आधिकारिक स्रोत</p>
            <ul className="mt-2 space-y-1">
              {p.sources.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-saffron-300 underline">
                    {s.label} <ExternalLink className="h-3 w-3" aria-hidden />
                  </a>
                  {s.note && <span> · {s.note}</span>}
                </li>
              ))}
            </ul>
            <p className="mt-2">
              UKPSC Decoded is an independent platform, not linked to UKPSC or the Government of Uttarakhand. Always confirm dates
              and rules in the official advertisement. · UKPSC Decoded एक स्वतंत्र प्लेटफ़ॉर्म है; तिथियाँ और नियम आधिकारिक विज्ञापन से
              अवश्य मिलाएँ।
            </p>
          </section>
        )}
      </article>
    </div>
  );
}
