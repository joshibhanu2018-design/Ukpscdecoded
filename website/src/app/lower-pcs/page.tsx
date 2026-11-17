import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, FileText, Sparkles } from "lucide-react";
import CourseCard from "@/components/CourseCard";
import { EXAM_BADGES } from "@/components/ExamCatalog";
import { LOWER_COMPLETE_SLUG, examProducts } from "@/lib/catalog";
import { getActivePackages } from "@/lib/packages";
import { getTest } from "@/lib/tests";
import T from "@/components/T";

export const metadata: Metadata = {
  alternates: { canonical: "/lower-pcs" },
  title: "Lower PCS & RO/ARO 2026-27",
  description:
    "UKPSC Lower PCS (27 Dec 2026) and RO/ARO Prelims (April 2027), same syllabus: crash course with PDF notes, 81-test series with 10 full length tests and 12 CSAT sectionals.",
};

/** The Lower PCS 2025 paper as a free timed test (placeholder in schema-phase47 until its questions are loaded). */
const PAPER_2025_TEST_ID = "ee7a47b0-69d0-4e50-b611-9b343f6d5834";

export default async function LowerPcsPage() {
  const [all, paper] = await Promise.all([getActivePackages(), getTest(PAPER_2025_TEST_ID).catch(() => null)]);
  const products = examProducts(all, "lower");
  const complete = products.find((p) => p.slug === LOWER_COMPLETE_SLUG);
  const others = products.filter((p) => p !== complete);
  const paperReady = !!paper && paper.question_ids.length > 0;

  return (
    <div className="bg-graphite-950 px-4 py-12 sm:py-16">
      <div className="container-custom mx-auto space-y-10">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-saffron-400">UKPSC Lower PCS 2026 · RO/ARO 2027</p>
          <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">Lower PCS &amp; RO/ARO</h1>
          <p className="mt-2 font-display text-xl font-semibold text-saffron-300 sm:text-2xl">एक course, दो exams</p>
          <div className="mx-auto mt-4 flex max-w-2xl flex-col items-center gap-2 text-sm text-graphite-200 sm:flex-row sm:justify-center sm:gap-5">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4 text-saffron-400" /> Lower PCS Prelims: Sun 27 Dec 2026
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4 text-saffron-400" /> RO/ARO Prelims: April 2027
            </span>
          </div>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-graphite-300">
            <T
              en="RO/ARO Prelims has the same pattern and syllabus as Lower PCS: 150 questions in 2 hours, 100 General Studies + 50 General Aptitude. Everything here stays valid till 30 April 2027, so one course covers both."
              hi="RO/ARO प्रीलिम्स का पैटर्न और सिलेबस लोअर PCS जैसा ही है: 2 घंटे में 150 प्रश्न, 100 सामान्य अध्ययन + 50 सामान्य बुद्धि। यहाँ सब कुछ 30 अप्रैल 2027 तक मान्य है, इसलिए एक कोर्स से दोनों परीक्षाएँ।"
            />
          </p>
        </div>

        {complete && (
          <CourseCard pkg={complete} size="lg" wide badge={EXAM_BADGES[LOWER_COMPLETE_SLUG]} />
        )}

        {others.length > 0 && (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {others.map((pkg) => (
              <CourseCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        )}

        {products.length === 0 && (
          <p className="rounded-2xl border border-dashed border-graphite-700 p-8 text-center text-sm text-graphite-300">
            The Lower PCS courses are being set up. Please check again in a few minutes.
          </p>
        )}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <section className="rounded-2xl border border-saffron-400/30 bg-saffron-400/5 p-5">
            <p className="flex items-center gap-2 font-semibold text-white">
              <FileText className="h-5 w-5 text-saffron-400" /> Lower PCS 2025 actual paper, as a timed test
            </p>
            <p className="mt-1.5 text-sm text-graphite-300">
              150 questions, 2 hours, on the real exam pattern. Free for every registered student.
            </p>
            {paperReady ? (
              <Link
                href={`/test-platform/tests/${PAPER_2025_TEST_ID}`}
                className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-saffron-400 px-4 py-2 text-sm font-bold text-graphite-900 hover:bg-saffron-300"
              >
                Attempt free <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <p className="mt-3 inline-block rounded-full bg-saffron-400/10 px-3 py-1 text-xs font-semibold text-saffron-300">Coming soon</p>
            )}
          </section>

          <section className="web-only rounded-2xl border border-graphite-800 bg-graphite-900/60 p-5">
            <p className="flex items-center gap-2 font-semibold text-white">
              <Sparkles className="h-5 w-5 text-saffron-400" /> Already bought an Upper PCS course?
            </p>
            <p className="mt-1.5 text-sm text-graphite-300">
              If you have the Upper PCS Crash Course, Premium Test Series or Complete Prelims Pack, you already have the GS videos and
              most tests. Add only:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-graphite-200">
              <li>
                <Link href="/courses/lower-pcs-csat" className="text-saffron-300 underline underline-offset-2">
                  CSAT for Lower PCS / RO-ARO
                </Link>{" "}
                at ₹499 for you (the price shows at checkout when you are logged in)
              </li>
              <li>
                <Link href="/courses/tri-addon" className="text-saffron-300 underline underline-offset-2">
                  TRI Add-on
                </Link>{" "}
                (₹599) if you are also writing TRI
              </li>
            </ul>
          </section>
        </div>

        <Link
          href="/tri"
          className="flex items-center justify-between gap-3 rounded-2xl border border-graphite-800 bg-graphite-900/60 p-5 hover:border-saffron-400/50"
        >
          <span>
            <span className="block font-semibold text-white">Also writing TRI on 15 January 2027?</span>
            <span className="text-sm text-graphite-300">The 3-Exam Complete adds the TRI-only GS topics and 3 TRI pattern mocks.</span>
          </span>
          <ArrowRight className="h-5 w-5 flex-shrink-0 text-saffron-400" />
        </Link>
      </div>
    </div>
  );
}
