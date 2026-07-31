import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Video Lectures — UKPSC & Uttarakhand GK",
  description:
    "Watch free chapter-wise video lectures covering Uttarakhand history, geography, polity, economy, current affairs and PYQ analysis for UKPSC, Lower PCS, RO/ARO exams.",
  keywords: [
    "UKPSC free videos",
    "Uttarakhand GK videos",
    "UKPSC preparation videos",
    "free UKPSC coaching",
    "Uttarakhand history video",
    "UKPSC YouTube",
  ],
  openGraph: {
    title: "Free Video Lectures — UKPSC & Uttarakhand GK | UKPSC Decoded",
    description:
      "Chapter-wise free video lectures for all Uttarakhand state exams. Watch on YouTube or browse by category.",
    url: "/free-content",
  },
  alternates: { canonical: "/free-content" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
