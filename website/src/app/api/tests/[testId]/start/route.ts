import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUserFromSession, SESSION_COOKIE_NAME } from "@/lib/auth-utils";
import { getTestAccess, MAX_ATTEMPTS_PER_TEST, startOrResumeAttempt } from "@/lib/tests";

const ACCESS_ERRORS = {
  not_found: { status: 404, error: "Test not found" },
  not_released: { status: 403, error: "This test is not released yet" },
  not_owned: { status: 403, error: "Buy a package that includes this test to take it" },
  no_questions: { status: 409, error: "This test has no questions yet" },
} as const;

export async function POST(_request: NextRequest, { params }: { params: Promise<{ testId: string }> }) {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  const user = await getUserFromSession(token);
  if (!user) {
    return NextResponse.json({ error: "You must be logged in to take a test" }, { status: 401 });
  }

  const { testId } = await params;
  const access = await getTestAccess(user.id, testId);
  if (!access.ok) {
    const { status, error } = ACCESS_ERRORS[access.reason];
    return NextResponse.json({ error }, { status });
  }

  try {
    const started = await startOrResumeAttempt(user.id, access.test, access.enrollmentId, user.role === "admin");
    if ("limitReached" in started) {
      return NextResponse.json(
        { error: `You've used all ${MAX_ATTEMPTS_PER_TEST} attempts for this test (1 test + ${MAX_ATTEMPTS_PER_TEST - 1} retests).` },
        { status: 409 },
      );
    }
    return NextResponse.json({ attempt_id: started.attemptId, resumed: started.resumed });
  } catch (err) {
    console.error("[tests/start] failed:", err);
    return NextResponse.json({ error: "Could not start the test. Please try again." }, { status: 500 });
  }
}
