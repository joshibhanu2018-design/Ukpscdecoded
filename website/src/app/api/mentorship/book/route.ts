import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getUserFromSession, SESSION_COOKIE_NAME } from "@/lib/auth-utils";
import { bookSlot, isMentee } from "@/lib/mentorship";

export async function POST(request: NextRequest) {
  const user = await getUserFromSession((await cookies()).get(SESSION_COOKIE_NAME)?.value);
  if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });
  if (!(await isMentee(user.id))) return NextResponse.json({ error: "Mentorship students only" }, { status: 403 });

  const body = await request.json().catch(() => null);
  const result = await bookSlot(user.id, String(body?.slot_start ?? ""), typeof body?.note === "string" ? body.note : null);
  return result.ok ? NextResponse.json({ ok: true, id: result.id }) : NextResponse.json({ error: result.error }, { status: result.status });
}
