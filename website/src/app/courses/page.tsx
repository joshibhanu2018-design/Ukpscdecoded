import { cookies } from "next/headers";
import type { Metadata } from "next";
import CourseCard from "@/components/CourseCard";
import { getActivePackages, getOwnedPackageIds, getPackageIncludes, getUserActiveEnrollments } from "@/lib/packages";
import { getUserFromSession, SESSION_COOKIE_NAME } from "@/lib/auth-utils";

export const metadata: Metadata = {
  title: "Courses",
  description: "UKPSC PCS, Lower PCS, RO/ARO & UKSSSC test series, crash course and mentorship — all courses at UKPSC Decoded.",
};

// Store order pinned by slug so the featured combo/mentorship packages
// always lead regardless of the DB's sort_order (which also governs
// admin/dashboard ordering elsewhere).
const FEATURED_SLUG_ORDER = ["complete-prelims-pack", "prelims-mentorship", "premium-test-series", "crash-course"];

export default async function CoursesPage() {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  const user = await getUserFromSession(token);

  const [allPackages, includes] = await Promise.all([getActivePackages(), getPackageIncludes()]);
  const enrollments = user ? await getUserActiveEnrollments(user.id) : [];
  const ownedIds = getOwnedPackageIds(enrollments, includes, allPackages);

  const featured = FEATURED_SLUG_ORDER.map((slug) => allPackages.find((p) => p.slug === slug)).filter(
    (p): p is NonNullable<typeof p> => Boolean(p)
  );
  const rest = allPackages.filter((p) => !FEATURED_SLUG_ORDER.includes(p.slug ?? ""));
  const orderedPackages = [...featured, ...rest];

  return (
    <div className="bg-slate-950 px-4 py-10 sm:py-14">
      <div className="container-custom mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            सभी कोर्स <span className="text-slate-300">/ All Courses</span>
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            UKPSC PCS, Lower PCS, RO/ARO और UKSSSC की पूरी तैयारी / Complete preparation for every Uttarakhand exam
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {orderedPackages.map((pkg) => (
            <CourseCard
              key={pkg.id}
              pkg={pkg}
              mostPopular={pkg.slug === "complete-prelims-pack"}
              owned={ownedIds.has(pkg.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
