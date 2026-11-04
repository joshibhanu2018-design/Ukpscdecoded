import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { ArrowLeft, ArrowRight, Clock, Download, Star, Trophy } from "lucide-react";
import BuyBox from "@/components/final-month/BuyBox";
import Timetable from "@/components/final-month/Timetable";
import { FINAL_SCHEDULE, getFinalMonthState, MAHASANGRAM_SLUG, REVISION_SLUG } from "@/lib/finalMonth";
import { formatINR } from "@/lib/format";
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

  const state = await getFinalMonthState(user?.id ?? null);
  const maha = state[MAHASANGRAM_SLUG];
  const revision = state[REVISION_SLUG];
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  const mockDates = FINAL_SCHEDULE.filter((t) => t.kind === "mock");

  let hasDistrict = false;
  if (user) {
    const { data } = await supabaseAdmin().from("users").select("district").eq("id", user.id).maybeSingle();
    hasDistrict = !!data?.district;
  }

  return (
    <div className="bg-graphite-950 px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-4xl space-y-10">
        <Link href="/revision" className="inline-flex items-center gap-1.5 text-sm text-graphite-300 hover:text-saffron-400">
          <ArrowLeft className="h-4 w-4" /> Final Revision Test Series
        </Link>
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

        <div className="grid gap-4 md:grid-cols-2">
          {free && (
            <div className="rounded-2xl border border-jade-500/40 bg-jade-500/5 p-5 sm:p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-jade-400">Step 1 · Free</p>
              <h2 className="mt-1 font-display text-xl font-bold text-white">Mock 1: Thu 12 Nov</h2>
              <p className="mt-1 text-sm text-graphite-300">Sign up once. On the day the mock opens at 12 noon.</p>
              <div className="mt-4">
                {user && hasDistrict ? (
                  <Link
                    href={`/test-platform/tests/${free.id}`}
                    className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-jade-500 px-5 text-sm font-bold text-graphite-950 hover:bg-jade-400"
                  >
                    You&apos;re in. Go to Mock 1 <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <JoinForm freeTestId={free.id} loggedIn={!!user} />
                )}
              </div>
            </div>
          )}
          <div className="rounded-2xl border border-saffron-400/50 bg-graphite-900 p-5 sm:p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-saffron-400">Step 2 · All 6 mocks</p>
            <h2 className="mt-1 font-display text-xl font-bold text-white">Mock Mahasangram</h2>
            <p className="mt-1 text-sm text-graphite-300">
              6 full mocks (150 Q each) with live ranks. Different tests from the Basic Test Series.
            </p>
            <div className="mt-4">
              <BuyBox
                state={maha}
                buyLabel="Join Mahasangram"
                loggedIn={!!user}
                includedNote="Included with your Premium Test Series / Complete Prelims Pack."
              />
            </div>
            <a
              href="/uploads/final-month-timetable.pdf"
              download
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-saffron-300 hover:underline"
            >
              <Download className="h-4 w-4" /> Timetable (PDF)
            </a>
          </div>
        </div>

        <div>
          <h2 className="font-display text-2xl font-bold text-white">Mock dates</h2>
          <p className="mt-1 text-sm text-graphite-300">Each day: start between 12 noon and 6 pm, ranks and solutions at 8 pm.</p>
          <div className="mt-4">
            <Timetable items={mockDates} today={today} />
          </div>
          {tests.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {tests.map((t, i) => {
                const published = !!t.result_at && !isResultHidden(t);
                return published ? (
                  <Link key={t.id} href={`/mahasangram/${t.id}/ranks`} className="rounded-full border border-saffron-400/50 px-3 py-1.5 text-xs font-semibold text-saffron-300 hover:bg-saffron-400/10">
                    Mock {i + 1} rank list
                  </Link>
                ) : null;
              })}
            </div>
          )}
        </div>

        {!revision.owned && (
          <div className="rounded-2xl border border-saffron-400/40 bg-saffron-400/5 p-5 sm:p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-saffron-400">Step 3 · Full revision</p>
            <h2 className="mt-1 font-display text-xl font-bold text-white">Add Uttarakhand GK + Current Affairs</h2>
            <p className="mt-1 text-sm text-graphite-300">
              The Revision Test Series has these 6 mocks plus complete Uttarakhand GK (8 tests, 800 Q), complete Current
              Affairs (6 tests, 600 Q) and 2 CSAT tests.{" "}
              <span className="web-only">
                {maha.owned
                  ? "You have Mahasangram, so you upgrade for ₹500."
                  : `${revision.pkg ? formatINR(revision.price ?? revision.pkg.price) : "₹999"}, or buy Mahasangram now and upgrade later for ₹500.`}
              </span>
            </p>
            <Link
              href="/revision"
              className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-saffron-400 px-5 text-sm font-bold text-graphite-950 hover:bg-saffron-300"
            >
              See the Revision Test Series <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
