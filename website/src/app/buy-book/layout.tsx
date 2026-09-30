import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buy Uttarakhand Decoded — The Complete Guidebook",
  description:
    "India's only single-volume guidebook for UKPSC PCS, Lower PCS, RO/ARO & UKSSSC exams. 28 chapters, 500+ pages covering complete Paper V & Paper VI syllabus. ₹499 with free shipping.",
  keywords: [
    "Uttarakhand Decoded book",
    "UKPSC book",
    "Uttarakhand GK book",
    "best book for UKPSC",
    "UKPSC guidebook",
    "Uttarakhand exam book",
    "UKPSC Decoded book buy",
    "Uttarakhand GK PDF",
    "UKPSC study material",
  ],
  openGraph: {
    title: "Uttarakhand Decoded — The Complete Guidebook | ₹499",
    description:
      "28 chapters. Paper V + Paper VI. 2026 Edition. The only book you need for all Uttarakhand state examinations. Free shipping across India.",
    url: "/buy-book",
  },
  alternates: { canonical: "/buy-book" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
