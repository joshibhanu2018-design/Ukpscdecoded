import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { ArrowRight, BookOpenCheck, CalendarDays, Download, Gift, Mountain, Newspaper, Trophy } from "lucide-react";
import { getUserFromSession, SESSION_COOKIE_NAME } from "@/lib/auth-utils";
import { daysToExam, FINAL_SCHEDULE, getFinalMonthState, MAHASANGRAM_SLUG, REVISION_SLUG } from "@/lib/finalMonth";
import { formatINR } from "@/lib/format";
import BuyBox from "@/components/final-month/BuyBox";
import Timetable from "@/components/final-month/Timetable";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: { canonical: "/revision" },
  title: "Final Revision Test Series - UKPSC Prelims 2026",
  description:
    "Last-month revision for UKPSC Prelims (29 Nov 2026): 6 live-ranked full mocks, complete Uttarakhand GK in 8 tests (800 Q), complete Current Affairs in 6 tests (600 Q) and 2 CSAT tests, with a day-by-day timetable.",
};

const TIMETABLE_PDF = "/uploads/final-month-timetable.pdf";

const FAQ = [
  {
    q: "I already bought a course or test series. Do I pay full price?",
    a: "No. Log in: Crash Course, Basic, Uttarakhand, Current Affairs or CSAT buyers get 20% off automatically. Mock Mahasangram students upgrade for ₹500. Premium Test Series and Complete Prelims Pack students already have it free in their dashboard.",
  },
  {
    q: "Are these new questions?",
    a: "The 6 full mocks are Full Mock 7-12 (not in the Basic Test Series). The Uttarakhand and Current Affairs tests bring together our best questions from the Uttarakhand and Current Affairs series into longer 100-question revision tests.",
  },
  {
    q: "What if I miss a date?",
    a: "Every test stays open till 31 December 2026, so it also helps for Lower PCS. Only the full mocks have a live rank on their day; you still see the rank you would have had if you take one later.",
  },
  {
    q: "Is there a free test?",
    a: "Yes. All Uttarakhand Rank Challenge (Mock Mahasangram) Mock 1 on Thu 12 Nov is free for everyone, with the live rank list at 8 pm.",
  },
];

export default async function RevisionPage() {
  const user = await getUserFromSession((await cookies()).get(SESSION_COOKIE_NAME)?.value);
  const state = await getFinalMonthState(user?.id ?? null);
  const revision = state[REVISION_SLUG];
  const maha = state[MAHASANGRAM_SLUG];
  const days = daysToExam();
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  const upcoming = FINAL_SCHEDULE.filter((t) => t.date >= today);

  return (
    <div className="bg-graphite-950">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-graphite-800 px-4 pb-10 pt-10 sm:pb-14 sm:pt-14">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(250,204,21,0.12),transparent_60%)]" />
        <div className="relative mx-auto grid max-w-5xl gap-8 md:grid-cols-[1.4fr_1fr] md:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-saffron-400/40 bg-saffron-400/10 px-3 py-1 text-xs font-semibold text-saffron-300">
              <CalendarDays className="h-3.5 w-3.5" /> UKPSC Prelims · 29 Nov 2026 · {days} days left
            </p>
            <h1 className="mt-4 font-display text-3xl font-bold leading-tight text-white sm:text-5xl">
              Final Revision <span className="text-saffron-400">Test Series</span>
            </h1>
            <p className="mt-4 text-base text-graphite-300 sm:text-lg">
              Everything to revise in the last month, in one timetable: one test a day, finished before the exam.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-graphite-200 sm:text-base">
              <li className="flex gap-2"><Trophy className="mt-0.5 h-5 w-5 flex-shrink-0 text-saffron-400" /> 6 full mocks in the All Uttarakhand Rank Challenge (Mock Mahasangram)</li>
              <li className="flex gap-2"><Mountain className="mt-0.5 h-5 w-5 flex-shrink-0 text-jade-400" /> Complete Uttarakhand GK: 8 tests, 800 questions</li>
              <li className="flex gap-2"><Newspaper className="mt-0.5 h-5 w-5 flex-shrink-0 text-white" /> Complete Current Affairs: 6 tests, 600 questions</li>
              <li className="flex gap-2"><BookOpenCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-graphite-300" /> 2 CSAT papers at the 2024 level</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-saffron-400/40 bg-graphite-900 p-5 shadow-2xl shadow-black/40 sm:p-6">
            <p className="text-sm font-semibold text-graphite-300">22 tests · 2,500 questions · valid till 31 Dec</p>
            <div className="mt-3">
              <BuyBox
                state={revision}
                buyLabel={revision.kind === "upgrade" ? "Upgrade now" : "Get the Revision Series"}
                loggedIn={!!user}
                includedNote="Included with your Premium Test Series / Complete Prelims Pack. These questions are from your Premium, Uttarakhand and Current Affairs tests, arranged for the last month."
              />
            </div>
            <a
              href={TIMETABLE_PDF}
              download
              className="mt-4 flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-graphite-700 text-sm font-semibold text-graphite-200 hover:border-saffron-400"
            >
              <Download className="h-4 w-4" /> Download timetable (PDF)
            </a>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-12 px-4 py-10 sm:py-14">
        {/* Who pays what */}
        <section className="web-only">
          <h2 className="font-display text-2xl font-bold text-white">Already our student? You pay less</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-jade-500/40 bg-jade-500/10 p-4">
              <p className="font-semibold text-white">Premium / Complete Prelims Pack</p>
              <p className="mt-1 text-sm text-graphite-300">Free. It&apos;s already in your dashboard.</p>
            </div>
            <div className="rounded-xl border border-saffron-400/40 bg-saffron-400/5 p-4">
              <p className="font-semibold text-white">Mock Mahasangram students</p>
              <p className="mt-1 text-sm text-graphite-300">Upgrade for <span className="font-bold text-saffron-300">₹500</span> and add all CA + Uttarakhand tests.</p>
            </div>
            <div className="rounded-xl border border-graphite-700 bg-graphite-900 p-4">
              <p className="font-semibold text-white">Crash Course, Basic or any other test series</p>
              <p className="mt-1 text-sm text-graphite-300"><span className="font-bold text-saffron-300">20% off</span> automatically when you log in.</p>
            </div>
          </div>
        </section>

        {/* Mahasangram only */}
        <section className="flex flex-col gap-4 rounded-2xl border border-graphite-800 bg-graphite-900/60 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="flex items-center gap-2 font-display text-lg font-bold text-white">
              <Trophy className="h-5 w-5 text-saffron-400" /> Only want the All Uttarakhand Rank Challenge?
            </p>
            <p className="mt-1 text-sm text-graphite-300">
              Are you the next topper? Mock Mahasangram: the 6 full mocks with the live rank list
              <span className="web-only">{maha.pkg ? `, ${formatINR(maha.price ?? maha.pkg.price)}` : ""}</span>. Mock 1 on 12 Nov is free.
              You can upgrade to this full Revision Series later for ₹500.
            </p>
          </div>
          <Link
            href="/mahasangram"
            className="inline-flex min-h-[44px] flex-shrink-0 items-center justify-center gap-2 rounded-xl border border-saffron-400 px-5 text-sm font-bold text-saffron-300 hover:bg-saffron-400/10"
          >
            See the Rank Challenge <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        {/* Timetable */}
        <section>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl font-bold text-white">Day-by-day timetable</h2>
              <p className="mt-1 text-sm text-graphite-300">
                One test a day. Full mocks open 12 noon to 6 pm; ranks and solutions at 8 pm. Other tests: any time.
              </p>
            </div>
            <a href={TIMETABLE_PDF} download className="inline-flex items-center gap-1.5 text-sm font-semibold text-saffron-300 hover:underline">
              <Download className="h-4 w-4" /> PDF
            </a>
          </div>
          <div className="mt-5">
            <Timetable items={upcoming.length > 0 ? upcoming : FINAL_SCHEDULE} today={today} />
          </div>
          <p className="mt-3 text-xs text-graphite-400">27 and 28 Nov: no new test. Retake your two weakest tests and read your wrong-answer list.</p>
        </section>

        {/* Other courses */}
        <section className="web-only rounded-2xl border border-graphite-800 bg-graphite-900/60 p-5 sm:p-6">
          <p className="flex items-center gap-2 font-display text-lg font-bold text-white">
            <Gift className="h-5 w-5 text-saffron-400" /> Want videos and notes too?
          </p>
          <p className="mt-1 text-sm text-graphite-300">
            Every course is cheaper till 29 Nov. The Complete Prelims Pack (Crash Course + Premium Test Series) includes this
            Revision Series free.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/courses/complete-prelims-pack" className="rounded-full border border-saffron-400/60 px-4 py-2 text-sm font-semibold text-saffron-300 hover:bg-saffron-400/10">Complete Prelims Pack</Link>
            <Link href="/courses/crash-course" className="rounded-full border border-graphite-700 px-4 py-2 text-sm text-graphite-200 hover:border-saffron-400">Crash Course</Link>
            <Link href="/courses/premium-test-series" className="rounded-full border border-graphite-700 px-4 py-2 text-sm text-graphite-200 hover:border-saffron-400">Premium Test Series</Link>
            <Link href="/courses" className="rounded-full border border-graphite-700 px-4 py-2 text-sm text-graphite-200 hover:border-saffron-400">All courses</Link>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="font-display text-2xl font-bold text-white">Questions</h2>
          <div className="mt-4 divide-y divide-graphite-800 rounded-2xl border border-graphite-800 bg-graphite-900/60">
            {FAQ.map((f) => (
              <details key={f.q} className="group p-4">
                <summary className="cursor-pointer list-none font-semibold text-white marker:hidden">
                  {f.q}
                </summary>
                <p className="mt-2 text-sm text-graphite-300">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>

      {/* Sticky buy bar on phones */}
      {!revision.owned && revision.pkg && <div aria-hidden className="web-only h-20 md:hidden" />}
      {!revision.owned && revision.pkg && (
        <div className="web-only fixed inset-x-0 bottom-0 z-40 border-t border-graphite-800 bg-graphite-950/95 px-4 py-3 backdrop-blur md:hidden [@media(display-mode:standalone)]:hidden">
          <Link
            href={user ? `/checkout/${REVISION_SLUG}` : `/student/login?next=${encodeURIComponent(`/checkout/${REVISION_SLUG}`)}`}
            className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-saffron-400 text-base font-bold text-graphite-950"
          >
            {revision.kind === "upgrade" ? "Upgrade" : "Get Revision Series"} · {formatINR(revision.price ?? revision.pkg.price)}
          </Link>
        </div>
      )}
    </div>
  );
}
