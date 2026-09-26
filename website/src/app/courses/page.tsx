import type { Metadata } from "next";
import CourseCard from "@/components/CourseCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getCatalog, MOST_POPULAR_SLUG } from "@/lib/catalog";
import SectionTitle from "@/components/SectionTitle";

export const metadata: Metadata = {
  title: "Courses",
  description: "UKPSC crash course, crash course + test series bundles and 1-on-1 mentorship with Bhanu Joshi.",
};

// Courses tab: the taught programmes — mentorship, the crash course and the
// bundles built around it. Test series alone live on /test-series.
export default async function CoursesPage() {
  const { mentorship, crashCourses, bundles, ownedIds } = await getCatalog();

  return (
    <div className="bg-graphite-950 px-4 py-12 sm:py-16">
      <div className="container-custom mx-auto space-y-16">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-saffron-400">UKPSC Decoded</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">Courses</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-graphite-300 sm:text-base">
            Crash course, bundles and 1-on-1 mentorship for UKPSC PCS, Lower PCS, RO/ARO and UKSSSC
          </p>
        </div>

        {crashCourses.length > 0 && (
          <section>
            <SectionTitle title="Crash Course" sub="Video lectures + live sessions + PDF notes" />
            <div className="grid grid-cols-1 gap-5">
              {crashCourses.map((pkg) => (
                <CourseCard key={pkg.id} pkg={pkg} wide owned={ownedIds.has(pkg.id)} />
              ))}
            </div>
          </section>
        )}

        {bundles.length > 0 && (
          <section>
            <SectionTitle title="Crash Course + Test Series Bundles" sub="Learn and practise together — save vs buying separately" />
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
            <SectionTitle title="Mentorship Program" sub="Weekly 1-on-1 guidance with Bhanu Joshi — everything included" />
            <div className="grid grid-cols-1 gap-5">
              {mentorship.map((pkg) => (
                <CourseCard key={pkg.id} pkg={pkg} wide owned={ownedIds.has(pkg.id)} />
              ))}
            </div>
          </section>
        )}

        <Link
          href="/test-series"
          className="flex items-center justify-between gap-3 rounded-2xl border border-graphite-800 bg-graphite-900/60 p-5 hover:border-saffron-400/50"
        >
          <span>
            <span className="block font-semibold text-white">Looking for test series only?</span>
            <span className="text-sm text-graphite-300">Premium, Basic, Uttarakhand, Current Affairs and CSAT test series</span>
          </span>
          <ArrowRight className="h-5 w-5 flex-shrink-0 text-saffron-400" />
        </Link>
      </div>
    </div>
  );
}
