/**
 * Heuristic checks for one question-bank row, shared by the audit
 * (scripts/audit-question-bank.mts) and the per-test review export
 * (scripts/export-tests-for-review.mts). A flag means "look at this", not
 * "wrong".
 */
import { numbersIn, splitOption, str, DEV } from "./question-bank-common.mjs";

export type Row = Record<string, unknown>;
export type Check = { id: string; weight: number; label: string };

export const CHECKS: Record<string, Check> = {
  filler: { id: "filler", weight: 5, label: "Template / filler text" },
  optionInStem: { id: "optionInStem", weight: 5, label: "Option text pasted into the question (e.g. '… is Both I and II.')" },
  missingStatements: { id: "missingStatements", weight: 5, label: "Statements / list items missing from the question" },
  hindiMissingStatements: { id: "hindiMissingStatements", weight: 4, label: "Hindi question has fewer statements than the English" },
  nearDup: { id: "nearDup", weight: 5, label: "Two statements say almost the same thing" },
  countMismatch: { id: "countMismatch", weight: 5, label: "Options refer to a statement the question doesn't have" },
  dupOptions: { id: "dupOptions", weight: 5, label: "Two options are identical" },
  emptyOption: { id: "emptyOption", weight: 5, label: "Empty option" },
  explainContradicts: { id: "explainContradicts", weight: 5, label: "Explanation names a different answer" },
  statementVerdict: { id: "statementVerdict", weight: 5, label: "Explanation's verdict on a statement doesn't match the answer key" },
  hedge: { id: "hedge", weight: 3, label: "Hedged / unverified wording (reportedly, allegedly…)" },
  aiModel: { id: "aiModel", weight: 3, label: "Mentions an AI model / chatbot (check relevance and facts)" },
  vague: { id: "vague", weight: 2, label: "Vague, fact-free statement" },
  numMismatch: { id: "numMismatch", weight: 2, label: "Numbers differ between English and Hindi" },
  untranslated: { id: "untranslated", weight: 2, label: "Hindi text is mostly English" },
  noExplanation: { id: "noExplanation", weight: 1, label: "No explanation" },
  dupQuestion: { id: "dupQuestion", weight: 2, label: "Same question text as another question" },
  shortStem: { id: "shortStem", weight: 1, label: "Very short question" },
  basic: { id: "basic", weight: 1, label: "Basic one-line recall (Easy) — below exam standard?" },
};

const FILLER = [
  /\(\s*item\s*#\s*\d+\s*\)/i,
  /represents a core [a-z\s-]*principle/i,
  /verified in competitive examination/i,
  /\bas per (?:the )?(?:standard )?syllabus\b/i,
  /\bkey concept (?:in|for) (?:the )?(?:exam|competitive)/i,
  /\bfrequently asked in (?:competitive )?exam/i,
  /lorem ipsum|placeholder|\bTBD\b|\bTODO\b|\[insert/i,
];
const HEDGE = /\b(reportedly|allegedly|is believed to|is said to|may have|might have|rumou?red|unconfirmed|supposedly)\b/i;
const AI_MODEL = /\b(claude|chatgpt|gpt-?\d|gemini|openai|anthropic|copilot|llama|large language model)\b/i;
const VAGUE =
  /\b(plays? an? (?:crucial|important|significant|vital|key) role|is (?:very )?important for|is a key aspect|is significant in many ways|has great significance|is widely recognized as important)\b/i;
const ANSWER_IN_EXPLANATION = /(?:correct answer|answer is|answer:|उत्तर)\s*(?:is\s*)?(?:option\s*)?\(?\s*([A-D])\s*\)?(?![a-z]|\s*[-–:]\s*\d)/i;

/** Statements "1. …", "2. …" or "I. …", "II. …" found in a question. */
export function statementsOf(text: string): string[] {
  const t = text.replace(/\s+/g, " ");
  const arabic = t.split(/(?:^|\s)(?=[1-9][.)]\s)/).filter((p) => /^[1-9][.)]\s/.test(p));
  if (arabic.length >= 2) return arabic.map((p) => p.replace(/^[1-9][.)]\s*/, ""));
  const roman = t.split(/(?:^|\s)(?=(?:I|II|III|IV|V|VI)[.)]\s)/).filter((p) => /^(?:I|II|III|IV|V|VI)[.)]\s/.test(p));
  return roman.length >= 2 ? roman.map((p) => p.replace(/^[IVX]+[.)]\s*/, "")) : [];
}

const words = (s: string) =>
  new Set(
    s
      .toLowerCase()
      .replace(/[^a-z0-9ऀ-ॿ\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2),
  );
function similarity(a: string, b: string): number {
  const A = words(a);
  const B = words(b);
  if (!A.size || !B.size) return 0;
  let inter = 0;
  for (const w of A) if (B.has(w)) inter++;
  return inter / Math.min(A.size, B.size);
}

const ROMAN: Record<string, number> = { I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6 };
/** Statement numbers an option names ("1 and 3 only" -> {1, 3}; "Neither 1 nor 2" -> {}). */
function statementNumbers(option: string): Set<number> {
  if (/\b(neither|none)\b/i.test(option)) return new Set();
  const out = new Set<number>();
  for (const m of option.matchAll(/\b([1-9])\b/g)) out.add(Number(m[1]));
  for (const m of option.matchAll(/\b(I{1,3}|IV|V|VI)\b/g)) out.add(ROMAN[m[1]] ?? 0);
  out.delete(0);
  return out;
}
/** Highest statement number any option refers to ("1, 2 and 3 only" -> 3). */
function highestReferenced(options: string[]): number {
  return Math.max(0, ...options.flatMap((o) => [...statementNumbers(o)]));
}

// "1 only", "1 and 2 only", "Both 1 and 2", "Neither 1 nor 2", "1, 2 and 3", "All of the above"
const STATEMENT_OPTION =
  /^\s*(?:(?:only|both|neither|all)\b.*\b(?:[1-9]|I{1,3}|IV)|(?:[1-9]|I{1,3}|IV)(?:\s*(?:,|and|&|nor)\s*(?:[1-9]|I{1,3}|IV))+(?:\s+only)?|(?:[1-9]|I{1,3}|IV)\s+only)\s*\.?\s*$/i;
const STATEMENT_STEM =
  /consider the following|following statements?|statements? given (?:above|below)|given statements|above statements|statements? (?:is|are) (?:correct|incorrect|true|false)|निम्नलिखित कथन|उपर्युक्त कथन/i;
const MATCH_STEM = /\bmatch\b|list[\s-]*i\b|सुमेलित|सुमेल/i;
const PAIRS_STEM = /following pairs|pairs given|correctly matched|युग्म/i;
/** "A. …", "(a) …", "a) …" items, as in List-I of a match question. */
const letterItems = (t: string) => (t.match(/(?:^|\s)\(?[A-Da-d][.)]\s/g) ?? []).length;

// "Statement 2 is incorrect", "Statement II is not correct", "statement 1 is true"
const VERDICT =
  /statement\s*(?:no\.?\s*)?([1-9]|I{1,3}|IV)\s*(?:\([^)]*\)\s*)?(?:is|was)\s+(not\s+)?(correct|incorrect|true|false|wrong|right|accurate|inaccurate)\b/gi;

export type CheckResult = { found: string[]; notes: string[]; en: string; hi: string; opts: { en: string; hi: string }[]; ans: string; exEn: string };

export function checkQuestion(r: Row): CheckResult {
  const en = str(r["Question (English)"]);
  const hi = str(r["Question (Hindi)"]);
  const opts = ["A", "B", "C", "D"].map((l) => splitOption(str(r[`Option_${l}`])));
  const ans = str(r["Correct_Answer"]).toUpperCase();
  const exEn = str(r["Explanation (updated)"]);
  const qtype = str(r["Question_Type"]);
  const diff = str(r["Difficulty"]);
  const found: string[] = [];
  const notes: string[] = [];
  const all = [en, ...opts.map((o) => o.en)].join(" \n ");

  if (FILLER.some((re) => re.test(all))) found.push("filler");
  // A statement ending in an option ("…stationed in a halo orbit around the Both I and II.")
  if (/\b(?:is|in|of|at|the|a|an|by|to|from|around|have|has|was|are)\s+(?:both|neither)\s+(?:I|1)\s+(?:and|nor)\s+(?:II|2)\b/i.test(en))
    found.push("optionInStem");

  // "Match List-I with List-II" items are pairs, not statements to compare.
  const isMatch = MATCH_STEM.test(en);
  const st = isMatch ? [] : statementsOf(en);
  for (let i = 0; i < st.length; i++)
    for (let j = i + 1; j < st.length; j++) {
      const sim = similarity(st[i], st[j]);
      if (sim >= 0.8) {
        found.push("nearDup");
        notes.push(`statements ${i + 1} and ${j + 1} are ${Math.round(sim * 100)}% the same words`);
      }
    }

  const statementOptions = opts.filter((o) => STATEMENT_OPTION.test(o.en)).length >= 2;
  if (st.length >= 2) {
    const ref = highestReferenced(opts.map((o) => o.en));
    const looksLikeStatementOptions = opts.some((o) => /\bonly\b|\bboth\b|\bneither\b|\band\b/i.test(o.en));
    if (looksLikeStatementOptions && ref > st.length) {
      found.push("countMismatch");
      notes.push(`options mention statement ${ref}, question has ${st.length}`);
    }
  }

  // Statements / list items the stem announces (or the options count on) but doesn't contain.
  const allStatements = statementsOf(en);
  if (isMatch) {
    if (letterItems(en) < 2 && allStatements.length < 2) {
      found.push("missingStatements");
      notes.push("match question without List-I / List-II items");
    }
  } else if (allStatements.length < 2 && (STATEMENT_STEM.test(en) || PAIRS_STEM.test(en) || statementOptions)) {
    // a single-statement "Consider the following statement: …" with true/false style options is fine
    const single = /following statement\b(?!s)/i.test(en) && !statementOptions;
    if (!single) {
      found.push("missingStatements");
      notes.push(
        allStatements.length === 1 || /\b1[.)]\s/.test(en)
          ? "only one numbered statement in the question"
          : "no numbered statements in the question",
      );
    }
  }
  if (!isMatch && hi && allStatements.length >= 2) {
    const hiCount = statementsOf(hi).length;
    if (hiCount < allStatements.length) {
      found.push("hindiMissingStatements");
      notes.push(`English has ${allStatements.length} statements, Hindi ${hiCount}`);
    }
  }

  const optTexts = opts.map((o) => o.en.toLowerCase().replace(/\s+/g, " "));
  if (optTexts.some((o) => !o)) found.push("emptyOption");
  if (new Set(optTexts.filter(Boolean)).size < optTexts.filter(Boolean).length) found.push("dupOptions");

  const named = exEn.match(ANSWER_IN_EXPLANATION)?.[1]?.toUpperCase();
  if (named && ["A", "B", "C", "D"].includes(ans) && named !== ans) {
    found.push("explainContradicts");
    notes.push(`explanation says ${named}, key says ${ans}`);
  }

  // The explanation calls statement N correct/incorrect, but the keyed option says otherwise.
  const keyed = opts["ABCD".indexOf(ans)]?.en ?? "";
  if (st.length >= 2 && statementOptions && STATEMENT_OPTION.test(keyed) && !/\ball\b/i.test(keyed)) {
    const asksIncorrect = /\b(?:incorrect|not correct|false|wrong|not true)\b/i.test(en) || /\bNOT\b/.test(en);
    const picked = statementNumbers(keyed);
    for (const m of exEn.matchAll(VERDICT)) {
      const n = /^\d$/.test(m[1]) ? Number(m[1]) : ROMAN[m[1].toUpperCase()] ?? 0;
      if (!n || n > st.length) continue;
      const isTrue = /^(correct|true|right|accurate)$/i.test(m[3]) !== !!m[2];
      const shouldBePicked = asksIncorrect ? !isTrue : isTrue;
      if (picked.has(n) !== shouldBePicked) {
        found.push("statementVerdict");
        notes.push(`explanation: "${m[0].trim()}", but key ${ans} ("${keyed}") ${picked.has(n) ? "includes" : "leaves out"} statement ${n}`);
        break;
      }
    }
  }

  if (HEDGE.test(all)) found.push("hedge");
  if (AI_MODEL.test(all)) found.push("aiModel");
  if (st.some((s) => VAGUE.test(s)) || VAGUE.test(en)) found.push("vague");

  if (hi && numbersIn(en) !== numbersIn(hi)) {
    found.push("numMismatch");
    notes.push(`EN numbers [${numbersIn(en)}] vs HI [${numbersIn(hi)}]`);
  }
  const latin = (hi.match(/[A-Za-z]/g) ?? []).length;
  const dev = (hi.match(new RegExp(DEV.source, "g")) ?? []).length;
  if (hi && latin > 40 && latin > dev) found.push("untranslated");

  if (!exEn) found.push("noExplanation");
  if (en && en.length < 25) found.push("shortStem");
  if (diff === "Easy" && /^Factual recall/.test(qtype) && en.length < 110 && allStatements.length < 2) found.push("basic");

  return { found: [...new Set(found)], notes, en, hi, opts, ans, exEn };
}

// ---------- the same fact asked twice ----------

// boilerplate of statement / match stems, so only the substance is compared
const TEMPLATE_WORDS = new Set(
  "consider following statements statement which given above correct incorrect only both neither select answer using codes below match list with from these those regarding about among what that this there their pairs pair correctly matched".split(
    " ",
  ),
);
export const factWords = (s: string) =>
  new Set(
    s
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3 && !TEMPLATE_WORDS.has(w)),
  );
/** Same correct answer and heavily overlapping wording (the loader's rule for a repeat). */
export function sameFact(a: { answer: string; words: Set<string> }, b: { answer: string; words: Set<string> }): boolean {
  if (a.answer !== b.answer) return false;
  let inter = 0;
  a.words.forEach((w) => b.words.has(w) && inter++);
  return inter / (a.words.size + b.words.size - inter || 1) >= 0.4;
}
