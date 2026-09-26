import Link from "next/link";
import { ArrowRight, Clock, FileText } from "lucide-react";
import { FREE_SAMPLE_TEST_ID, getTest } from "@/lib/tests";

/**
 * The Free Sample Mock (seeded by schema-phase14-bank-browser.sql, filled by
 * the loader): open to every logged-in student. Shows "Coming soon" until the
 * test has questions. `compact` is the course-page variant.
 */
export default async function FreeSampleTest({ compact = false }: { compact?: boolean }) {
  const test = await getTest(FREE_SAMPLE_TEST_ID).catch(() => null);
  const ready = !!test && test.is_free_test && test.question_ids.length > 0;
  const href = `/test-platform/tests/${FREE_SAMPLE_TEST_ID}`;
  const meta = ready && (
    <span className="inline-flex items-center gap-3 text-xs text-graphite-300">
      <span>{test.question_ids.length} questions</span>
      <span className="inline-flex items-center gap-1">
        <Clock className="h-3 w-3" /> {test.duration_minutes} min
      </span>
      <span>−¼ negative</span>
    </span>
  );

  if (compact) {
    return (
      <section className="rounded-xl border border-saffron-400/30 bg-saffron-400/5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 flex-shrink-0 text-saffron-400" />
            <div>
              <p className="font-semibold text-white">Free Sample Mock</p>
              {ready ? meta : <p className="text-xs text-graphite-300">Coming soon</p>}
            </div>
          </div>
          {ready && (
            <Link
              href={href}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-saffron-400 px-4 text-sm font-semibold text-graphite-900 hover:bg-saffron-300"
            >
              Take it free <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="border-y border-graphite-800 bg-graphite-950 px-4 py-12">
      <div className="container-custom mx-auto text-center">
        <FileText className="mx-auto mb-3 h-8 w-8 text-saffron-400" />
        <h2 className="text-xl font-bold text-white">
          Free Sample Test
        </h2>
        {ready ? (
          <>
            <p className="mx-auto mt-2 max-w-xl text-sm text-graphite-300">
              A 50-question UKPSC-pattern mock in Hindi and English, with full answer review.
            </p>
            <div className="mt-3">{meta}</div>
            <Link
              href={href}
              className="mt-5 inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-saffron-400 px-6 text-sm font-semibold text-graphite-900 hover:bg-saffron-300"
            >
              Start Free Test <ArrowRight className="h-4 w-4" />
            </Link>
          </>
        ) : (
          <p className="mt-2 text-sm text-graphite-300">Coming soon</p>
        )}
      </div>
    </section>
  );
}
