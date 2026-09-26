import type { Metadata } from "next";
import CourseCard from "@/components/CourseCard";
import FreeSampleTest from "@/components/FreeSampleTest";
import SectionTitle from "@/components/SectionTitle";
import { getCatalog, MOST_POPULAR_SLUG } from "@/lib/catalog";

export const metadata: Metadata = {
  alternates: { canonical: "/test-series" },
  title: "Test Series",
  description:
    "UKPSC 2026 test series: Premium, Basic, Uttarakhand Intensive, Current Affairs and CSAT — plus crash course bundles and mentorship.",
};

// Test Series tab: every test series, then the bundles and mentorship that include one.
export default async function TestSeriesPage() {
  const { testSeries, bundles, mentorship, ownedIds } = await getCatalog();

  return (
    <div className="bg-graphite-950 px-4 py-12 sm:py-16">
      <div className="container-custom mx-auto space-y-16">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-saffron-400">UKPSC Decoded</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">Test Series</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-graphite-300 sm:text-base">
            Full mocks, sectional, Uttarakhand, Current Affairs and CSAT tests with analysis after every test
          </p>
        </div>

        <FreeSampleTest compact />

        {testSeries.length > 0 && (
          <section>
            <SectionTitle title="All Test Series" sub="The Premium Test Series includes every other test series below" />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {testSeries.map((pkg) => (
                <CourseCard key={pkg.id} pkg={pkg} size={pkg.slug === "premium-test-series" ? "lg" : "md"} owned={ownedIds.has(pkg.id)} />
              ))}
            </div>
          </section>
        )}

        {bundles.length > 0 && (
          <section>
            <SectionTitle title="Test Series + Crash Course Bundles" sub="Practise and learn together — save vs buying separately" />
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {bundles.map((pkg) => (
                <CourseCard
                  key={pkg.id}
                  pkg={pkg}
                  size="lg"
                  mostPopular={pkg.slug === MOST_POPULAR_SLUG}
                  owned={ownedIds.has(pkg.id)}
                />
              ))}
            </div>
          </section>
        )}

        {mentorship.length > 0 && (
          <section>
            <SectionTitle title="Mentorship Program" sub="Everything above + weekly 1-on-1 guidance with Bhanu Joshi" />
            <div className="grid grid-cols-1 gap-5">
              {mentorship.map((pkg) => (
                <CourseCard key={pkg.id} pkg={pkg} wide owned={ownedIds.has(pkg.id)} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
