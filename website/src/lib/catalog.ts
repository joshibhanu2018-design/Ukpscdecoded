import { getActivePackages, type Package } from "./packages";

export const BEST_BUY_SLUG = "complete-prelims-pack";
export const FLAGSHIP_TEST_SERIES_SLUG = "premium-test-series";
/** Last-month products: shown in "Which one is for me?" and on /revision, not in the lists. */
export const FINAL_MONTH_SLUGS = ["revision-test-series", "mock-mahasangram"];

/**
 * Store packages grouped for the Courses and Test Series pages, in the DB's
 * sort_order. It reads no login cookie, so these pages are cached; what
 * the visitor already owns is filled in by the browser on each card.
 */
export async function getCatalog() {
  const allPackages = await getActivePackages();

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
  };
}
