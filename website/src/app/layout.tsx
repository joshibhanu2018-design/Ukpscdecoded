import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const siteUrl = "https://ukpscdecoded.vercel.app";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1a1a1f",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
