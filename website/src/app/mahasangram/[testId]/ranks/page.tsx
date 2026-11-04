import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { ArrowLeft, Star } from "lucide-react";
import { getUserFromSession, SESSION_COOKIE_NAME } from "@/lib/auth-utils";
import { formatDuration } from "@/lib/tests";
import { formatIst, getLiveTest, getRankList, isResultHidden } from "@/lib/liveMock";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mock Mahasangram Rank List",
  robots: { index: false },
};

const PAGE = 100;

export default async function RankListPage({
  params,
  searchParams,
}: {
  params: Promise<{ testId: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { testId } = await params;
  const test = await getLiveTest(testId);
  if (!test) notFound();
  const user = await getUserFromSession((await cookies()).get(SESSION_COOKIE_NAME)?.value);

  const hidden = isResultHidden(test) && user?.role !== "admin";
  const rows = hidden ? [] : await getRankList(test);
  const mine = user ? rows.find((r) => r.userId === user.id) : undefined;
  const page = Math.max(1, Number((await searchParams).page) || 1);
  const pages = Math.max(1, Math.ceil(rows.length / PAGE));
  const shown = rows.slice((page - 1) * PAGE, page * PAGE);

  return (
    <div className="min-h-screen bg-graphite-950 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <Link href="/mahasangram" className="mb-6 inline-flex items-center gap-1.5 text-sm text-graphite-300 hover:text-saffron-400">
          <ArrowLeft className="h-4 w-4" /> Mock Mahasangram
        </Link>
        <h1 className="text-2xl font-bold text-white">{test.test_name}: rank list</h1>

        {hidden ? (
          <p className="mt-4 text-graphite-300">
            The rank list comes out on <span className="font-semibold text-saffron-300">{formatIst(test.result_at)}</span>.
          </p>
        ) : rows.length === 0 ? (
          <p className="mt-4 text-graphite-300">No ranked attempts yet.</p>
        ) : (
          <>
            <p className="mt-1 text-sm text-graphite-300">
              {rows.length} students ranked. Only each student&apos;s first attempt started during the live window counts.
            </p>
            {mine && (
              <p className="mt-4 rounded-xl border border-saffron-400/40 bg-saffron-400/5 p-4 text-white">
                Your rank: <span className="font-bold text-saffron-300">{mine.rank}</span> of {rows.length} · {mine.score} / {mine.totalMarks}
              </p>
            )}
            <div className="mt-4 overflow-hidden rounded-xl border border-graphite-800">
              {shown.map((r) => (
                <div
                  key={r.userId}
                  className={`flex items-center gap-3 border-b border-graphite-800 px-3 py-3 last:border-0 ${
                    r.userId === user?.id ? "bg-saffron-400/10" : ""
                  }`}
                >
                  <span className="w-10 shrink-0 text-right font-bold text-saffron-300">{r.rank}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-white">
                      {r.name}
                      {r.stars > 0 && (
                        <span className="ml-2 inline-flex align-middle" aria-label={`${r.stars} stars`}>
                          {Array.from({ length: r.stars }, (_, i) => (
                            <Star key={i} className="h-4 w-4 fill-saffron-400 text-saffron-400" />
                          ))}
                        </span>
                      )}
                    </p>
                    <p className="truncate text-xs text-graphite-400">{r.district ?? "—"}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-semibold text-white">{r.score}</p>
                    <p className="text-xs text-graphite-400">{formatDuration(r.timeTakenSeconds)}</p>
                  </div>
                </div>
              ))}
            </div>
            {pages > 1 && (
              <div className="mt-4 flex justify-between text-sm">
                {page > 1 ? <Link href={`?page=${page - 1}`} className="text-saffron-300">← Previous</Link> : <span />}
                <span className="text-graphite-400">Page {page} of {pages}</span>
                {page < pages ? <Link href={`?page=${page + 1}`} className="text-saffron-300">Next →</Link> : <span />}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
