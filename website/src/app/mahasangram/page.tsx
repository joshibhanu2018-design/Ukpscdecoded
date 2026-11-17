import type { Metadata } from "next";
import Link from "next/link";
import T from "@/components/T";
import { cookies } from "next/headers";
import { ArrowLeft, ArrowRight, Clock, Download, Star, Trophy } from "lucide-react";
import BuyBox from "@/components/final-month/BuyBox";
import Timetable from "@/components/final-month/Timetable";
import { FINAL_SCHEDULE, getFinalMonthState, MAHASANGRAM_SLUG, REVISION_SLUG } from "@/lib/finalMonth";
import { formatINR } from "@/lib/format";
import { getUserFromSession, SESSION_COOKIE_NAME } from "@/lib/auth-utils";
import { supabaseAdmin } from "@/lib/supabase";
import { formatIst, getLiveTests, getWarmupTest, isResultHidden, LIVE_SERIES_NAME } from "@/lib/liveMock";
import JoinForm from "./JoinForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: { canonical: "/mahasangram" },
  title: "All Uttarakhand Rank Challenge (Mock Mahasangram) - UKPSC Prelims",
  description:
    "Free UKPSC Prelims 2026 full-length mock with a live rank list across Uttarakhand. 6 mocks, same test same day, results at 8 pm.",
};

export default async function MahasangramPage() {
  const user = await getUserFromSession((await cookies()).get(SESSION_COOKIE_NAME)?.value);
  const [tests, warmup] = await Promise.all([getLiveTests(), getWarmupTest()]);
  const warmupOpen = !!warmup?.rank_until && Date.now() < new Date(warmup.rank_until).getTime();
  const free = tests.find((t) => t.is_free_test);

  const state = await getFinalMonthState(user?.id ?? null);
  const maha = state[MAHASANGRAM_SLUG];
  const revision = state[REVISION_SLUG];
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  const mockDates = FINAL_SCHEDULE.filter((t) => t.kind === "mock");
  const nextMock = mockDates.find((t) => t.date >= today);
  const formatDay = (d: string) => new Date(`${d}T00:00:00+05:30`).toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" });

  let hasDistrict = false;
  if (user) {
    const { data } = await supabaseAdmin().from("users").select("district").eq("id", user.id).maybeSingle();
    hasDistrict = !!data?.district;
  }

  return (
    <div className="bg-graphite-950 px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-4xl space-y-10">
        <Link href="/revision" className="inline-flex items-center gap-1.5 text-sm text-graphite-300 hover:text-saffron-400">
          <ArrowLeft className="h-4 w-4" /> <T en="Final Revision Test Series" hi="फाइनल रिवीजन टेस्ट सीरीज़" />
        </Link>
        <div className="text-center">
          <Trophy className="mx-auto h-10 w-10 text-saffron-400" />
          <p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-saffron-400"><T en="Mock Mahasangram" hi="मॉक महासंग्राम" /></p>
          <h1 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl"><T en={LIVE_SERIES_NAME} hi="ऑल उत्तराखंड रैंक चैलेंज" /></h1>
          <p className="mt-2 font-display text-xl font-bold text-saffron-300 sm:text-2xl"><T en="Are you the next topper?" hi="क्या अगले टॉपर आप हैं?" /></p>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-graphite-300 sm:text-base">
            <T
              en="6 full-length mocks before the 29 Nov exam. Everyone writes the same mock on the same day, and at 8 pm the rank list for the whole of Uttarakhand goes live."
              hi="29 नवंबर की परीक्षा से पहले 6 फुल मॉक। सब छात्र एक ही दिन एक ही मॉक देते हैं, और रात 8 बजे पूरे उत्तराखंड की रैंक लिस्ट आ जाती है।"
            />{" "}
            {warmup && warmupOpen ? (
              <span className="font-semibold text-saffron-300"><T en="Try the free Warm-up Mock today." hi="आज ही फ्री वार्म-अप मॉक दें।" /></span>
            ) : nextMock ? (
              <span className="font-semibold text-saffron-300"><T en={<>Next mock: {formatDay(nextMock.date)}. Join now, earlier mocks stay open for practice.</>} hi={<>अगला मॉक: {formatDay(nextMock.date)}। अभी जुड़ें, पिछले मॉक अभ्यास के लिए खुले रहेंगे।</>} /></span>
            ) : null}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { icon: <Clock className="h-5 w-5" />, title: "12 noon to 6 pm", titleHi: "दोपहर 12 से शाम 6 बजे", text: "Start any time in this window on the mock day. 150 questions, 2 hours.", textHi: "मॉक वाले दिन इस समय के बीच कभी भी शुरू करें। 150 प्रश्न, 2 घंटे।" },
            { icon: <Trophy className="h-5 w-5" />, title: "Result at 8 pm", titleHi: "रिज़ल्ट रात 8 बजे", text: "Score, solutions and the live rank list (name and district) come out together.", textHi: "स्कोर, हल और लाइव रैंक लिस्ट (नाम और ज़िला) एक साथ आते हैं।" },
            { icon: <Star className="h-5 w-5" />, title: "Stars for the top 20", titleHi: "टॉप 20 को स्टार", text: "Top 3 also win 30% off the crash course or a test series.", textHi: "टॉप 3 को क्रैश कोर्स या टेस्ट सीरीज़ पर 30% छूट भी मिलती है।" },
          ].map((c) => (
            <div key={c.title} className="rounded-xl border border-graphite-800 bg-graphite-900/60 p-4">
              <div className="text-saffron-400">{c.icon}</div>
              <p className="mt-2 font-semibold text-white"><T en={c.title} hi={c.titleHi} /></p>
              <p className="mt-1 text-sm text-graphite-300"><T en={c.text} hi={c.textHi} /></p>
            </div>
          ))}
        </div>

        {warmup && warmupOpen && (
          <div className="flex flex-col gap-4 rounded-2xl border border-jade-500/50 bg-gradient-to-br from-jade-500/15 to-transparent p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-jade-400">Free now · till {formatIst(warmup.rank_until)}</p>
              <h2 className="mt-1 font-display text-xl font-bold text-white">Warm-up Mock: try it today</h2>
              <p className="mt-1 text-sm text-graphite-300">
                A full 150-question mock, free for everyone. See your rank as soon as you submit. The rank list stays live and
                changes as more students take it, till 11 Nov.
              </p>
            </div>
            <div className="flex flex-shrink-0 flex-col gap-2 sm:w-72">
              {user && hasDistrict ? (
                <Link
                  href={`/test-platform/tests/${warmup.id}`}
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-jade-500 px-5 text-sm font-bold text-graphite-950 hover:bg-jade-400"
                >
                  Take the Warm-up Mock <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <JoinForm freeTestId={warmup.id} loggedIn={!!user} buttonLabel="Start the free Warm-up Mock" />
              )}
              <Link href={`/mahasangram/${warmup.id}/ranks`} className="text-center text-sm font-semibold text-jade-300 hover:underline">
                See the live rank list
              </Link>
            </div>
          </div>
        )}

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
            <p className="text-xs font-bold uppercase tracking-wider text-saffron-400"><T en="Join · All 6 live mocks" hi="जुड़ें · सभी 6 लाइव मॉक" /></p>
            <h2 className="mt-1 font-display text-xl font-bold text-white"><T en="All Uttarakhand Rank Challenge" hi="ऑल उत्तराखंड रैंक चैलेंज" /></h2>
            <p className="mt-1 text-sm text-graphite-300">
              <T en="6 full mocks (150 Q each) with live ranks. Different tests from the Basic Test Series." hi="लाइव रैंक के साथ 6 फुल मॉक (हर एक में 150 प्रश्न)। ये बेसिक टेस्ट सीरीज़ से अलग टेस्ट हैं।" />
            </p>
            <div className="mt-4">
              <BuyBox
                state={maha}
                buyLabel={<T en="Join the Rank Challenge" hi="रैंक चैलेंज से जुड़ें" />}
                loggedIn={!!user}
                includedNote={<T en="Included with your Premium Test Series / Complete Prelims Pack." hi="आपकी प्रीमियम टेस्ट सीरीज़ / कम्प्लीट प्रीलिम्स पैक में शामिल है।" />}
              />
            </div>
            <a
              href="/uploads/final-month-timetable.pdf"
              download
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-saffron-300 hover:underline"
            >
              <Download className="h-4 w-4" /> <T en="Timetable (PDF)" hi="टाइमटेबल (PDF)" />
            </a>
          </div>
        </div>

        <div>
          <h2 className="font-display text-2xl font-bold text-white"><T en="Mock dates" hi="मॉक की तारीखें" /></h2>
          <p className="mt-1 text-sm text-graphite-300"><T en="Each day: start between 12 noon and 6 pm, ranks and solutions at 8 pm." hi="हर दिन: दोपहर 12 से शाम 6 बजे के बीच शुरू करें, रैंक और हल रात 8 बजे।" /></p>
          <div className="mt-4">
            <Timetable items={mockDates} today={today} />
          </div>
          {tests.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {tests.map((t, i) => {
                const published = !!t.result_at && !isResultHidden(t);
                return published ? (
                  <Link key={t.id} href={`/mahasangram/${t.id}/ranks`} className="rounded-full border border-saffron-400/50 px-3 py-1.5 text-xs font-semibold text-saffron-300 hover:bg-saffron-400/10">
                    <T en={<>Mock {i + 1} rank list</>} hi={<>मॉक {i + 1} की रैंक लिस्ट</>} />
                  </Link>
                ) : null;
              })}
            </div>
          )}
        </div>

        {!revision.owned && (
          <div className="rounded-2xl border border-saffron-400/40 bg-saffron-400/5 p-5 sm:p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-saffron-400"><T en="Step 3 · Full revision" hi="अगला कदम · पूरा रिवीजन" /></p>
            <h2 className="mt-1 font-display text-xl font-bold text-white"><T en="Add Uttarakhand GK + Current Affairs" hi="उत्तराखंड GK + करेंट अफेयर्स भी जोड़ें" /></h2>
            <p className="mt-1 text-sm text-graphite-300">
              <T
                en="The Revision Test Series has these 6 mocks plus complete Uttarakhand GK (8 tests, 800 Q), complete Current Affairs (6 tests, 600 Q) and 2 CSAT tests."
                hi="रिवीजन टेस्ट सीरीज़ में ये 6 मॉक, पूरा उत्तराखंड GK (8 टेस्ट, 800 प्रश्न), पूरा करेंट अफेयर्स (6 टेस्ट, 600 प्रश्न) और 2 CSAT टेस्ट हैं।"
              />{" "}
              <span className="web-only">
                {maha.owned ? (
                  <T en="You have Mahasangram, so you upgrade for ₹500." hi="आपके पास महासंग्राम है, इसलिए ₹500 में अपग्रेड करें।" />
                ) : (
                  <T
                    en={<>{revision.pkg ? formatINR(revision.price ?? revision.pkg.price) : "₹999"}, or buy Mahasangram now and upgrade later for ₹500.</>}
                    hi={<>कीमत {revision.pkg ? formatINR(revision.price ?? revision.pkg.price) : "₹999"}, या अभी महासंग्राम लें और बाद में ₹500 में अपग्रेड करें।</>}
                  />
                )}
              </span>
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/checkout/revision-test-series"
                className="web-only inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-saffron-400 px-5 text-sm font-bold text-graphite-950 hover:bg-saffron-300"
              >
                {maha.owned ? <T en="Upgrade now" hi="अभी अपग्रेड करें" /> : <T en="Buy Revision Test Series" hi="रिवीजन टेस्ट सीरीज़ खरीदें" />} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/revision"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-graphite-600 px-5 text-sm font-semibold text-graphite-200 hover:border-saffron-400 hover:text-saffron-300"
              >
                <T en="Know more" hi="और जानें" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
