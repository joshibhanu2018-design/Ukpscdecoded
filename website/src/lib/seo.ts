import settings from "@content/settings.json";

/** Shared values for search-engine data (JSON-LD), so every page describes the site the same way. */
export const SITE_URL = "https://www.ukpscdecoded.in";
export const ORG_ID = `${SITE_URL}/#organization`;
export const PERSON_ID = `${SITE_URL}/bhanu-joshi#person`;

type Social = { youtube?: string; telegram?: string; instagram?: string; facebook?: string; amazonBook?: string; amazonBookHi?: string };

/**
 * Every public profile of UKPSC Decoded. Google uses this list ("sameAs") to
 * tie the website, YouTube, Instagram, Facebook and the Amazon book together.
 * Add or change links in content/settings.json → social (empty ones are skipped).
 */
export function socialProfiles(): string[] {
  const s = settings.social as Social;
  return [s.youtube, s.instagram, s.facebook, s.telegram, s.amazonBook, s.amazonBookHi].filter((u): u is string => !!u && u.startsWith("http"));
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...items].map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path === "/" ? "" : it.path}`,
    })),
  };
}

export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

/** Safe <script type="application/ld+json"> body. */
export function ldJson(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
