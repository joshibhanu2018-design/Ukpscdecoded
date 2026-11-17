import Link from "next/link";
import { unstable_cache } from "next/cache";
import { ArrowRight, Trophy } from "lucide-react";
import { getLiveTests, getRankList, isResultHidden } from "@/lib/liveMock";
import T from "@/components/T";

const SHOWN = 3;

/**
 * The top three names of the latest Rank Challenge mock whose result is out.
 * Names only: no scores, no count of students and no link to the full list
 * (the owner's choice). Shown after the products on the home page.
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
      top: rows.slice(0, SHOWN).map((r) => ({ rank: r.rank, name: r.name, district: r.district })),
    };
  },
  ["home-toppers-v2"],
  { revalidate: 600 }
);

export default async function HomeToppers() {
  const data = await latestToppers().catch(() => null);
  if (!data) return null;

  return (
    <section aria-labelledby="home-toppers" className="bg-graphite-950 px-4 pb-10 sm:pb-12">
      <div className="container-custom mx-auto rounded-2xl border border-saffron-400/40 bg-saffron-400/5 p-4 sm:p-6">
        <h2 id="home-toppers" className="flex items-center gap-2 font-display text-lg font-bold text-white sm:text-xl">
          <Trophy className="h-5 w-5 flex-shrink-0 text-saffron-400" />
          <T en={<>Our toppers · Rank Challenge Mock {data.mockNumber}</>} hi={<>हमारे टॉपर · रैंक चैलेंज मॉक {data.mockNumber}</>} />
        </h2>
        <ol className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {data.top.map((r, i) => (
            <li key={i} className="flex items-center gap-3 rounded-xl border border-graphite-800 bg-graphite-900 px-3 py-2.5">
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-saffron-400 font-display text-sm font-bold text-graphite-950">
                {r.rank}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-white">{r.name}</p>
                {r.district && <p className="truncate text-xs text-graphite-400">{r.district}</p>}
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-4">
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
