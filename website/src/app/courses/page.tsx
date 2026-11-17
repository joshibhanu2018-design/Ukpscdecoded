import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getActivePackages } from "@/lib/packages";
import ExamCatalog from "@/components/ExamCatalog";

export const metadata: Metadata = {
  alternates: { canonical: "/courses" },
  title: "Courses",
  description:
    "UKPSC Lower PCS & RO/ARO, TRI and Upper PCS courses and test series by Bhanu Joshi, plus CSAT, Uttarakhand GK and current affairs packs.",
};

// All courses, grouped by exam (packages.metadata.exam_tab). Each exam also has its own page.
export default async function CoursesPage() {
  const allPackages = await getActivePackages();

  return (
    <div className="bg-graphite-950 px-4 py-12 sm:py-16">
      <div className="container-custom mx-auto space-y-12">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-saffron-400">UKPSC Decoded</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">Courses</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-graphite-300 sm:text-base">
            Choose your exam: Lower PCS & RO/ARO, TRI or Upper PCS. Or take one part on its own.
          </p>
        </div>

        <ExamCatalog packages={allPackages} />

        <Link
          href="/test-series"
          className="flex items-center justify-between gap-3 rounded-2xl border border-graphite-800 bg-graphite-900/60 p-5 hover:border-saffron-400/50"
        >
          <span>
            <span className="block font-semibold text-white">Looking for test series only?</span>
            <span className="text-sm text-graphite-300">Every test series, by exam</span>
          </span>
          <ArrowRight className="h-5 w-5 flex-shrink-0 text-saffron-400" />
        </Link>
      </div>
    </div>
  );
}
