import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CourseCard from "@/components/CourseCard";
import SectionTitle from "@/components/SectionTitle";
import { EXAM_PAGES, LOWER_COMPLETE_SLUG, THREE_EXAM_SLUG, examProducts } from "@/lib/catalog";
import { EXAM_TABS, type ExamTab, type Package } from "@/lib/packages";

const BADGES: Record<string, string> = {
  [LOWER_COMPLETE_SLUG]: "Best value: one course, two exams",
  [THREE_EXAM_SLUG]: "Lower PCS + RO/ARO + TRI in one",
};

/** Every exam's products under its own heading (Courses / Test Series pages). `types` limits the package types shown. */
export default function ExamCatalog({ packages, types }: { packages: Package[]; types?: string[] }) {
  return (
    <div className="space-y-14">
      {EXAM_TABS.map((tab: ExamTab) => {
        const products = examProducts(packages, tab).filter((p) => !types || types.includes(p.package_type));
        if (!products.length) return null;
        const page = EXAM_PAGES[tab];
        return (
          <section key={tab}>
            <SectionTitle title={page.label} sub={page.sub} />
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {products.map((pkg) => (
                <CourseCard key={pkg.id} pkg={pkg} badge={pkg.slug ? BADGES[pkg.slug] : undefined} />
              ))}
            </div>
            <Link href={page.href} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-saffron-300 hover:text-saffron-200">
              {page.label} page <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        );
      })}
    </div>
  );
}

export { BADGES as EXAM_BADGES };
