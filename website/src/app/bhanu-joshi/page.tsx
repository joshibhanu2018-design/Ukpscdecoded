import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck } from "lucide-react";
import settings from "@content/settings.json";
import about from "@content/about.json";
import { ORG_ID, PERSON_ID, SITE_URL, breadcrumbJsonLd, ldJson, socialProfiles } from "@/lib/seo";

/**
 * Author page. Google ranks exam advice higher when a real, named expert is
 * behind it ("E-E-A-T"), so every guide page links here. Wording settled with
 * Bhanu on 18 Nov 2026: "UKPSC Rank 9"; the story is in his own words.
 */

const PATH = "/bhanu-joshi";

export const metadata: Metadata = {
  title: { absolute: "Bhanu Joshi, UKPSC Rank 9: Founder of UKPSC Decoded" },
  description:
    "Bhanu Joshi (UKPSC Rank 9) cleared 7 UKPSC Mains and 5 interviews across Upper and Lower PCS, wrote the book Uttarakhand Decoded and teaches Lower PCS, RO/ARO and Upper PCS on ukpscdecoded.in.",
  alternates: { canonical: PATH },
  openGraph: { title: "Bhanu Joshi, UKPSC Rank 9", url: PATH, type: "profile" },
};

const story = [
  {
    en: "I have prepared for UPSC and UKPSC for years. In UKPSC I cleared 7 Mains and 5 Interviews across Upper and Lower PCS, and I am UKPSC Rank 9.",
    hi: "मैंने वर्षों तक UPSC और UKPSC की तैयारी की है। UKPSC में अपर और लोअर पीसीएस मिलाकर 7 मुख्य परीक्षाएँ और 5 साक्षात्कार दिए, और मेरी UKPSC रैंक 9 है।",
  },
  {
    en: "While preparing, I found no single good source for Uttarakhand GK, so I wrote one: the book Uttarakhand Decoded.",
    hi: "तैयारी के दौरान उत्तराखंड GK का कोई एक अच्छा स्रोत नहीं मिला, इसलिए मैंने स्वयं लिखा: पुस्तक 'उत्तराखंड डिकोडेड'।",
  },
  {
    en: "Then I built courses and test series on ukpscdecoded.in, so students across Uttarakhand can prepare at a fair price, in Hindi and English. Study smarter, not longer.",
    hi: "फिर ukpscdecoded.in पर कोर्स और टेस्ट सीरीज़ बनाई, ताकि उत्तराखंड का हर छात्र कम कीमत पर, हिंदी और अंग्रेज़ी में तैयारी कर सके।",
  },
];

export default function BhanuJoshiPage() {
  const sameAs = socialProfiles();
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${SITE_URL}${PATH}#page`,
        url: `${SITE_URL}${PATH}`,
        name: "Bhanu Joshi, UKPSC Rank 9",
        inLanguage: ["en-IN", "hi-IN"],
        mainEntity: { "@id": PERSON_ID },
      },
      {
        "@type": "Person",
        "@id": PERSON_ID,
        name: "Bhanu Joshi",
        alternateName: "भानु जोशी",
        jobTitle: "Founder and educator, UKPSC Decoded",
        description: "UKPSC Rank 9. Cleared 7 UKPSC Mains and 5 interviews; author of the book Uttarakhand Decoded.",
        url: `${SITE_URL}${PATH}`,
        worksFor: { "@id": ORG_ID },
        knowsAbout: ["UKPSC", "Uttarakhand GK", "UKPSC Lower PCS", "UKPSC RO/ARO", "Uttarakhand history", "Uttarakhand geography"],
        homeLocation: { "@type": "Place", name: "Uttarakhand, India" },
        ...(sameAs.length ? { sameAs } : {}),
      },
      breadcrumbJsonLd([{ name: "Bhanu Joshi", path: PATH }]),
    ],
  };

  return (
    <div className="bg-graphite-950 px-4 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(jsonLd) }} />
      <article className="container-custom mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-saffron-400">Founder · UKPSC Decoded</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">Bhanu Joshi</h1>
        <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-saffron-400/15 px-3 py-1 text-sm font-bold text-saffron-300">
          <BadgeCheck className="h-4 w-4" aria-hidden /> UKPSC Rank 9 · <span lang="hi">भानु जोशी</span>
        </p>

        <section className="mt-8 space-y-5">
          {story.map((s) => (
            <div key={s.en}>
              <p className="text-base leading-relaxed text-graphite-200">{s.en}</p>
              <p lang="hi" className="mt-1 text-base leading-relaxed text-graphite-300">
                {s.hi}
              </p>
            </div>
          ))}
        </section>

        <section className="mt-10 rounded-2xl border border-graphite-800 bg-graphite-900/60 p-5">
          <h2 className="font-display text-xl font-bold text-white">Exam record · परीक्षा अनुभव</h2>
          <ul className="mt-3 space-y-2 text-sm text-graphite-200">
            {about.founder.credentials.map((c) => (
              <li key={c.area}>
                <strong className="text-white">{c.area}:</strong> {c.credential}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="font-display text-xl font-bold text-white">Learn with Bhanu · भानु के साथ तैयारी</h2>
          <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              { href: "/lower-pcs", label: "Lower PCS + RO/ARO course" },
              { href: "/ukpsc-lower-pcs-2026", label: "Lower PCS 2026: free guide" },
              { href: "/buy-book", label: "Book: Uttarakhand Decoded" },
              { href: "/uttarakhand-gk-quiz", label: "Free quiz and mock test" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="flex items-center justify-between rounded-xl border border-graphite-800 p-4 font-semibold text-white hover:border-saffron-400/60">
                  {l.label} <ArrowRight className="h-4 w-4 text-saffron-400" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-graphite-300">
            Free lessons on{" "}
            <a href={settings.social.youtube} target="_blank" rel="noopener noreferrer" className="text-saffron-300 underline">
              YouTube
            </a>{" "}
            ·{" "}
            <a href={settings.social.instagram} target="_blank" rel="noopener noreferrer" className="text-saffron-300 underline">
              Instagram
            </a>{" "}
            ·{" "}
            <a href={settings.social.telegram} target="_blank" rel="noopener noreferrer" className="text-saffron-300 underline">
              Telegram
            </a>
          </p>
        </section>
      </article>
    </div>
  );
}
