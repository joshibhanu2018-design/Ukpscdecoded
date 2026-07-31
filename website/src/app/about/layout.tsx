import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About UKPSC Decoded — Our Mission & Team",
  description:
    "Built by aspirants, for aspirants. Making quality Uttarakhand exam preparation accessible to every student regardless of geography or budget. 2000+ YouTube subscribers, 28 chapters written.",
  keywords: [
    "UKPSC Decoded about",
    "UKPSC Decoded contact",
    "UKPSC Decoded YouTube",
    "UKPSC preparation platform",
    "Uttarakhand exam coaching",
  ],
  openGraph: {
    title: "About UKPSC Decoded — Our Mission & Journey",
    description:
      "From a YouTube channel to India's most comprehensive Uttarakhand exam platform. Our mission, impact, and how to connect with us.",
    url: "/about",
  },
  alternates: { canonical: "/about" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
