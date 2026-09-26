import { cookies } from "next/headers";
import type { Metadata } from "next";
import CourseCard from "@/components/CourseCard";
import { getActivePackages, getOwnedPackageIds, getPackageIncludes, getUserActiveEnrollments, type Package } from "@/lib/packages";
import { getUserFromSession, SESSION_COOKIE_NAME } from "@/lib/auth-utils";

export const metadata: Metadata = {
  title: "Courses",
  description: "UKPSC PCS, Lower PCS, RO/ARO & UKSSSC test series, crash course and mentorship — all courses at UKPSC Decoded.",
};

// The three main choices, side by side, in this order. Pinned by slug so
// they lead regardless of the DB's sort_order (which also governs
// admin/dashboard ordering elsewhere).
const PREMIUM_SLUGS = ["complete-prelims-pack", "premium-test-series", "prelims-mentorship"];
const MOST_POPULAR_SLUG = "complete-prelims-pack";

function SectionTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-6">
      <h2 className="font-display text-xl font-bold text-white sm:text-2xl">{title}</h2>
      {sub && <p className="mt-1 text-sm text-graphite-300">{sub}</p>}
    </div>
  );
}

export default async function CoursesPage() {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  const user = await getUserFromSession(token);

  const [allPackages, includes] = await Promise.all([getActivePackages(), getPackageIncludes()]);
  const enrollments = user ? await getUserActiveEnrollments(user.id) : [];
  const ownedIds = getOwnedPackageIds(enrollments, includes, allPackages);

  const premium = PREMIUM_SLUGS.map((slug) => allPackages.find((p) => p.slug === slug)).filter(
    (p): p is Package => Boolean(p)
  );
  const rest = allPackages.filter((p) => !PREMIUM_SLUGS.includes(p.slug ?? ""));
  const courses = rest.filter((p) => p.package_type === "video_course");
  // Everything else (smaller test series, any future pack) goes in the last section.
  const standalone = rest.filter((p) => p.package_type !== "video_course");

  return (
    <div className="bg-graphite-950 px-4 py-12 sm:py-16">
      <div className="container-custom mx-auto space-y-16">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-saffron-400">UKPSC Decoded</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">All Courses</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-graphite-300 sm:text-base">
            Complete preparation for UKPSC PCS, Lower PCS, RO/ARO and UKSSSC
          </p>
        </div>

        {premium.length > 0 && (
          <section>
            <SectionTitle
              title="Premium plans"
              sub="Pick one of three — each card's header says exactly what you get"
            />
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {premium.map((pkg) => (
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

        {courses.length > 0 && (
          <section>
            <SectionTitle title="Crash Course" sub="Video lectures + live sessions + PDF notes" />
            <div className="grid grid-cols-1 gap-5">
              {courses.map((pkg) => (
                <CourseCard key={pkg.id} pkg={pkg} wide owned={ownedIds.has(pkg.id)} />
              ))}
            </div>
          </section>
        )}

        {standalone.length > 0 && (
          <section>
            <SectionTitle
              title="Standalone test series"
              sub="Need just one part? All of these are also in the Premium Test Series"
            />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {standalone.map((pkg) => (
                <CourseCard key={pkg.id} pkg={pkg} size="sm" owned={ownedIds.has(pkg.id)} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
