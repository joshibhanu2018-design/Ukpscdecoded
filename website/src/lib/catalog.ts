import { examTab, getActivePackages, isListed, type ExamTab, type Package } from "./packages";

/** The Lower PCS + RO/ARO bundle: the main product from Nov 2026 (schema-phase47). */
export const LOWER_COMPLETE_SLUG = "lower-pcs-complete";
export const THREE_EXAM_SLUG = "three-exam-complete";
/** The Lower PCS 2025 actual paper as a free timed test (filled by the owner's SQL, see HANDOFF). */
export const PAPER_2025_TEST_ID = "ee7a47b0-69d0-4e50-b611-9b343f6d5834";

/** Exam pages: where each exam_tab is sold, and how it is named. */
export const EXAM_PAGES: Record<ExamTab, { href: string; label: string; hi: string; sub: string }> = {
  lower: {
    href: "/lower-pcs",
    label: "Lower PCS & RO/ARO",
    hi: "लोअर PCS और RO/ARO",
    sub: "UKPSC Lower PCS (27 Dec 2026) and RO/ARO Prelims (April 2027): same syllabus, one course",
  },
  tri: {
    href: "/tri",
    label: "TRI",
    hi: "TRI",
    sub: "Tax & Revenue Inspector (15 Jan 2027): the extra GS topics on top of the Lower PCS course",
  },
  upper: {
    href: "/upper-pcs",
    label: "Upper PCS",
    hi: "अपर PCS",
    sub: "UKPSC Upper PCS Prelims: test series, revision and full courses",
  },
  // exam_tab "individual" in the database, shown as "Solo Packs".
  individual: {
    href: "/solo-packs",
    label: "Solo Packs",
    hi: "सोलो पैक",
    sub: "One part only: Uttarakhand GK, CSAT or Current Affairs tests (or videos), for any UKPSC exam",
  },
};

/** The page a product's links point to: the last-month products have pages of their own. */
export function productHref(p: Pick<Package, "slug">): string {
  return p.slug === "revision-test-series" ? "/revision" : p.slug === "mock-mahasangram" ? "/mahasangram" : `/courses/${p.slug}`;
}

/** Listed products of one exam page, in the store's sort_order. */
export function examProducts(all: Package[], tab: ExamTab): Package[] {
  return all.filter((p) => isListed(p) && examTab(p) === tab);
}

export async function getExamProducts(tab: ExamTab): Promise<{ products: Package[]; allPackages: Package[] }> {
  const allPackages = await getActivePackages();
  return { products: examProducts(allPackages, tab), allPackages };
}
