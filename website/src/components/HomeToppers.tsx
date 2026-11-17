import Link from "next/link";
import { unstable_cache } from "next/cache";
import { ArrowRight, Trophy } from "lucide-react";
import { getLiveTests, getRankList, isResultHidden } from "@/lib/liveMock";
import T from "@/components/T";

const SHOWN = 5;

/**
 * The latest Rank Challenge mock whose result is out, with its top ranks.
 * The same names and districts are already public on the rank list page.
 * Cached for 10 minutes so the home page does not re-read every attempt.
 */
const latestToppers = unstable_cache(
  async () => {
    const tests = await getLiveTests();
    const published = tests.filter((t) => !!t.result_at && !isResultHidden(t));
    const latest = published[published.length - 1];
    if (!latest) return null;
    const rows = await getRankList(latest);
    if (rows.length < SHOWN) return null;
    return {
      testId: latest.id,
      mockNumber: tests.indexOf(latest) + 1,
      total: rows.length,
      top: rows.slice(0, SHOWN).map((r) => ({ rank: r.rank, name: r.name, district: r.district, score: r.score, totalMarks: r.totalMarks })),
    };
  },
  ["home-toppers"],
  { revalidate: 600 }
);

export default async function HomeToppers() {
  const data = await latestToppers().catch(() => null);
  if (!data) return null;

  return (
    <section aria-labelledby="home-toppers" className="bg-graphite-950 px-4 pt-6 sm:pt-8">
      <div className="container-custom mx-auto rounded-2xl border border-saffron-400/40 bg-saffron-400/5 p-4 sm:p-6">
        <h2 id="home-toppers" className="flex items-center gap-2 font-display text-lg font-bold text-white sm:text-xl">
          <Trophy className="h-5 w-5 flex-shrink-0 text-saffron-400" />
          <T
            en={<>Rank Challenge Mock {data.mockNumber}: top {SHOWN} of {data.total} students</>}
            hi={<>रैंक चैलेंज मॉक {data.mockNumber}: {data.total} छात्रों में टॉप {SHOWN}</>}
          />
        </h2>
        <ol className="mt-3 divide-y divide-graphite-800 rounded-xl border border-graphite-800 bg-graphite-900">
          {data.top.map((r, i) => (
            <li key={i} className="flex items-center gap-3 px-3 py-2.5">
              <span className="w-7 flex-shrink-0 text-right font-display font-bold text-saffron-300">{r.rank}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-white">{r.name}</p>
                <p className="truncate text-xs text-graphite-400">{r.district ?? "—"}</p>
              </div>
              <span className="flex-shrink-0 text-sm font-semibold text-white">
                {r.score} / {r.totalMarks}
              </span>
            </li>
          ))}
        </ol>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <Link href={`/mahasangram/${data.testId}/ranks`} className="text-sm font-semibold text-saffron-300 hover:underline">
            <T en="See the full rank list" hi="पूरी रैंक लिस्ट देखें" />
          </Link>
          <Link
            href="/mahasangram"
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-saffron-400 px-4 text-sm font-bold text-graphite-950 hover:bg-saffron-300"
          >
            <T en="Where do you stand? Join the next mock" hi="आपकी रैंक क्या होगी? अगला मॉक दें" /> <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
