import type { Metadata } from "next";
import FreeSampleTest from "@/components/FreeSampleTest";
import ExamCatalog from "@/components/ExamCatalog";
import { getActivePackages } from "@/lib/packages";

export const metadata: Metadata = {
  alternates: { canonical: "/test-series" },
  title: "Test Series",
  description:
    "UKPSC test series for Lower PCS & RO/ARO, TRI and Upper PCS: full length tests on the real pattern, sectionals, Uttarakhand, current affairs and CSAT, with analysis after every test.",
};

// Test series (and the bundles that include tests), grouped by exam.
export default async function TestSeriesPage() {
  const allPackages = await getActivePackages();

  return (
    <div className="bg-graphite-950 px-4 py-12 sm:py-16">
      <div className="container-custom mx-auto space-y-12">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-saffron-400">UKPSC Decoded</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">Test Series</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-graphite-300 sm:text-base">
            Full length tests on the real pattern, sectionals, Uttarakhand, current affairs and CSAT, with analysis after every test
          </p>
        </div>

        <FreeSampleTest compact />

        <ExamCatalog packages={allPackages} types={["test_series", "combo_bundle"]} />
      </div>
    </div>
  );
}
