import type { Answers, Confidence, Confidences, ErrorTags, ErrorType, FullQuestion, Test } from "./tests";

type Marking = Pick<Test, "marks_per_question" | "negative_marking_enabled" | "negative_marking_value">;

const round2 = (n: number) => Math.round(n * 100) / 100;
const penaltyOf = (t: Marking) => (t.negative_marking_enabled ? t.marks_per_question * t.negative_marking_value : 0);

export type AttemptStrategy = {
  total: number;
  attempted: number;
  attemptedPct: number;
  correct: number;
  wrong: number;
  accuracy: number | null;
  marksGained: number;
  negativeLost: number;
  net: number;
};

/** How many were attempted, and what the wrong ones cost. */
export function attemptStrategy(questions: FullQuestion[], answers: Answers, test: Marking): AttemptStrategy {
  let correct = 0;
  let wrong = 0;
  for (const q of questions) {
    const a = answers[q.id];
    if (!a) continue;
    if (a === q.correct_answer) correct++;
    else wrong++;
  }
  const attempted = correct + wrong;
  const marksGained = round2(correct * test.marks_per_question);
  const negativeLost = round2(wrong * penaltyOf(test));
  return {
    total: questions.length,
    attempted,
    attemptedPct: questions.length ? Math.round((attempted / questions.length) * 100) : 0,
    correct,
    wrong,
    accuracy: attempted ? round2((correct / attempted) * 100) : null,
    marksGained,
    negativeLost,
    net: round2(marksGained - negativeLost),
  };
}

export const CONFIDENCE_LABEL: Record<Confidence | "untagged", string> = {
  sure: "पक्का / Sure",
  elim2: "2 हटाए / Ruled out 2",
  elim1: "1 हटाया / Ruled out 1",
  guess: "अंदाज़ा / Guess",
  untagged: "टैग नहीं / Not tagged",
};

export type GuessBucket = {
  level: Confidence | "untagged";
  attempted: number;
  correct: number;
  accuracy: number | null;
  net: number; // marks this bucket added, after negative marking
};

export type GuessAnalysis = { buckets: GuessBucket[]; breakEvenAccuracy: number; tagged: number };

/**
 * Accuracy and net marks by how sure the student was. With negative marking
 * a bucket is worth attempting only above the break-even accuracy
 * (penalty / (marks + penalty) — 24.8% for UKPSC's 1/3 rule).
 */
export function guessAnalysis(
  items: { question: FullQuestion; answers: Answers; confidence: Confidences; test: Marking }[]
): GuessAnalysis {
  const order: (Confidence | "untagged")[] = ["sure", "elim2", "elim1", "guess", "untagged"];
  const map = new Map(order.map((l) => [l, { level: l, attempted: 0, correct: 0, accuracy: null, net: 0 } as GuessBucket]));
  let tagged = 0;
  let marks = 1;
  let penalty = 0.33;

  for (const { question: q, answers, confidence, test } of items) {
    const a = answers[q.id];
    if (!a) continue;
    marks = test.marks_per_question;
    penalty = penaltyOf(test);
    const level: Confidence | "untagged" = (confidence[q.id] as Confidence | undefined) ?? "untagged";
    if (level !== "untagged") tagged++;
    const b = map.get(level)!;
    b.attempted++;
    if (a === q.correct_answer) {
      b.correct++;
      b.net += test.marks_per_question;
    } else {
      b.net -= penaltyOf(test);
    }
  }

  const buckets = order.map((l) => {
    const b = map.get(l)!;
    return { ...b, net: round2(b.net), accuracy: b.attempted ? round2((b.correct / b.attempted) * 100) : null };
  });
  return { buckets, breakEvenAccuracy: round2((penalty / (marks + penalty || 1)) * 100), tagged };
}

/** A plain-language rule from the student's own guess data. */
export function guessRule(g: GuessAnalysis, minSample = 5): { hi: string; en: string } | null {
  const by = new Map(g.buckets.map((b) => [b.level, b]));
  const ok = (l: Confidence) => {
    const b = by.get(l)!;
    return b.attempted >= minSample ? (b.accuracy ?? 0) > g.breakEvenAccuracy : null;
  };
  const e2 = ok("elim2");
  const e1 = ok("elim1");
  const gu = ok("guess");
  if (e2 === null && e1 === null && gu === null) return null;

  if (gu === true) return { hi: "आपके अंदाज़े भी फ़ायदेमंद रहे हैं — पर सावधानी रखें।", en: "Even your blind guesses have paid off so far — keep an eye on it." };
  if (e1 === true) return { hi: "1 विकल्प हटा सकें तो प्रयास करें; पूरे अंदाज़े से बचें।", en: "Attempt when you can rule out at least 1 option; skip blind guesses." };
  if (e2 === true) return { hi: "केवल तब प्रयास करें जब 2 विकल्प हटा सकें।", en: "Attempt only when you can rule out 2 options." };
  return { hi: "अनिश्चित प्रश्न छोड़ दें — अभी वे अंक घटा रहे हैं।", en: "Skip questions you're unsure of — right now they cost you marks." };
}

export const ERROR_LABEL: Record<ErrorType, { hi: string; en: string; fix: string }> = {
  concept: { hi: "अवधारणा", en: "Concept gap", fix: "Re-study the topic, then do 10 practice questions on it." },
  recall: { hi: "तथ्य याद नहीं", en: "Factual recall", fix: "Add it to spaced revision (day 1, 7, 21)." },
  misread: { hi: "गलत पढ़ा", en: "Misread", fix: "Underline 'not / incorrect / only' words before answering." },
  silly: { hi: "लापरवाही", en: "Silly mistake", fix: "Re-check marked answers in the last 5 minutes." },
  time: { hi: "समय कम", en: "Time pressure", fix: "Practise section-wise timing; skip and return to long questions." },
};

export function errorBreakdown(tags: ErrorTags[]): Record<ErrorType, number> {
  const out: Record<ErrorType, number> = { concept: 0, recall: 0, misread: 0, silly: 0, time: 0 };
  for (const t of tags) for (const v of Object.values(t)) out[v]++;
  return out;
}
