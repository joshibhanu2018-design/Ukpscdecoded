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
  if (!user) redirect("/student/login");

  const { testId } = await params;
  const access = await getTestAccess(user.id, testId);

  if (!access.ok) {
    if (access.reason === "not_found") notFound();
    const message = {
      not_released: "यह टेस्ट अभी जारी नहीं हुआ है। / This test isn't released yet.",
      not_owned: "यह टेस्ट आपके पैकेज में शामिल नहीं है। / This test isn't in any package you own.",
      no_questions: "इस टेस्ट में अभी प्रश्न नहीं जोड़े गए हैं। / Questions haven't been added to this test yet.",
    }[access.reason];
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-900 px-4 py-16">
        <div className="mx-auto max-w-lg rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center">
          <Lock className="mx-auto mb-3 h-8 w-8 text-yellow-500" />
          <p className="text-slate-300">{message}</p>
          <Link
            href={access.reason === "not_owned" ? "/test-platform/packages" : "/test-platform"}
            className="mt-5 inline-block rounded-lg bg-yellow-500 px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-yellow-400"
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

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-900 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <Link href="/test-platform" className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-yellow-500">
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </Link>

        <h1 className="text-2xl font-bold text-white">{test.test_name}</h1>
        {test.is_free_test && (
          <span className="mt-2 inline-block rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-semibold text-green-400">
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
            <div key={s.label} className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="mb-2 text-yellow-500">{s.icon}</div>
              <div className="text-xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-slate-400">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h2 className="mb-3 font-semibold text-white">
            निर्देश <span className="text-slate-400">/ Instructions</span>
          </h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
            <li>
              टाइमर &quot;Start&quot; दबाते ही शुरू हो जाएगा और टैब बंद करने पर भी चलता रहेगा।{" "}
              <span className="text-slate-500">The timer starts when you press Start and keeps running even if you close the tab.</span>
            </li>
            <li>
              आपके उत्तर अपने-आप सेव होते हैं — आप बाद में वापस आकर जारी रख सकते हैं।{" "}
              <span className="text-slate-500">Answers save automatically — you can come back and resume before time runs out.</span>
            </li>
            <li>
              समय समाप्त होने पर टेस्ट अपने-आप सबमिट हो जाएगा।{" "}
              <span className="text-slate-500">The test submits automatically when time is up.</span>
            </li>
            {negative > 0 && (
              <li>
                हर गलत उत्तर पर {Math.round(negative * 100) / 100} अंक कटेंगे; छोड़े गए प्रश्नों पर कोई कटौती नहीं।{" "}
                <span className="text-slate-500">
                  Each wrong answer deducts {Math.round(negative * 100) / 100} marks; unanswered questions cost nothing.
                </span>
              </li>
            )}
            <li>
              हिंदी/English भाषा टेस्ट के दौरान कभी भी बदली जा सकती है।{" "}
              <span className="text-slate-500">You can switch between Hindi and English at any time.</span>
            </li>
          </ul>
        </div>

        <div className="mt-6">
          <StartTestButton
            testId={test.id}
            label={resumable ? "Resume Test / जारी रखें" : submitted.length > 0 ? "Reattempt / दोबारा दें" : "Start Test / शुरू करें"}
          />
        </div>

        {submitted.length > 0 && (
          <div className="mt-10">
            <h2 className="mb-3 font-semibold text-white">
              पिछले प्रयास <span className="text-slate-400">/ Previous Attempts</span>
            </h2>
            <ul className="divide-y divide-slate-800 rounded-2xl border border-slate-800 bg-slate-900/60">
              {submitted.map((a) => (
                <li key={a.id} className="flex items-center justify-between px-5 py-3 text-sm">
                  <span className="text-slate-400">
                    {formatDateLabel(parseUtcTimestamp(a.submitted_at ?? a.start_time).toISOString())}
                  </span>
                  <span className="font-semibold text-white">
                    {Number(a.score)} / {Number(a.total_marks)}
                  </span>
                  <Link
                    href={`/test-platform/attempts/${a.id}/result`}
                    className="text-xs font-medium text-yellow-500 hover:text-yellow-400"
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
