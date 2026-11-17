import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CourseCard from "@/components/CourseCard";
import { EXAM_BADGES } from "@/components/ExamCatalog";
import { EXAM_PAGES, examProducts } from "@/lib/catalog";
import { getActivePackages, type ExamTab } from "@/lib/packages";
import T from "@/components/T";

/**
 * One exam's page (/tri, /upper-pcs, /subject-packs): a short header, optional
 * notes, then every product listed for that exam (packages.metadata.exam_tab).
 * Products drop off by themselves after their sale_ends_at.
 */
export default async function ExamPage({
  tab,
  kicker,
  title,
  titleHi,
  intro,
  children,
}: {
  tab: ExamTab;
  kicker: string;
  title: string;
  titleHi?: string;
  intro: ReactNode;
  /** Shown between the header and the products. */
  children?: ReactNode;
}) {
  const products = examProducts(await getActivePackages(), tab);

  return (
    <div className="bg-graphite-950 px-4 py-12 sm:py-16">
      <div className="container-custom mx-auto space-y-10">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-saffron-400">{kicker}</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
            {titleHi ? <T en={title} hi={titleHi} /> : title}
          </h1>
          <div className="mx-auto mt-3 max-w-2xl text-sm text-graphite-300 sm:text-base">{intro}</div>
        </div>

        {children}

        {products.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {products.map((pkg) => (
              <CourseCard key={pkg.id} pkg={pkg} badge={pkg.slug ? EXAM_BADGES[pkg.slug] : undefined} />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-graphite-700 p-8 text-center text-sm text-graphite-300">
            New courses for this exam are coming soon.
          </p>
        )}

        <div className="flex flex-wrap justify-center gap-3 text-sm">
          {(Object.keys(EXAM_PAGES) as ExamTab[])
            .filter((t) => t !== tab)
            .map((t) => (
              <Link
                key={t}
                href={EXAM_PAGES[t].href}
                className="inline-flex items-center gap-1.5 rounded-full border border-graphite-700 px-4 py-2 text-graphite-200 hover:border-saffron-400 hover:text-saffron-300"
              >
                <T en={EXAM_PAGES[t].label} hi={EXAM_PAGES[t].hi} /> <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
