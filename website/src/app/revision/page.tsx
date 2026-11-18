import type { Metadata } from "next";
import Link from "next/link";
import T from "@/components/T";
import { cookies } from "next/headers";
import { ArrowRight, BookOpenCheck, CalendarDays, Download, Gift, Mountain, Newspaper, Trophy } from "lucide-react";
import { getUserFromSession, SESSION_COOKIE_NAME } from "@/lib/auth-utils";
import { daysToExam, FINAL_SCHEDULE, getFinalMonthState, MAHASANGRAM_SLUG, REVISION_SLUG } from "@/lib/finalMonth";
import { formatINR } from "@/lib/format";
import { getWarmupTest } from "@/lib/liveMock";
import { parseUtcTimestamp } from "@/lib/timestamps";
import BuyBox from "@/components/final-month/BuyBox";
import Timetable from "@/components/final-month/Timetable";
import PriceCutNote from "@/components/final-month/PriceCutNote";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: { canonical: "/revision" },
  title: "Final Revision Test Series - UKPSC Prelims 2026",
  description:
    "Last-month revision for UKPSC Prelims (29 Nov 2026): 6 live-ranked full mocks, complete Uttarakhand GK in 8 tests (800 Q), complete Current Affairs in 6 tests (600 Q) and 2 CSAT tests, with a day-by-day timetable.",
};

const TIMETABLE_PDF = "/uploads/final-month-timetable.pdf";

const BASE_FAQ = [
  {
    q: "I already bought a course or test series. Do I pay full price?",
    qHi: "मैंने पहले से कोर्स या टेस्ट सीरीज़ ली है। क्या पूरा पैसा देना होगा?",
    aHi: "नहीं। लॉगिन करें: क्रैश कोर्स, बेसिक, उत्तराखंड, करेंट अफेयर्स या CSAT वाले छात्रों को अपने आप 20% छूट मिलती है। मॉक महासंग्राम वाले छात्र ₹400 में अपग्रेड कर सकते हैं। प्रीमियम टेस्ट सीरीज़ और कम्प्लीट प्रीलिम्स पैक वाले छात्रों के डैशबोर्ड में यह पहले से फ्री है।",
    a: "No. Log in: Crash Course, Basic, Uttarakhand, Current Affairs or CSAT buyers get 20% off automatically. Mock Mahasangram students upgrade for ₹400. Premium Test Series and Complete Prelims Pack students already have it free in their dashboard.",
  },
  {
    q: "Are these new questions?",
    qHi: "क्या ये नए प्रश्न हैं?",
    aHi: "6 फुल मॉक, फुल मॉक 7-12 हैं (बेसिक टेस्ट सीरीज़ में नहीं हैं)। उत्तराखंड और करेंट अफेयर्स टेस्ट में हमारी उत्तराखंड और करेंट अफेयर्स सीरीज़ के सबसे अच्छे प्रश्न 100-100 प्रश्नों के रिवीजन टेस्ट में रखे गए हैं।",
    a: "The 6 full mocks are Full Mock 7-12 (not in the Basic Test Series). The Uttarakhand and Current Affairs tests bring together our best questions from the Uttarakhand and Current Affairs series into longer 100-question revision tests.",
  },
  {
    q: "What if I miss a date?",
    qHi: "अगर किसी दिन का टेस्ट छूट जाए तो?",
    aHi: "हर टेस्ट 15 जनवरी 2027 तक खुला रहेगा, इसलिए लोअर PCS के लिए भी काम आएगा। लाइव रैंक सिर्फ फुल मॉक में उसी दिन मिलती है; बाद में देने पर भी आपको दिखेगा कि उस दिन आपकी रैंक क्या होती।",
    a: "Every test stays open till 15 January 2027, so it also helps for Lower PCS. Only the full mocks have a live rank on their day; you still see the rank you would have had if you take one later.",
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
  // The free Warm-up Mock is only mentioned while it is still open.
  const warmup = await getWarmupTest().catch(() => null);
  const warmupOpen = !!warmup?.rank_until && Date.now() < parseUtcTimestamp(warmup.rank_until).getTime();
  const FAQ = [
    ...BASE_FAQ,
    warmupOpen
      ? {
          q: "Is there a free test?",
          qHi: "क्या कोई फ्री टेस्ट है?",
          a: "Yes. The Warm-up Mock (150 questions) is free for everyone right now, with a live rank list.",
          aHi: "हाँ। वार्म-अप मॉक (150 प्रश्न) अभी सबके लिए फ्री है, लाइव रैंक लिस्ट के साथ।",
        }
      : {
          q: "Is there a free test?",
          qHi: "क्या कोई फ्री टेस्ट है?",
          a: "Yes. The Free Sample Mock is open to everyone: log in and start it from the Test Series page. The free Warm-up Mock has closed; the Rank Challenge mocks are now running.",
          aHi: "हाँ। फ्री सैंपल मॉक सबके लिए खुला है: लॉगिन करें और टेस्ट सीरीज़ पेज से शुरू करें। फ्री वार्म-अप मॉक बंद हो चुका है; रैंक चैलेंज के मॉक अभी चल रहे हैं।",
        },
  ];

  return (
    <div className="bg-graphite-950">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-graphite-800 px-4 pb-10 pt-10 sm:pb-14 sm:pt-14">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(250,204,21,0.12),transparent_60%)]" />
        <div className="relative mx-auto grid max-w-5xl gap-8 md:grid-cols-[1.4fr_1fr] md:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-saffron-400/40 bg-saffron-400/10 px-3 py-1 text-xs font-semibold text-saffron-300">
              <CalendarDays className="h-3.5 w-3.5" /> <T en={<>UKPSC Prelims · 29 Nov 2026 · {days} days left</>} hi={<>UKPSC प्रीलिम्स · 29 नवंबर 2026 · {days} दिन बाकी</>} />
            </p>
            <h1 className="mt-4 font-display text-3xl font-bold leading-tight text-white sm:text-5xl">
              <T en={<>Final Revision <span className="text-saffron-400">Test Series</span></>} hi={<>फाइनल रिवीजन <span className="text-saffron-400">टेस्ट सीरीज़</span></>} />
            </h1>
            <p className="mt-4 text-base text-graphite-300 sm:text-lg">
              <T en="Everything to revise in the last month, in one timetable: one test a day, finished before the exam." hi="आखिरी महीने का पूरा रिवीजन एक टाइमटेबल में: रोज़ एक टेस्ट, परीक्षा से पहले सब पूरा।" />
            </p>
            <ul className="mt-5 space-y-2 text-sm text-graphite-200 sm:text-base">
              <li className="flex gap-2"><Trophy className="mt-0.5 h-5 w-5 flex-shrink-0 text-saffron-400" /> <T en="6 full mocks in the All Uttarakhand Rank Challenge (Mock Mahasangram)" hi="ऑल उत्तराखंड रैंक चैलेंज (मॉक महासंग्राम) के 6 फुल मॉक" /></li>
              <li className="flex gap-2"><Mountain className="mt-0.5 h-5 w-5 flex-shrink-0 text-jade-400" /> <T en="Complete Uttarakhand GK: 8 tests, 800 questions" hi="पूरा उत्तराखंड GK: 8 टेस्ट, 800 प्रश्न" /></li>
              <li className="flex gap-2"><Newspaper className="mt-0.5 h-5 w-5 flex-shrink-0 text-white" /> <T en="Complete Current Affairs: 6 tests, 600 questions" hi="पूरा करेंट अफेयर्स: 6 टेस्ट, 600 प्रश्न" /></li>
              <li className="flex gap-2"><BookOpenCheck className="mt-0.5 h-5 w-5 flex-shrink-0 text-graphite-300" /> <T en="2 CSAT papers at the 2024 level" hi="2024 के स्तर के 2 CSAT पेपर" /></li>
            </ul>
          </div>
          <div className="rounded-2xl border border-saffron-400/40 bg-graphite-900 p-5 shadow-2xl shadow-black/40 sm:p-6">
            {!revision.owned && <div className="mb-4"><PriceCutNote /></div>}
            <p className="text-sm font-semibold text-graphite-300"><T en="22 tests · 2,500 questions · valid till 15 Jan" hi="22 टेस्ट · 2,500 प्रश्न · 15 जनवरी तक मान्य" /></p>
            <div className="mt-3">
              <BuyBox
                state={revision}
                buyLabel={revision.kind === "upgrade" ? <T en="Upgrade now" hi="अभी अपग्रेड करें" /> : <T en="Get the Revision Series" hi="रिवीजन सीरीज़ लें" />}
                loggedIn={!!user}
                includedNote={<T en="Included with your Premium Test Series / Complete Prelims Pack. These questions are from your Premium, Uttarakhand and Current Affairs tests, arranged for the last month." hi="आपकी प्रीमियम टेस्ट सीरीज़ / कम्प्लीट प्रीलिम्स पैक में शामिल है। ये प्रश्न आपके प्रीमियम, उत्तराखंड और करेंट अफेयर्स टेस्ट से हैं, आखिरी महीने के हिसाब से लगाए गए हैं।" />}
              />
            </div>
            <a
              href={TIMETABLE_PDF}
              download
              className="mt-4 flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-graphite-700 text-sm font-semibold text-graphite-200 hover:border-saffron-400"
            >
              <Download className="h-4 w-4" /> <T en="Download timetable (PDF)" hi="टाइमटेबल डाउनलोड करें (PDF)" />
            </a>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-12 px-4 py-10 sm:py-14">
        {/* Who pays what */}
        <section className="web-only">
          <h2 className="font-display text-2xl font-bold text-white"><T en="Already our student? You pay less" hi="पहले से हमारे छात्र हैं? आपको कम देना है" /></h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-jade-500/40 bg-jade-500/10 p-4">
              <p className="font-semibold text-white"><T en="Premium / Complete Prelims Pack" hi="प्रीमियम / कम्प्लीट प्रीलिम्स पैक" /></p>
              <p className="mt-1 text-sm text-graphite-300"><T en="Free. It's already in your dashboard." hi="फ्री। यह पहले से आपके डैशबोर्ड में है।" /></p>
            </div>
            <div className="rounded-xl border border-saffron-400/40 bg-saffron-400/5 p-4">
              <p className="font-semibold text-white"><T en="Mock Mahasangram students" hi="मॉक महासंग्राम के छात्र" /></p>
              <p className="mt-1 text-sm text-graphite-300"><T en={<>Upgrade for <span className="font-bold text-saffron-300">₹400</span> and add all CA + Uttarakhand tests.</>} hi={<><span className="font-bold text-saffron-300">₹400</span> में अपग्रेड करें और सभी करेंट अफेयर्स + उत्तराखंड टेस्ट जोड़ें।</>} /></p>
            </div>
            <div className="rounded-xl border border-graphite-700 bg-graphite-900 p-4">
              <p className="font-semibold text-white"><T en="Crash Course, Basic or any other test series" hi="क्रैश कोर्स, बेसिक या कोई और टेस्ट सीरीज़" /></p>
              <p className="mt-1 text-sm text-graphite-300"><T en={<><span className="font-bold text-saffron-300">20% off</span> automatically when you log in.</>} hi={<>लॉगिन करते ही अपने आप <span className="font-bold text-saffron-300">20% छूट</span>।</>} /></p>
            </div>
          </div>
        </section>

        {/* Mahasangram only */}
        <section className="flex flex-col gap-4 rounded-2xl border border-graphite-800 bg-graphite-900/60 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="flex items-center gap-2 font-display text-lg font-bold text-white">
              <Trophy className="h-5 w-5 text-saffron-400" /> <T en="Only want the All Uttarakhand Rank Challenge?" hi="सिर्फ ऑल उत्तराखंड रैंक चैलेंज चाहिए?" />
            </p>
            <p className="mt-1 text-sm text-graphite-300">
              <T en="Are you the next topper? Mock Mahasangram: the 6 full mocks with the live rank list" hi="क्या अगले टॉपर आप हैं? मॉक महासंग्राम: लाइव रैंक लिस्ट के साथ 6 फुल मॉक" />
              <span className="web-only">{maha.pkg ? `, ${formatINR(maha.price ?? maha.pkg.price)}` : ""}</span>.{" "}
              {warmupOpen && <T en="Try the free Warm-up Mock first. " hi="पहले फ्री वार्म-अप मॉक दें। " />}
              <T en="You can upgrade to this full Revision Series later for ₹400." hi="बाद में ₹400 देकर इस पूरी रिवीजन सीरीज़ में अपग्रेड कर सकते हैं।" />
            </p>
          </div>
          <Link
            href="/mahasangram"
            className="inline-flex min-h-[44px] flex-shrink-0 items-center justify-center gap-2 rounded-xl border border-saffron-400 px-5 text-sm font-bold text-saffron-300 hover:bg-saffron-400/10"
          >
            <T en="See the Rank Challenge" hi="रैंक चैलेंज देखें" /> <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        {/* Timetable */}
        <section>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl font-bold text-white"><T en="Day-by-day timetable" hi="दिन-वार टाइमटेबल" /></h2>
              <p className="mt-1 text-sm text-graphite-300">
                <T en="One test a day. Full mocks open 12 noon to 6 pm; ranks and solutions at 8 pm. Other tests: any time." hi="रोज़ एक टेस्ट। फुल मॉक दोपहर 12 से शाम 6 बजे तक खुलते हैं; रैंक और हल रात 8 बजे। बाकी टेस्ट: किसी भी समय।" />
              </p>
            </div>
            <a href={TIMETABLE_PDF} download className="inline-flex items-center gap-1.5 text-sm font-semibold text-saffron-300 hover:underline">
              <Download className="h-4 w-4" /> PDF
            </a>
          </div>
          <div className="mt-5">
            <Timetable items={upcoming.length > 0 ? upcoming : FINAL_SCHEDULE} today={today} />
          </div>
          <p className="mt-3 text-xs text-graphite-300"><T en="27 and 28 Nov: no new test. Retake your two weakest tests and read your wrong-answer list." hi="27 और 28 नवंबर: कोई नया टेस्ट नहीं। अपने दो सबसे कमज़ोर टेस्ट दोबारा दें और गलत उत्तरों की सूची पढ़ें।" /></p>
        </section>

        {/* Other courses */}
        <section className="web-only rounded-2xl border border-graphite-800 bg-graphite-900/60 p-5 sm:p-6">
          <p className="flex items-center gap-2 font-display text-lg font-bold text-white">
            <Gift className="h-5 w-5 text-saffron-400" /> <T en="Want videos and notes too?" hi="वीडियो और नोट्स भी चाहिए?" />
          </p>
          <p className="mt-1 text-sm text-graphite-300">
            <T en="Every course is cheaper till 29 Nov. The Complete Prelims Pack (Crash Course + Premium Test Series) includes this Revision Series free." hi="29 नवंबर तक हर कोर्स सस्ता है। कम्प्लीट प्रीलिम्स पैक (क्रैश कोर्स + प्रीमियम टेस्ट सीरीज़) में यह रिवीजन सीरीज़ फ्री मिलती है।" />
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/courses/complete-prelims-pack" className="rounded-full border border-saffron-400/60 px-4 py-2 text-sm font-semibold text-saffron-300 hover:bg-saffron-400/10">Complete Prelims Pack</Link>
            <Link href="/courses/crash-course" className="rounded-full border border-graphite-700 px-4 py-2 text-sm text-graphite-200 hover:border-saffron-400">Crash Course</Link>
            <Link href="/courses/premium-test-series" className="rounded-full border border-graphite-700 px-4 py-2 text-sm text-graphite-200 hover:border-saffron-400">Premium Test Series</Link>
            <Link href="/courses" className="rounded-full border border-graphite-700 px-4 py-2 text-sm text-graphite-200 hover:border-saffron-400"><T en="All courses" hi="सभी कोर्स" /></Link>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="font-display text-2xl font-bold text-white"><T en="Questions" hi="आपके सवाल" /></h2>
          <div className="mt-4 divide-y divide-graphite-800 rounded-2xl border border-graphite-800 bg-graphite-900/60">
            {FAQ.map((f) => (
              <details key={f.q} className="group p-4">
                <summary className="cursor-pointer list-none font-semibold text-white marker:hidden">
                  <T en={f.q} hi={f.qHi} />
                </summary>
                <p className="mt-2 text-sm text-graphite-300"><T en={f.a} hi={f.aHi} /></p>
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
            {revision.kind === "upgrade" ? <T en="Upgrade" hi="अपग्रेड करें" /> : <T en="Get Revision Series" hi="रिवीजन सीरीज़ लें" />} · {formatINR(revision.price ?? revision.pkg.price)}
          </Link>
        </div>
      )}
    </div>
  );
}
