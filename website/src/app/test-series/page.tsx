import type { Metadata } from "next";
import CourseCard from "@/components/CourseCard";
import FreeSampleTest from "@/components/FreeSampleTest";
import SectionTitle from "@/components/SectionTitle";
import { BEST_BUY_SLUG, FLAGSHIP_TEST_SERIES_SLUG, getCatalog } from "@/lib/catalog";

export const metadata: Metadata = {
  alternates: { canonical: "/test-series" },
  title: "Test Series",
  description:
    "UKPSC 2026 test series: Premium, Basic, Uttarakhand Intensive, Current Affairs and CSAT — plus crash course bundles and mentorship.",
};

// Test Series tab, in the order we recommend: the best-buy bundle, the
// Premium Test Series (includes every other test series), then the
// individual test series and mentorship.
export default async function TestSeriesPage() {
  const { testSeries, bundles, mentorship, ownedIds } = await getCatalog();
  const premium = testSeries.find((p) => p.slug === FLAGSHIP_TEST_SERIES_SLUG);
  const individual = testSeries.filter((p) => p !== premium);

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

        {bundles.length > 0 && (
          <section>
            <SectionTitle title="Best Buy: Test Series + Crash Course" sub="Everything for Prelims in one pack — practise and learn together, and save vs buying separately" />
            <div className="grid grid-cols-1 gap-5">
              {bundles.map((pkg) => (
                <CourseCard
                  key={pkg.id}
                  pkg={pkg}
                  size="lg"
                  wide
                  badge={pkg.slug === BEST_BUY_SLUG ? "Best Buy — our recommended pack" : undefined}
                  owned={ownedIds.has(pkg.id)}
                />
              ))}
            </div>
          </section>
        )}

        {premium && (
          <section>
            <SectionTitle title="Test Series Only" sub="Premium includes every test series on this page — no need to buy any other" />
            <CourseCard
              pkg={premium}
              size="lg"
              wide
              badge="Recommended — includes all test series"
              owned={ownedIds.has(premium.id)}
            />
          </section>
        )}

        <FreeSampleTest compact />

        {individual.length > 0 && (
          <section>
            <SectionTitle title="Individual Test Series" sub="Only if you need one part — all of these are already inside the Premium Test Series" />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {individual.map((pkg) => (
                <CourseCard key={pkg.id} pkg={pkg} owned={ownedIds.has(pkg.id)} />
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
