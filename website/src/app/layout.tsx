import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LeadPopup from "@/components/LeadPopup";
import InstallPrompt from "@/components/InstallPrompt";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import { getUserFromSession, SESSION_COOKIE_NAME } from "@/lib/auth-utils";

const siteUrl = "https://www.ukpscdecoded.in";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0f0f0e",
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
  appleWebApp: { capable: true, title: "UKPSC Decoded", statusBarStyle: "black-translucent" },
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
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "UKPSC Decoded — Crack Every Uttarakhand Exam From One Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UKPSC Decoded — Complete Uttarakhand Exam Preparation",
    description:
      "Free videos, daily MCQs, PYQ tracker, and India's only single-volume guidebook for all Uttarakhand state exams.",
    images: ["/og-image.png"],
    creator: "@ukpscdecoded",
  },
  alternates: {
    canonical: siteUrl,
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
  "@type": "EducationalOrganization",
  name: "UKPSC Decoded",
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  description:
    "India's most comprehensive preparation platform for all Uttarakhand state examinations.",
  sameAs: [
    "https://youtube.com/@ukpscdecoded",
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
};

async function getNavbarUser() {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  const user = await getUserFromSession(token);
  return user ? { fullName: user.full_name } : null;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navbarUser = await getNavbarUser();

  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16.png" />
        <link rel="apple-touch-icon" href="/icons/icon-180.png" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Navbar user={navbarUser} />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <LeadPopup />
        <InstallPrompt />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
