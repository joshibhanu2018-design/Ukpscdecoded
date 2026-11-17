import { supabaseAdmin } from "./supabase";

/**
 * Daily Telegram quiz: 7 question-bank questions that are in no test and were
 * never posted (view telegram_unused_questions, supabase/schema-phase34), sent
 * to the channel as Telegram quiz polls, then a short promo message.
 * Env: TELEGRAM_BOT_TOKEN (BotFather, secret), TELEGRAM_CHANNEL_ID (e.g. @UKPSCDECODED).
 */
export const DAILY_COUNT = 7;

type Row = {
  id: string;
  subject: string | null;
  question_text_english: string | null;
  question_text_hindi: string | null;
  option_a_english: string | null;
  option_b_english: string | null;
  option_c_english: string | null;
  option_d_english: string | null;
  option_a_hindi: string | null;
  option_b_hindi: string | null;
  option_c_hindi: string | null;
  option_d_hindi: string | null;
  correct_answer: string | null;
  explanation_english: string | null;
  explanation_hindi: string | null;
};

export type QuizPoll = { questionId: string; subject: string; question: string; options: string[]; correct: number; explanation?: string };

// Telegram limits: question 300, option 100, explanation 200 characters.
const Q_MAX = 300;
const OPT_MAX = 100;
const EXPL_MAX = 200;

const clean = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, " ").trim();

function bilingual(en: string, hi: string, max: number, sep: string): string | null {
  const both = hi && hi !== en ? `${en}${sep}${hi}` : en;
  if (both && both.length <= max) return both;
  if (en && en.length <= max) return en;
  return null;
}

/** A question as a Telegram quiz poll, or null when it can't fit Telegram's limits. */
export function toPoll(r: Row, n: number): QuizPoll | null {
  const correct = "ABCD".indexOf(clean(r.correct_answer).toUpperCase());
  if (correct < 0) return null;
  const qEn = clean(r.question_text_english);
  if (!qEn) return null;
  const question = bilingual(`Q${n}. ${qEn}`, clean(r.question_text_hindi), Q_MAX, "\n");
  if (!question) return null;
  const pairs: [string | null, string | null][] = [
    [r.option_a_english, r.option_a_hindi],
    [r.option_b_english, r.option_b_hindi],
    [r.option_c_english, r.option_c_hindi],
    [r.option_d_english, r.option_d_hindi],
  ];
  const options: string[] = [];
  for (const [en, hi] of pairs) {
    const opt = bilingual(clean(en), clean(hi), OPT_MAX, " / ");
    if (!opt) return null;
    options.push(opt);
  }
  if (new Set(options).size !== 4) return null;
  const ex = clean(r.explanation_english) || clean(r.explanation_hindi);
  const explanation = ex ? (ex.length > EXPL_MAX ? `${ex.slice(0, EXPL_MAX - 1)}…` : ex) : undefined;
  return { questionId: r.id, subject: clean(r.subject) || "GS", question, options, correct, explanation };
}

/** Picks today's polls: random unused questions that fit, spread across subjects. */
export async function pickDailyPolls(count = DAILY_COUNT): Promise<{ polls: QuizPoll[]; remaining: number }> {
  const { data, error, count: total } = await supabaseAdmin()
    .from("telegram_unused_questions")
    .select("*", { count: "exact" })
    .limit(600);
  if (error) throw new Error(`telegram_unused_questions: ${error.message}. Has supabase/schema-phase34-telegram-daily-mcq.sql been run?`);
  const rows = ((data ?? []) as Row[]).sort(() => Math.random() - 0.5);

  const polls: QuizPoll[] = [];
  const perSubject = new Map<string, number>();
  // Two passes: first at most 2 per subject for variety, then fill up.
  for (const cap of [2, Infinity]) {
    for (const r of rows) {
      if (polls.length >= count) break;
      if (polls.some((p) => p.questionId === r.id)) continue;
      const subject = clean(r.subject) || "GS";
      if ((perSubject.get(subject) ?? 0) >= cap) continue;
      const poll = toPoll(r, polls.length + 1);
      if (!poll) continue;
      polls.push(poll);
      perSubject.set(subject, (perSubject.get(subject) ?? 0) + 1);
    }
  }
  return { polls, remaining: Math.max(0, (total ?? rows.length) - polls.length) };
}

// Exam dates (owner-given). The promo switches on REVISION_PROMO_ENDS.
const UPPER_PCS_PRELIMS = "2026-11-29";
const LOWER_PCS_PRELIMS = "2026-12-27";
const TRI_EXAM = "2027-01-15";
/** Last day (IST) the promo pushes the Revision Test Series; from the next day it is Lower PCS + TRI. */
const REVISION_PROMO_ENDS = "2026-11-25";

const SITE = "https://www.ukpscdecoded.in";
const REVISION = `👉 Revision Test Series: ${SITE}/revision`;
const LOWER_TS = `👉 Lower PCS Test Series: ${SITE}/courses/lower-pcs-test-series`;
const LOWER = `👉 Lower PCS courses + free mock: ${SITE}/lower-pcs`;
const TRI = `👉 TRI courses: ${SITE}/tri`;

/** Today's date in IST, YYYY-MM-DD. */
function istDay(now: Date): string {
  return new Date(now.getTime() + 5.5 * 3_600_000).toISOString().slice(0, 10);
}

/** Whole days from today (IST) to an exam date, never negative. */
function daysTo(exam: string, now = new Date()): number {
  return Math.max(0, Math.round((Date.parse(exam) - Date.parse(istDay(now))) / 86_400_000));
}

const dayWord = (n: number) => (n === 1 ? "1 day" : `${n} days`);

/** The intro line's exam countdown: Upper + Lower PCS until 29 Nov, then Lower PCS + TRI, then TRI. */
export function countdownLine(now: Date): string {
  const today = istDay(now);
  if (today <= UPPER_PCS_PRELIMS) {
    return `For *Upper PCS Prelims (29 Nov)* & *Lower PCS (27 Dec)* · ${dayWord(daysTo(UPPER_PCS_PRELIMS, now))} to Upper PCS.`;
  }
  if (today <= LOWER_PCS_PRELIMS) {
    return `For *Lower PCS (27 Dec)* & *TRI (15 Jan)* · ${dayWord(daysTo(LOWER_PCS_PRELIMS, now))} to Lower PCS.`;
  }
  if (today <= TRI_EXAM) return `For *TRI (15 Jan)* & *RO/ARO* · ${dayWord(daysTo(TRI_EXAM, now))} to TRI.`;
  return "For every UKPSC exam: Upper PCS, Lower PCS, RO/ARO & TRI.";
}

/**
 * Closing messages after the daily polls, with real countdowns (no invented scarcity).
 * Till REVISION_PROMO_ENDS: Revision Test Series (Upper PCS last-week revision) + Lower PCS Test Series.
 * After it: Lower PCS + TRI. Telegram legacy Markdown: *bold*.
 */
function promos(now: Date): string[] {
  const upper = dayWord(daysTo(UPPER_PCS_PRELIMS, now));
  const lower = dayWord(daysTo(LOWER_PCS_PRELIMS, now));
  const tri = dayWord(daysTo(TRI_EXAM, now));
  if (istDay(now) <= REVISION_PROMO_ENDS) {
    return [
      [
        `⏳ *${upper} left for Upper PCS Prelims (29 Nov).* This is revision time, not new-topic time.`,
        "🔁 *Revision Test Series*: full mocks + Uttarakhand GK and current affairs revision tests, made for the last weeks.",
        REVISION,
        "",
        `📅 Lower PCS is on *27 Dec* (${lower} away). Start its practice early with the *Lower PCS Test Series*: full mocks on the new pattern (100 GS + 50 aptitude) and CSAT sectionals.`,
        LOWER_TS,
      ],
      [
        "🤔 *Got some of today's questions wrong?* Better here than in the exam hall.",
        `With *${upper} left* for Upper PCS, every revision test now is one less surprise on 29 Nov.`,
        REVISION,
        "",
        "📝 Writing Lower PCS too? The *Lower PCS Test Series* has the exact Lower PCS pattern, aptitude included. Try the *free Lower PCS mock* (150 Q, 2 h) first:",
        LOWER,
      ],
      [
        `🔥 *${upper} to Upper PCS, ${lower} to Lower PCS.*`,
        "✅ Uttarakhand GK revised? ✅ Current affairs revised? ✅ Full mocks done?",
        "If any box is empty, the *Revision Test Series* closes the gap:",
        REVISION,
        "",
        "Then keep going for 27 Dec with the *Lower PCS Test Series*:",
        LOWER_TS,
      ],
    ].map((lines) => lines.join("\n"));
  }
  if (istDay(now) > LOWER_PCS_PRELIMS) {
    // After Lower PCS: TRI, and Lower PCS courses stay valid for RO/ARO.
    return [
      [
        `🎯 *TRI exam: 15 Jan (${tri} left).* Courses and tests for TRI:`,
        TRI,
        "",
        "📅 Preparing for *RO/ARO*? Its prelims syllabus is the same as Lower PCS, and our Lower PCS courses stay valid for it:",
        LOWER,
      ],
      [
        "🤔 *Got some of today's questions wrong?* Practise on the real pattern before the exam, not in it.",
        `TRI is on *15 Jan* (${tri} left):`,
        TRI,
        "",
        "📚 RO/ARO next? Lower PCS courses + free mock:",
        LOWER,
      ],
    ].map((lines) => lines.join("\n"));
  }
  return [
    [
      `📅 *Lower PCS: 27 Dec (${lower} left). TRI: 15 Jan (${tri} left).*`,
      "Lower PCS is one paper: 100 GS + 50 aptitude. Uttarakhand GK and aptitude decide the merit.",
      "",
      "📚 Lower PCS Crash Course, Test Series and Complete Pack (valid for RO/ARO too), plus a *free Lower PCS mock*:",
      LOWER,
      "🎯 Writing TRI as well? TRI courses and tests:",
      TRI,
    ],
    [
      "🤔 *Got some of today's questions wrong?* That's exactly what full mocks fix before the exam.",
      `With *${lower} left* for Lower PCS, practise on the real pattern: 10 full-length tests + CSAT sectionals.`,
      LOWER_TS,
      "",
      `🎯 TRI on *15 Jan* (${tri} left):`,
      TRI,
    ],
    [
      `🔥 *${lower} to Lower PCS. Where do you stand?*`,
      "✅ Uttarakhand GK done? ✅ Aptitude (reasoning + maths) practised? ✅ Full mocks taken?",
      "Start with the *free Lower PCS mock* (150 Q, 2 h) and see your level:",
      LOWER,
      "",
      `📝 TRI (15 Jan, ${tri} left):`,
      TRI,
    ],
  ].map((lines) => lines.join("\n"));
}

/** Today's closing message (rotates daily). */
export function promoFor(date: Date = new Date()): string {
  const list = promos(date);
  const day = Math.floor((date.getTime() + 5.5 * 3_600_000) / 86_400_000);
  return list[day % list.length];
}

async function telegram(method: string, body: Record<string, unknown>): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN is not set");
  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = (await res.json().catch(() => ({}))) as { ok?: boolean; description?: string };
  if (!res.ok || !json.ok) throw new Error(`Telegram ${method}: ${json.description ?? res.status}`);
}

/** Posts today's intro, polls and promo; records each posted question. Returns how many polls went out. */
export async function postDailyQuiz(polls: QuizPoll[], now = new Date()): Promise<number> {
  const chat_id = process.env.TELEGRAM_CHANNEL_ID?.trim();
  if (!chat_id) throw new Error("TELEGRAM_CHANNEL_ID is not set");
  const date = now.toLocaleDateString("en-IN", { day: "numeric", month: "long", timeZone: "Asia/Kolkata" });
  await telegram("sendMessage", {
    chat_id,
    text: `🧠 *Daily UKPSC MCQ Challenge — ${date}*\n${countdownLine(now)}\n${polls.length} questions — tap your answer, then see the explanation 👇`,
    parse_mode: "Markdown",
  });
  const db = supabaseAdmin();
  let sent = 0;
  for (const p of polls) {
    await telegram("sendPoll", {
      chat_id,
      question: p.question,
      options: p.options.map((text) => ({ text })),
      type: "quiz",
      correct_option_id: p.correct,
      is_anonymous: true,
      ...(p.explanation ? { explanation: p.explanation } : {}),
    });
    await db.from("telegram_posted_questions").upsert({ question_id: p.questionId }, { onConflict: "question_id" });
    sent++;
  }
  await telegram("sendMessage", { chat_id, text: promoFor(now), parse_mode: "Markdown", disable_web_page_preview: false });
  return sent;
}

/** Whether today's quiz (IST) already went out — Vercel can retry a cron. */
export async function postedToday(now = new Date()): Promise<boolean> {
  const istMidnight = new Date(now.getTime() + 5.5 * 3_600_000);
  istMidnight.setUTCHours(0, 0, 0, 0);
  const since = new Date(istMidnight.getTime() - 5.5 * 3_600_000).toISOString();
  const { count } = await supabaseAdmin()
    .from("telegram_posted_questions")
    .select("question_id", { count: "exact", head: true })
    .gte("posted_at", since);
  return (count ?? 0) >= DAILY_COUNT;
}
