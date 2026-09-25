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
    <span className="inline-flex items-center gap-3 text-xs text-slate-300">
      <span>{test.question_ids.length} प्रश्न / Q</span>
      <span className="inline-flex items-center gap-1">
        <Clock className="h-3 w-3" /> {test.duration_minutes} min
      </span>
      <span>−¼ negative</span>
    </span>
  );

  if (compact) {
    return (
      <section className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 flex-shrink-0 text-yellow-500" />
            <div>
              <p className="font-semibold text-white">फ्री सैंपल टेस्ट / Free Sample Mock</p>
              {ready ? meta : <p className="text-xs text-slate-300">जल्द आ रहा है / Coming soon</p>}
            </div>
          </div>
          {ready && (
            <Link
              href={href}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-yellow-500 px-4 text-sm font-semibold text-slate-900 hover:bg-yellow-400"
            >
              फ्री में दें / Take it free <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="border-y border-slate-800 bg-slate-950 px-4 py-12">
      <div className="container-custom mx-auto text-center">
        <FileText className="mx-auto mb-3 h-8 w-8 text-yellow-500" />
        <h2 className="text-xl font-bold text-white">
          फ्री सैंपल टेस्ट <span className="text-slate-300">/ Free Sample Test</span>
        </h2>
        {ready ? (
          <>
            <p className="mx-auto mt-2 max-w-xl text-sm text-slate-300">
              UKPSC पैटर्न का 50 प्रश्नों का मॉक — हिंदी और अंग्रेज़ी दोनों में, पूरे विश्लेषण के साथ।
              <span className="block">A 50-question UKPSC-pattern mock in Hindi and English, with full answer review.</span>
            </p>
            <div className="mt-3">{meta}</div>
            <Link
              href={href}
              className="mt-5 inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-yellow-500 px-6 text-sm font-semibold text-slate-900 hover:bg-yellow-400"
            >
              फ्री टेस्ट शुरू करें / Start Free Test <ArrowRight className="h-4 w-4" />
            </Link>
          </>
        ) : (
          <p className="mt-2 text-sm text-slate-300">जल्द आ रहा है / Coming soon</p>
        )}
      </div>
    </section>
  );
}
