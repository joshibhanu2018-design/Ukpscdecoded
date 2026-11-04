import { cookies } from "next/headers";
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
/** Last-month products: shown in "Which one is for me?" and on /revision, not in the lists. */
export const FINAL_MONTH_SLUGS = ["revision-test-series", "mock-mahasangram"];

/**
 * Store packages grouped for the Courses and Test Series pages, in the DB's
 * sort_order, plus what the visitor already owns.
 */
export async function getCatalog() {
  const user = await getUserFromSession((await cookies()).get(SESSION_COOKIE_NAME)?.value);
  const [allPackages, includes] = await Promise.all([getActivePackages(), getPackageIncludes()]);
  const enrollments = user ? await getUserActiveEnrollments(user.id) : [];
  const ownedIds = getOwnedPackageIds(enrollments, includes, allPackages);

  const listed = allPackages.filter((p) => p.slug);
  const byType = (type: string) => listed.filter((p) => p.package_type === type);
  const bestBuyFirst = (a: Package, b: Package) => Number(b.slug === BEST_BUY_SLUG) - Number(a.slug === BEST_BUY_SLUG);
  const testSeries: Package[] = byType("test_series").filter((p) => !FINAL_MONTH_SLUGS.includes(p.slug ?? "")).sort(
    (a, b) => Number(b.slug === FLAGSHIP_TEST_SERIES_SLUG) - Number(a.slug === FLAGSHIP_TEST_SERIES_SLUG),
  );

  return {
    mentorship: byType("mentorship"),
    crashCourses: byType("video_course"),
    bundles: byType("combo_bundle").sort(bestBuyFirst),
    testSeries,
    allPackages,
    ownedIds,
  };
}
