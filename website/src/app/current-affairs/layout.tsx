import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Weekly Current Affairs & Daily PYQ Quiz",
  description:
    "Weekly current affairs digest for UKPSC exams (Uttarakhand, National, International) with 40 headline points, plus daily 5 PYQ quiz questions fetched live from our Google Sheet.",
  keywords: [
    "UKPSC current affairs",
    "Uttarakhand current affairs 2026",
    "UKPSC daily quiz",
    "UKPSC MCQ",
    "PYQ quiz UKPSC",
    "Uttarakhand weekly digest",
    "UKPSC preparation MCQ",
  ],
  openGraph: {
    title: "Weekly Current Affairs & Daily PYQ Quiz | UKPSC Decoded",
    description:
      "40 headline news points with UKPSC/UPSC Mains-oriented analysis. Daily 5 PYQ quiz live from Google Sheets.",
    url: "/current-affairs",
  },
  alternates: { canonical: "/current-affairs" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
