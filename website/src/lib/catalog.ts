import { cookies } from "next/headers";
import { unstable_noStore } from "next/cache";
import { getUserFromSession, SESSION_COOKIE_NAME } from "./auth-utils";
import {
  getActivePackages,
  getOwnedPackageIds,
  getPackageIncludes,
  getUserActiveEnrollments,
  type Package,
} from "./packages";

export const BEST_BUY_SLUG = "complete-prelims-pack";
export const FLAGSHIP_TEST_SERIES_SLUG = "premium-test-series";

/**
 * Store packages grouped for the Courses and Test Series pages, in the DB's
 * sort_order, plus what the visitor already owns.
 */
export async function getCatalog() {
  unstable_noStore();
  const user = await getUserFromSession((await cookies()).get(SESSION_COOKIE_NAME)?.value);
  const [allPackages, includes] = await Promise.all([getActivePackages(), getPackageIncludes()]);
  const enrollments = user ? await getUserActiveEnrollments(user.id) : [];
  const ownedIds = getOwnedPackageIds(enrollments, includes, allPackages);

  const listed = allPackages.filter((p) => p.slug);
  const byType = (type: string) => listed.filter((p) => p.package_type === type);
  const bestBuyFirst = (a: Package, b: Package) => Number(b.slug === BEST_BUY_SLUG) - Number(a.slug === BEST_BUY_SLUG);
  const testSeries: Package[] = byType("test_series").sort(
    (a, b) => Number(b.slug === FLAGSHIP_TEST_SERIES_SLUG) - Number(a.slug === FLAGSHIP_TEST_SERIES_SLUG),
  );

  return {
    mentorship: byType("mentorship"),
    crashCourses: byType("video_course"),
    bundles: byType("combo_bundle").sort(bestBuyFirst),
    testSeries,
    ownedIds,
  };
}
