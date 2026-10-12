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

/** The closing message after the daily polls (Telegram legacy Markdown: *bold*). */
const PROMO = [
  "🎯 *Choose your plan for UKPSC Prelims (29 Nov)*",
  "",
  "📚 *Weak in Uttarakhand GK or National GS?* Pick the crash course you need — Uttarakhand, National or the full Crash Course — with detailed notes and quick, complete revision PDFs.",
  "",
  "🏆 *Want it all?* The *Complete Prelims Pack* = full Crash Course + aligned Test Series, covering the whole Prelims syllabus.",
  "👉 Courses: https://www.ukpscdecoded.in/courses",
  "",
  "📝 *Only need tests?* Take the *Premium Test Series* — it includes every test: full mocks, sectional, Uttarakhand, current affairs and CSAT.",
  "👉 Test series: https://www.ukpscdecoded.in/test-series",
].join("\n");

export function promoFor(_date?: Date): string {
  return PROMO;
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
    text: `🧠 *Daily UKPSC MCQ Challenge — ${date}*\n${polls.length} questions for Upper & Lower PCS. Tap your answer, then see the explanation 👇`,
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
