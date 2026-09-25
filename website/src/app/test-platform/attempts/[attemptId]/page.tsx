import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { getUserFromSession, SESSION_COOKIE_NAME } from "@/lib/auth-utils";
import {
  finalizeAttempt,
  getAttempt,
  getAttemptDeadline,
  getTest,
  getTestQuestions,
  isPastGrace,
  sanitizeAnswers,
  sanitizeConfidence,
  sanitizeMarked,
  toPublicQuestion,
} from "@/lib/tests";
import TestRunner from "@/components/TestRunner";

export const metadata: Metadata = {
  title: "Test in Progress",
  robots: { index: false },
};

export default async function AttemptPage({ params }: { params: Promise<{ attemptId: string }> }) {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  const user = await getUserFromSession(token);
  if (!user) redirect("/student/login");

  const { attemptId } = await params;
  const attempt = await getAttempt(attemptId, user.id);
  if (!attempt) notFound();

  const test = await getTest(attempt.test_id);
  if (!test) notFound();

  if (attempt.status === "in_progress" && isPastGrace(attempt, test)) {
    // Came back after time ran out — score whatever was saved in time.
    await finalizeAttempt(attempt, test);
  }
  if (attempt.status !== "in_progress" || isPastGrace(attempt, test)) {
    redirect(`/test-platform/attempts/${attempt.id}/result`);
  }

  // Answers and explanations are stripped here — only the public shape
  // ever reaches the browser while the test is running.
  const questions = (await getTestQuestions(test, attempt.start_time)).map(toPublicQuestion);

  return (
    <TestRunner
      attemptId={attempt.id}
      testName={test.test_name}
      questions={questions}
      initialAnswers={sanitizeAnswers(attempt.answers, test.question_ids)}
      initialMarked={sanitizeMarked(attempt.marked_for_review, test.question_ids)}
      initialConfidence={sanitizeConfidence(attempt.confidence, test.question_ids)}
      deadline={getAttemptDeadline(attempt, test).getTime()}
      serverNow={Date.now()}
    />
  );
}
