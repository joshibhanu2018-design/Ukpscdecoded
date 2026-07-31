import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Courses — Structured UKPSC Exam Preparation",
  description:
    "Expert-designed courses for UKPSC PCS, Lower PCS, and RO/ARO exams. Foundation batch, Uttarakhand GK intensive, test series with mentorship. Launching soon with early-bird pricing.",
  keywords: [
    "UKPSC online course",
    "UKPSC coaching",
    "Uttarakhand GK course",
    "UKPSC test series",
    "UKPSC mentorship",
    "Lower PCS course",
    "RO ARO preparation course",
  ],
  openGraph: {
    title: "UKPSC Exam Courses — Foundation, GK Intensive & Test Series | UKPSC Decoded",
    description:
      "Structured courses with 200+ video lectures, printed material, weekly tests, and personal mentorship for Uttarakhand state exams.",
    url: "/courses",
  },
  alternates: { canonical: "/courses" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
