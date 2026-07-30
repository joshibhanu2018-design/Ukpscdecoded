import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "UKPSC Decoded — Complete Uttarakhand Exam Preparation",
  description:
    "India's most comprehensive preparation platform for UKPSC PCS, Lower PCS, RO/ARO, UKSSSC & all Uttarakhand state examinations. Free videos, daily MCQs, PYQ tracker, and the complete guidebook.",
  keywords:
    "UKPSC, Uttarakhand GK, UKPSC preparation, Uttarakhand exam, Lower PCS, RO ARO, UKSSSC, Uttarakhand book, UKPSC Decoded",
  openGraph: {
    title: "UKPSC Decoded — Complete Uttarakhand Exam Preparation",
    description:
      "Free videos, daily MCQs, PYQ tracker, and India's only single-volume guidebook for all Uttarakhand state exams.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
