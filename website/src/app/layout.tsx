import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Navbar, { type NavMenus } from "@/components/Navbar";
import Footer from "@/components/Footer";
import AppTabBar from "@/components/AppTabBar";
import FreeMockPopup from "@/components/FreeMockPopup";
import { getWarmupTest } from "@/lib/liveMock";
import { parseUtcTimestamp } from "@/lib/timestamps";
import InstallPrompt from "@/components/InstallPrompt";
import WhatsAppButton from "@/components/WhatsAppButton";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import ScrollUnlock from "@/components/ScrollUnlock";
import Clarity from "@/components/Clarity";
import { getActiveOffer } from "@/lib/coupons";
import OfferBar from "@/components/OfferBar";
import FinalMonthBar, { type FinalMonthItem } from "@/components/FinalMonthBar";
import { getActivePackages, formatINR, isListed, type Package } from "@/lib/packages";
import { examProducts, productHref } from "@/lib/catalog";
import { getPriceInfo } from "@/lib/pricing";

const siteUrl = "https://www.ukpscdecoded.in";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f8f7f3",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "UKPSC Decoded — Complete Uttarakhand Exam Preparation",
    template: "%s | UKPSC Decoded",
  },
  description:
    "India's most comprehensive preparation platform for UKPSC PCS, Lower PCS, RO/ARO, UKSSSC & all Uttarakhand state examinations. Free videos, daily MCQs, PYQ tracker, and the complete guidebook.",
  keywords: [
    "UKPSC",
    "UKPSC preparation",
    "Uttarakhand GK",
    "Uttarakhand exam",
    "UKPSC PCS",
    "Lower PCS",
    "RO ARO",
    "UKSSSC",
    "Uttarakhand book",
    "UKPSC Decoded",
    "Uttarakhand current affairs",
    "UKPSC syllabus 2026",
    "Uttarakhand history",
    "Uttarakhand geography",
    "UKPSC previous year questions",
    "PYQ UKPSC",
    "Uttarakhand GK book",
    "best book for UKPSC",
    "UKPSC online coaching",
    "free UKPSC videos",
  ],
  authors: [{ name: "UKPSC Decoded", url: siteUrl }],
  // iPhone "Add to Home Screen": open full-screen with the app's own name.
  appleWebApp: { capable: true, title: "UKPSC Decoded", statusBarStyle: "default" },
  creator: "UKPSC Decoded",
  publisher: "UKPSC Decoded",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "UKPSC Decoded",
    title: "UKPSC Decoded — Complete Uttarakhand Exam Preparation",
    description:
      "Free videos, daily MCQs, PYQ tracker, and India's only single-volume guidebook for all Uttarakhand state exams.",
  },
  twitter: {
    card: "summary_large_image",
    title: "UKPSC Decoded — Complete Uttarakhand Exam Preparation",
    description:
      "Free videos, daily MCQs, PYQ tracker, and India's only single-volume guidebook for all Uttarakhand state exams.",
    creator: "@ukpscdecoded",
  },
  verification: {
    // Add your Google Search Console verification code here once you have it
    // google: "your-verification-code",
  },
  category: "education",
};

// JSON-LD Structured Data for the organization
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
  "@type": "EducationalOrganization",
  "@id": `${siteUrl}/#organization`,
  name: "UKPSC Decoded",
  url: siteUrl,
  logo: `${siteUrl}/icons/icon-512.png`,
  founder: { "@type": "Person", name: "Bhanu Joshi" },
  description:
    "India's most comprehensive preparation platform for all Uttarakhand state examinations.",
  sameAs: [
    "https://www.youtube.com/@Ukpscdecoded",
    "https://t.me/ukpscdecoded",
    "https://instagram.com/ukpscdecoded",
  ],
  address: {
    "@type": "PostalAddress",
    addressRegion: "Uttarakhand",
    addressCountry: "IN",
  },
  areaServed: {
    "@type": "State",
    name: "Uttarakhand",
  },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: "UKPSC Decoded",
      url: siteUrl,
      inLanguage: "en-IN",
      publisher: { "@id": `${siteUrl}/#organization` },
    },
  ],
};

// Self-hosted by Next.js (no render-blocking request to Google Fonts on each visit).
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

/**
 * The layout reads no cookies, so every public page can be built once and
 * served from Vercel's cache to all visitors (re-built in the background at
 * most every 5 minutes, which is how price or banner changes appear).
 * Who is logged in is worked out in the browser (src/lib/session-client.ts).
 * Pages that read the login cookie themselves (student area, checkout,
 * /revision, /mahasangram, /courses/[slug]) still run on every visit.
 */
export const revalidate = 300;

/**
 * Offers for the top bar: the Upper PCS cut prices (till 29 Nov) and the Lower PCS
 * early-bird prices (till their founding_ends_at, 6 Dec), each with what it sold for before.
 * Only offers running right now are shown; prices come from the database.
 */
function getFinalMonthItems(pkgs: Package[]): FinalMonthItem[] {
  const upperOn = Date.now() <= new Date("2026-11-29T23:59:59+05:30").getTime();
  const show: [string, string, "upper" | "lower"][] = [
    ["revision-test-series", "Revision Test Series 2026", "upper"],
    ["mock-mahasangram", "Rank Challenge 2026", "upper"],
    ["lower-pcs-complete", "Lower PCS Complete · early bird", "lower"],
    ["three-exam-complete", "3-Exam Complete · early bird", "lower"],
    ["crash-course", "Crash Course", "upper"],
    ["complete-prelims-pack", "Complete Prelims Pack", "upper"],
    ["premium-test-series", "Premium Test Series", "upper"],
    ["uttarakhand-crash-course", "Uttarakhand Crash Course", "upper"],
    ["national-crash-course", "National Crash Course", "upper"],
  ];
  return show.flatMap(([slug, label, exam]) => {
    if (exam === "upper" && !upperOn) return [];
    const p = pkgs.find((x) => x.slug === slug);
    if (!p || !isListed(p)) return [];
    const info = getPriceInfo(p);
    // Only offers with a cut price running now (phase 38 / 47 / 47g).
    if (!info.isFounding || !info.regularPrice || info.regularPrice <= info.amount) return [];
    const href = slug === "revision-test-series" ? "/revision" : slug === "mock-mahasangram" ? "/mahasangram" : `/courses/${slug}`;
    return [{ label, price: formatINR(info.amount), was: formatINR(info.regularPrice), href }];
  });
}

/** Products in each exam menu (packages.metadata.exam_tab), in the store's own order; only those still on sale. */
function getNavMenus(pkgs: Package[]): NavMenus {
  const item = (p: Package) => ({
    href: productHref(p),
    label: p.slug === "mock-mahasangram" ? "All Uttarakhand Rank Challenge 2026" : p.package_name,
  });
  return {
    lower: examProducts(pkgs, "lower").map(item),
    tri: examProducts(pkgs, "tri").map(item),
    upper: examProducts(pkgs, "upper").map(item),
    individual: examProducts(pkgs, "individual").map(item),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [packages, offer, warmup] = await Promise.all([
    getActivePackages().catch(() => [] as Package[]),
    getActiveOffer().catch(() => null),
    getWarmupTest().catch(() => null),
  ]);
  const finalMonth = getFinalMonthItems(packages);
  const warmupOpen = !!warmup?.rank_until && Date.now() < parseUtcTimestamp(warmup.rank_until).getTime();

  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16.png" />
        <link rel="apple-touch-icon" href="/icons/icon-180.png" />
        <link rel="manifest" href="/manifest.json" />
        {/* Android app: it opens /app?source=app and sends an android-app:// referrer; the flag lives
            in sessionStorage (the app's own tab), so the normal browser never gets it. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              'try{var s=sessionStorage;if(/[?&]source=app\\b/.test(location.search)||document.referrer.indexOf("android-app://in.ukpscdecoded.app")===0)s.setItem("ukd-app","1");if(s.getItem("ukd-app")==="1")document.documentElement.setAttribute("data-app","")}catch(e){}',
          }}
        />
        {/* Site language: the visitor's saved choice, else Hindi when the phone is set to Hindi. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              'try{var l=localStorage.getItem("ukd-site-lang");if(!l&&/^hi/i.test(navigator.language||""))l="hi";if(l==="hi")document.documentElement.setAttribute("data-lang","hi")}catch(e){}',
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {offer && <OfferBar code={offer.code} percentOff={offer.percent_off} expiresAt={offer.expires_at} />}
        {!offer && finalMonth.length > 0 && <FinalMonthBar items={finalMonth} />}
        <Navbar menus={getNavMenus(packages)} />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <AppTabBar />
        {warmup && warmupOpen && (
          <FreeMockPopup testId={warmup.id} closesAt={warmup.rank_until!} totalQuestions={warmup.question_count || warmup.total_questions} />
        )}
        <WhatsAppButton />
        <InstallPrompt />
        <ServiceWorkerRegister />
        <ScrollUnlock />
        <Clarity />
      </body>
    </html>
  );
}
