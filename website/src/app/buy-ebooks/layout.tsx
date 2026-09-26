import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Polity Decoded e-Book — Indian Polity for UKPSC, UPPSC & UPSC",
  description:
    "Polity Decoded: a visual Indian Polity e-book built from PYQs for UKPSC, UPPSC and UPSC Prelims & Mains. Instant PDF download for ₹59.",
  alternates: { canonical: "/buy-ebooks" },
  openGraph: {
    title: "Polity Decoded e-Book — ₹59",
    description: "Visual Indian Polity e-book for PCS Prelims & Mains, built from PYQs. Instant PDF download.",
    url: "/buy-ebooks",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
