import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PYQ Tracker — Previous Year Question Analysis",
  description:
    "Analyze UKPSC previous year question patterns from 2018-2023. Topic-wise weightage, trends, and frequency data for Paper V (Uttarakhand GK) and Paper VI (General Studies).",
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
