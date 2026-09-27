/**
 * Question bank audit — READ ONLY. Scans the question workbooks for signs of
 * a badly generated question and writes a review sheet; changes nothing in
 * the files or the database.
 *
 *   cd website
 *   npx --yes tsx scripts/audit-question-bank.mts
 *
 * Output: "../test series questions/QUESTION_AUDIT.xlsx"
 *   Flagged — one row per suspicious question, questions used in live tests
 *             first, then by severity. Fix the row in the workbook (or add a
 *             Review_Flag to drop it) and re-run the loader.
 *   Summary — counts per check and per section.
 *
 * If .env.local has Supabase credentials, the live tests are read (read-only)
 * so each row shows which tests use the question; otherwise that column is
 * blank. The checks are heuristics: a flag means "look at this", not "wrong".
 */
import * as fs from "fs";
import * as path from "path";
import { createRequire } from "module";
import { createClient } from "@supabase/supabase-js";
import { numbersIn, splitOption, str, DEV } from "./question-bank-common.mjs";

const XLSX: typeof import("xlsx") = createRequire(import.meta.url)("xlsx");

const WEBSITE = fs.existsSync(path.join(process.cwd(), "scripts", "audit-question-bank.mts"))
  ? process.cwd()
  : path.join(process.cwd(), "website");
const DATA_DIR = path.join(WEBSITE, "..", "test series questions");
const OUT_FILE = path.join(DATA_DIR, "QUESTION_AUDIT.xlsx");
const SOURCES = [
  { file: "MERGED_QUESTION_BANK_v2.xlsx", sheet: "Question Bank", label: "master" },
  { file: "GENERATED_QUESTIONS.xlsx", sheet: "Generated Questions", label: "GEN (AI-generated)" },
  { file: "COMBINED_QUESTIONS.xlsx", sheet: "Combined Questions", label: "CMB (combined)" },
];

type Row = Record<string, unknown>;
type Check = { id: string; weight: number; label: string };

// ---------- checks ----------

const CHECKS: Record<string, Check> = {
  filler: { id: "filler", weight: 5, label: "Template / filler text" },
  optionInStem: { id: "optionInStem", weight: 5, label: "Option text pasted into the question (e.g. '… is Both I and II.')" },
  nearDup: { id: "nearDup", weight: 5, label: "Two statements say almost the same thing" },
  countMismatch: { id: "countMismatch", weight: 5, label: "Options refer to a statement the question doesn't have" },
  dupOptions: { id: "dupOptions", weight: 5, label: "Two options are identical" },
  emptyOption: { id: "emptyOption", weight: 5, label: "Empty option" },
  explainContradicts: { id: "explainContradicts", weight: 5, label: "Explanation names a different answer" },
  hedge: { id: "hedge", weight: 3, label: "Hedged / unverified wording (reportedly, allegedly…)" },
  aiModel: { id: "aiModel", weight: 3, label: "Mentions an AI model / chatbot (check relevance and facts)" },
  vague: { id: "vague", weight: 2, label: "Vague, fact-free statement" },
  numMismatch: { id: "numMismatch", weight: 2, label: "Numbers differ between English and Hindi" },
  untranslated: { id: "untranslated", weight: 2, label: "Hindi text is mostly English" },
  noExplanation: { id: "noExplanation", weight: 1, label: "No explanation" },
  dupQuestion: { id: "dupQuestion", weight: 2, label: "Same question text as another question" },
  shortStem: { id: "shortStem", weight: 1, label: "Very short question" },
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
function statementsOf(text: string): string[] {
  const t = text.replace(/\s+/g, " ");
  const arabic = t.split(/(?:^|\s)(?=[1-9]\.\s)/).filter((p) => /^[1-9]\.\s/.test(p));
  if (arabic.length >= 2) return arabic.map((p) => p.replace(/^[1-9]\.\s*/, ""));
  const roman = t.split(/(?:^|\s)(?=(?:I|II|III|IV|V|VI)\.\s)/).filter((p) => /^(?:I|II|III|IV|V|VI)\.\s/.test(p));
  return roman.length >= 2 ? roman.map((p) => p.replace(/^[IVX]+\.\s*/, "")) : [];
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
/** Highest statement number any option refers to ("1, 2 and 3 only" -> 3). */
function highestReferenced(options: string[]): number {
  let max = 0;
  for (const o of options) {
    for (const m of o.matchAll(/\b([1-9])\b/g)) max = Math.max(max, Number(m[1]));
    for (const m of o.matchAll(/\b(I{1,3}|IV|V|VI)\b/g)) max = Math.max(max, ROMAN[m[1]] ?? 0);
  }
  return max;
}

function audit(r: Row) {
  const en = str(r["Question (English)"]);
  const hi = str(r["Question (Hindi)"]);
  const opts = ["A", "B", "C", "D"].map((l) => splitOption(str(r[`Option_${l}`])));
  const ans = str(r["Correct_Answer"]).toUpperCase();
  const exEn = str(r["Explanation (updated)"]);
  const found: string[] = [];
  const notes: string[] = [];
  const all = [en, ...opts.map((o) => o.en)].join(" \n ");

  if (FILLER.some((re) => re.test(all))) found.push("filler");
  // A statement ending in an option ("…stationed in a halo orbit around the Both I and II.")
  if (/\b(?:is|in|of|at|the|a|an|by|to|from|around|have|has|was|are)\s+(?:both|neither)\s+(?:I|1)\s+(?:and|nor)\s+(?:II|2)\b/i.test(en))
    found.push("optionInStem");

  // "Match List-I with List-II" items are pairs, not statements to compare.
  const isMatch = /\bmatch\b|list[\s-]*i\b|सुमेलित|सुमेल/i.test(en);
  const st = isMatch ? [] : statementsOf(en);
  for (let i = 0; i < st.length; i++)
    for (let j = i + 1; j < st.length; j++) {
      const sim = similarity(st[i], st[j]);
      if (sim >= 0.8) {
        found.push("nearDup");
        notes.push(`statements ${i + 1} and ${j + 1} are ${Math.round(sim * 100)}% the same words`);
      }
    }
  if (st.length >= 2) {
    const ref = highestReferenced(opts.map((o) => o.en));
    const looksLikeStatementOptions = opts.some((o) => /\bonly\b|\bboth\b|\bneither\b|\band\b/i.test(o.en));
    if (looksLikeStatementOptions && ref > st.length) {
      found.push("countMismatch");
      notes.push(`options mention statement ${ref}, question has ${st.length}`);
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

  return { found: [...new Set(found)], notes, en, opts, ans, exEn };
}

// ---------- live tests (optional, read-only) ----------

async function readTestUsage(): Promise<Map<string, string[]>> {
  const usage = new Map<string, string[]>();
  const envFile = path.join(WEBSITE, ".env.local");
  if (!fs.existsSync(envFile)) return usage;
  const env: Record<string, string> = {};
  for (const line of fs.readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  const url = env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return usage;
  const db = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });

  const { data: tests, error } = await db.from("tests").select("test_name, question_ids");
  if (error) {
    console.warn(`Could not read tests (${error.message}); "Used in tests" will be blank.`);
    return usage;
  }
  const uuids = [...new Set((tests ?? []).flatMap((t) => (t.question_ids as string[] | null) ?? []))];
  const qidOf = new Map<string, string>();
  for (let i = 0; i < uuids.length; i += 200) {
    const { data } = await db.from("questions").select("id, question_id").in("id", uuids.slice(i, i + 200));
    for (const r of data ?? []) qidOf.set(r.id as string, r.question_id as string);
  }
  for (const t of tests ?? []) {
    for (const id of (t.question_ids as string[] | null) ?? []) {
      const qid = qidOf.get(id);
      if (qid) usage.set(qid, [...(usage.get(qid) ?? []), t.test_name as string]);
    }
  }
  return usage;
}

// ---------- run ----------

const usage = await readTestUsage();
const flagged: Record<string, unknown>[] = [];
const perCheck = new Map<string, number>();
const perSection = new Map<string, number>();
const textSeen = new Map<string, string>();
let scanned = 0;

for (const src of SOURCES) {
  const file = path.join(DATA_DIR, src.file);
  if (!fs.existsSync(file)) {
    console.warn(`Skipping ${src.file} (not found)`);
    continue;
  }
  const ws = XLSX.readFile(file).Sheets[src.sheet];
  if (!ws) {
    console.warn(`Skipping ${src.file}: sheet "${src.sheet}" not found`);
    continue;
  }
  for (const r of XLSX.utils.sheet_to_json<Row>(ws, { defval: "" })) {
    const qid = str(r["Question_ID"]);
    if (!qid || str(r["Review_Flag"])) continue;
    scanned++;
    const res = audit(r);

    const norm = res.en.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    if (norm.length > 30) {
      const other = textSeen.get(norm);
      if (other && other !== qid) {
        res.found.push("dupQuestion");
        res.notes.push(`same text as ${other}`);
      } else textSeen.set(norm, qid);
    }
    if (!res.found.length) continue;

    const score = res.found.reduce((n, id) => n + CHECKS[id].weight, 0);
    const tests = usage.get(qid) ?? [];
    const section = str(r["Section_Code"]) || "?";
    for (const id of res.found) perCheck.set(id, (perCheck.get(id) ?? 0) + 1);
    perSection.set(section, (perSection.get(section) ?? 0) + 1);
    flagged.push({
      Question_ID: qid,
      Source: src.label,
      "In live tests": tests.length ? "YES" : usage.size ? "no" : "",
      "Used in tests": tests.join("; "),
      Section: section,
      Chapter: str(r["Chapter/Sub-topic"]),
      Severity: score,
      Problems: res.found.map((id) => CHECKS[id].label).join("; "),
      Details: res.notes.join("; "),
      "Question (English)": res.en,
      "Option A": res.opts[0].en,
      "Option B": res.opts[1].en,
      "Option C": res.opts[2].en,
      "Option D": res.opts[3].en,
      Answer: res.ans,
      Explanation: res.exEn,
    });
  }
}

flagged.sort(
  (a, b) =>
    Number(b["In live tests"] === "YES") - Number(a["In live tests"] === "YES") ||
    (b.Severity as number) - (a.Severity as number),
);

const summary = [
  ...Object.values(CHECKS).map((c) => ({ Check: c.label, Weight: c.weight, Questions: perCheck.get(c.id) ?? 0 })),
  {},
  ...[...perSection.entries()].sort((a, b) => b[1] - a[1]).map(([s, n]) => ({ Check: `Section ${s}`, Questions: n })),
];

const wb = XLSX.utils.book_new();
const sheet = XLSX.utils.json_to_sheet(flagged);
sheet["!cols"] = [14, 16, 8, 30, 8, 24, 8, 40, 40, 80, 24, 24, 24, 24, 7, 60].map((wch) => ({ wch }));
XLSX.utils.book_append_sheet(wb, sheet, "Flagged");
XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(summary), "Summary");
XLSX.writeFile(wb, OUT_FILE);

const inTests = flagged.filter((f) => f["In live tests"] === "YES").length;
console.log(`Scanned ${scanned} questions; flagged ${flagged.length}${usage.size ? ` (${inTests} used in live tests)` : ""}.`);
for (const c of Object.values(CHECKS)) if (perCheck.get(c.id)) console.log(`  ${c.label}: ${perCheck.get(c.id)}`);
console.log(`Wrote ${OUT_FILE}`);
