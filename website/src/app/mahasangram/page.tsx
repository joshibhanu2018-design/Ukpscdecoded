import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { ArrowRight, Clock, Star, Trophy } from "lucide-react";
import { getUserFromSession, SESSION_COOKIE_NAME } from "@/lib/auth-utils";
import { supabaseAdmin } from "@/lib/supabase";
import { formatIst, getLiveTests, isResultHidden, LIVE_SERIES_NAME } from "@/lib/liveMock";
import JoinForm from "./JoinForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: { canonical: "/mahasangram" },
  title: "Mock Mahasangram - UKPSC Prelims Rank Challenge",
  description:
    "Free UKPSC Prelims 2026 full-length mock with a live rank list across Uttarakhand. 6 mocks, same test same day, results at 8 pm.",
};

export default async function MahasangramPage() {
  const user = await getUserFromSession((await cookies()).get(SESSION_COOKIE_NAME)?.value);
  const tests = await getLiveTests();
  const free = tests.find((t) => t.is_free_test);

  let hasDistrict = false;
  if (user) {
    const { data } = await supabaseAdmin().from("users").select("district").eq("id", user.id).maybeSingle();
    hasDistrict = !!data?.district;
  }

  return (
    <div className="bg-graphite-950 px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-4xl space-y-10">
        <div className="text-center">
          <Trophy className="mx-auto h-10 w-10 text-saffron-400" />
          <h1 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">{LIVE_SERIES_NAME}</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-graphite-300 sm:text-base">
            6 full-length mocks before the 29 Nov exam. Everyone writes the same mock on the same day, and at 8 pm the
            rank list for the whole of Uttarakhand goes live. <span className="font-semibold text-saffron-300">Mock 1 is free for everyone.</span>
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { icon: <Clock className="h-5 w-5" />, title: "12 noon to 6 pm", text: "Start any time in this window on the mock day. 150 questions, 2 hours." },
            { icon: <Trophy className="h-5 w-5" />, title: "Result at 8 pm", text: "Score, solutions and the live rank list (name and district) come out together." },
            { icon: <Star className="h-5 w-5" />, title: "Stars for the top 20", text: "Top 3 also win 30% off the crash course or a test series." },
          ].map((c) => (
            <div key={c.title} className="rounded-xl border border-graphite-800 bg-graphite-900/60 p-4">
              <div className="text-saffron-400">{c.icon}</div>
              <p className="mt-2 font-semibold text-white">{c.title}</p>
              <p className="mt-1 text-sm text-graphite-300">{c.text}</p>
            </div>
          ))}
        </div>

        {free && (
          <div className="rounded-2xl border border-saffron-400/40 bg-graphite-900 p-5 sm:p-6">
            <h2 className="text-xl font-bold text-white">Free Mock 1: {formatIst(free.release_at)}</h2>
            <p className="mt-1 text-sm text-graphite-300">Sign up once; on the day, the mock opens at 12 noon.</p>
            <div className="mt-4 max-w-md">
              {user && hasDistrict ? (
                <Link
                  href={`/test-platform/tests/${free.id}`}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-saffron-400 px-5 text-sm font-bold text-graphite-900 hover:bg-saffron-300"
                >
                  You&apos;re in. Go to Mock 1 <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <JoinForm freeTestId={free.id} loggedIn={!!user} />
              )}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-xl font-bold text-white">Schedule</h2>
          <div className="mt-3 overflow-hidden rounded-xl border border-graphite-800">
            {tests.length === 0 && <p className="p-4 text-sm text-graphite-300">Dates coming soon.</p>}
            {tests.map((t, i) => {
              const published = !!t.result_at && !isResultHidden(t);
              return (
                <div key={t.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-graphite-800 p-4 last:border-0">
                  <div>
                    <p className="font-semibold text-white">
                      <Link href={`/test-platform/tests/${t.id}`} className="hover:text-saffron-300">Mock {i + 1}</Link>{" "}
                      <span className="text-xs font-normal text-graphite-400">({t.test_name})</span>{" "}
                      {t.is_free_test && <span className="ml-1 rounded bg-success-500/20 px-2 py-0.5 text-xs text-success-400">FREE</span>}
                    </p>
                    <p className="text-xs text-graphite-400">
                      Opens {formatIst(t.release_at)} · result {formatIst(t.result_at)}
                    </p>
                  </div>
                  <Link href={`/mahasangram/${t.id}/ranks`} className="text-sm font-semibold text-saffron-300 hover:underline">
                    {published ? "Rank list" : "Rank list at 8 pm"}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-graphite-800 bg-graphite-900/60 p-5 text-sm text-graphite-300 sm:p-6">
          <p className="font-semibold text-white">Mocks 2 to 6</p>
          <p className="mt-1">
            Mock Mahasangram (all 6 mocks): ₹400. Revision Test Series (6 mocks + 6 Current Affairs + 8 Uttarakhand + 2
            CSAT tests): ₹999, or ₹500 if you already bought any course or test series from us. Premium Test Series and
            Complete Prelims Pack students already have every mock in their dashboard.
          </p>
          <Link href="/test-series" className="mt-3 inline-flex items-center gap-1 font-semibold text-saffron-300 hover:underline">
            See the test series <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
