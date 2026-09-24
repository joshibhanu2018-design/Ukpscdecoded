import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUserFromSession, SESSION_COOKIE_NAME } from "@/lib/auth-utils";
import { getTestAccess, startOrResumeAttempt } from "@/lib/tests";

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
    const { attemptId, resumed } = await startOrResumeAttempt(user.id, access.test, access.enrollmentId);
    return NextResponse.json({ attempt_id: attemptId, resumed });
  } catch (err) {
    console.error("[tests/start] failed:", err);
    return NextResponse.json({ error: "Could not start the test. Please try again." }, { status: 500 });
  }
}
