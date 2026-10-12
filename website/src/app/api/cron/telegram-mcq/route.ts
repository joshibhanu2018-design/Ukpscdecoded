import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { pickDailyPolls, postDailyQuiz, postedToday, promoFor } from "@/lib/telegramMcq";

export const maxDuration = 60;

/**
 * Daily Telegram quiz (Vercel Cron, see vercel.json; or an admin by hand):
 *   GET with the cron secret           → posts today's 7 quiz polls + promo (once a day)
 *   GET as admin ?preview=1            → shows what would be posted, posts nothing
 *   GET as admin ?send=1               → posts now (still once a day)
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const isCron = !!secret && request.headers.get("authorization") === `Bearer ${secret}`;
  const preview = request.nextUrl.searchParams.get("preview") === "1";
  const send = request.nextUrl.searchParams.get("send") === "1";
  if (!isCron) {
    const auth = await requireAdmin();
    if ("response" in auth) return auth.response;
    if (!preview && !send) return NextResponse.json({ error: "Add ?preview=1 or ?send=1" }, { status: 400 });
  }

  try {
    if (!preview && (await postedToday())) {
      return NextResponse.json({ ok: true, skipped: "Today's quiz was already posted" });
    }
    const { polls, remaining } = await pickDailyPolls();
    if (preview) return NextResponse.json({ polls, promo: promoFor(new Date()), unusedLeft: remaining });
    if (polls.length === 0) return NextResponse.json({ error: "No unused questions left" }, { status: 409 });
    const sent = await postDailyQuiz(polls);
    return NextResponse.json({ ok: true, sent, unusedLeft: remaining });
  } catch (err) {
    console.error("[telegram-mcq] failed:", err);
    return NextResponse.json({ error: String(err instanceof Error ? err.message : err) }, { status: 500 });
  }
}
