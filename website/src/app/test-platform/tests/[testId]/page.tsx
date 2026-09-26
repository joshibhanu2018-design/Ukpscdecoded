import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Clock, FileQuestion, Lock, MinusCircle, PlusCircle } from "lucide-react";
import { getUserFromSession, SESSION_COOKIE_NAME } from "@/lib/auth-utils";
import { formatDateLabel } from "@/lib/packages";
import { parseUtcTimestamp } from "@/lib/timestamps";
import { getTestAccess, getUserAttemptsForTest, isPastGrace } from "@/lib/tests";
import StartTestButton from "@/components/StartTestButton";

export const metadata: Metadata = {
  title: "Test Instructions",
};

export default async function TestInstructionsPage({ params }: { params: Promise<{ testId: string }> }) {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  const user = await getUserFromSession(token);
  const { testId } = await params;
  if (!user) redirect(`/student/login?next=${encodeURIComponent(`/test-platform/tests/${testId}`)}`);

  const access = await getTestAccess(user.id, testId);

  if (!access.ok) {
    if (access.reason === "not_found") notFound();
    const message = {
      not_released: "This test isn't released yet.",
      not_owned: "This test isn't in any package you own.",
      no_questions: "Questions haven't been added to this test yet.",
    }[access.reason];
    return (
      <div className="min-h-screen bg-graphite-950 px-4 py-16">
        <div className="mx-auto max-w-lg rounded-2xl border border-graphite-800 bg-graphite-900/60 p-8 text-center">
          <Lock className="mx-auto mb-3 h-8 w-8 text-saffron-400" />
          <p className="text-graphite-300">{message}</p>
          <Link
            href={access.reason === "not_owned" ? "/test-platform/packages" : "/test-platform"}
            className="mt-5 inline-block rounded-lg bg-saffron-400 px-5 py-2.5 text-sm font-semibold text-graphite-900 hover:bg-saffron-300"
          >
            {access.reason === "not_owned" ? "Browse the Package Store" : "Back to Dashboard"}
          </Link>
        </div>
      </div>
    );
  }

  const { test } = access;
  const attempts = await getUserAttemptsForTest(user.id, test.id);
  const resumable = attempts.find((a) => a.status === "in_progress" && !isPastGrace(a, test));
  const submitted = attempts.filter((a) => a.status === "submitted");
  const negative = test.negative_marking_enabled ? test.marks_per_question * test.negative_marking_value : 0;
  const perWrong = Math.round(negative * 100) / 100;
  const quarter = test.negative_marking_value === 0.25;
  // All points in English as one list, then all in Hindi — not mixed line by line.
  const instructions = [
    {
      en: "The timer starts when you press Start and keeps running even if you close the tab.",
      hi: "टाइमर \"Start\" दबाते ही शुरू हो जाएगा और टैब बंद करने पर भी चलता रहेगा।",
    },
    {
      en: "Answers save automatically — you can come back and resume before time runs out.",
      hi: "आपके उत्तर अपने-आप सेव होते हैं — समय रहते आप वापस आकर जारी रख सकते हैं।",
    },
    { en: "The test submits automatically when time is up.", hi: "समय समाप्त होने पर टेस्ट अपने-आप सबमिट हो जाएगा।" },
    ...(negative > 0
      ? [
          {
            en: `Each wrong answer deducts ${perWrong} marks${quarter ? " (one-quarter of the question's marks)" : ""}; unanswered questions cost nothing.`,
            hi: `हर गलत उत्तर पर ${perWrong} अंक${quarter ? " (प्रश्न के अंकों का एक-चौथाई)" : ""} कटेंगे; छोड़े गए प्रश्नों पर कोई कटौती नहीं।`,
          },
        ]
      : []),
    {
      en: "Switch between हिंदी and EN at any time with the button at the top of the test.",
      hi: "टेस्ट के ऊपर दिए बटन से हिंदी/EN भाषा कभी भी बदली जा सकती है।",
    },
    {
      en: "After submitting, you can report any question you think is wrong from the answer review.",
      hi: "सबमिट करने के बाद उत्तर समीक्षा में किसी भी गलत लगने वाले प्रश्न की सूचना दे सकते हैं।",
    },
  ];

  return (
    <div className="min-h-screen bg-graphite-950 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <Link href="/test-platform" className="mb-6 inline-flex items-center gap-1.5 text-sm text-graphite-300 hover:text-saffron-400">
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </Link>

        <h1 className="text-2xl font-bold text-white">{test.test_name}</h1>
        {test.is_free_test && (
          <span className="mt-2 inline-block rounded-full bg-success-500/10 px-2.5 py-0.5 text-xs font-semibold text-success-400">
            Free Test
          </span>
        )}

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { icon: <FileQuestion className="h-5 w-5" />, label: "Questions", value: String(test.question_ids.length) },
            { icon: <Clock className="h-5 w-5" />, label: "Duration", value: `${test.duration_minutes} min` },
            { icon: <PlusCircle className="h-5 w-5" />, label: "Per correct", value: `+${test.marks_per_question}` },
            {
              icon: <MinusCircle className="h-5 w-5" />,
              label: "Per wrong",
              value: negative > 0 ? `−${Math.round(negative * 100) / 100}` : "0",
            },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-graphite-800 bg-graphite-900/60 p-4">
              <div className="mb-2 text-saffron-400">{s.icon}</div>
              <div className="text-xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-graphite-300">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-graphite-800 bg-graphite-900/60 p-6">
            <h2 className="mb-3 font-semibold text-white">Instructions</h2>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-graphite-200">
              {instructions.map((i) => (
                <li key={i.en}>{i.en}</li>
              ))}
            </ul>
          </div>
          <div lang="hi" className="rounded-2xl border border-graphite-800 bg-graphite-900/60 p-6">
            <h2 className="mb-3 font-semibold text-white">निर्देश</h2>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-graphite-200">
              {instructions.map((i) => (
                <li key={i.hi}>{i.hi}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6">
          <StartTestButton
            testId={test.id}
            label={resumable ? "Resume Test" : submitted.length > 0 ? "Reattempt" : "Start Test"}
          />
        </div>

        {submitted.length > 0 && (
          <div className="mt-10">
            <h2 className="mb-3 font-semibold text-white">
              Previous Attempts
            </h2>
            <ul className="divide-y divide-graphite-800 rounded-2xl border border-graphite-800 bg-graphite-900/60">
              {submitted.map((a) => (
                <li key={a.id} className="flex items-center justify-between px-5 py-3 text-sm">
                  <span className="text-graphite-300">
                    {formatDateLabel(parseUtcTimestamp(a.submitted_at ?? a.start_time).toISOString())}
                  </span>
                  <span className="font-semibold text-white">
                    {Number(a.score)} / {Number(a.total_marks)}
                  </span>
                  <Link
                    href={`/test-platform/attempts/${a.id}/result`}
                    className="text-xs font-medium text-saffron-400 hover:text-saffron-300"
                  >
                    View result
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
