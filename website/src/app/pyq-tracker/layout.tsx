import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PYQ Tracker — UKPSC Previous Year Question Analysis + 60-Day Plan",
  description:
    "Cluster-wise UKPSC PYQ analysis (2016, 2021, 2024, 2025) for Uttarakhand & National topics with priority tags, plus a ready 60-day preparation plan. Filter and search by topic.",
  keywords: [
    "UKPSC PYQ",
    "UKPSC previous year questions",
    "UKPSC question paper analysis",
    "UKPSC topic wise questions",
    "UKPSC Paper V questions",
    "UKPSC Paper VI questions",
    "PYQ tracker UKPSC",
  ],
  openGraph: {
    title: "PYQ Tracker — UKPSC Previous Year Question Analysis | UKPSC Decoded",
    description:
      "Track topic-wise question distribution across 6 years of UKPSC papers. See which topics carry the most weight.",
    url: "/pyq-tracker",
  },
  alternates: { canonical: "/pyq-tracker" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
