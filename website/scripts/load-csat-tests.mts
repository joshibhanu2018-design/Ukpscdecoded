/**
 * Load the six CSAT mock tests into Supabase (CSAT 1-6 of the Premium Test
 * Series; the CSAT Test Series pack links the same tests).
 *
 *   cd website
 *   npx.cmd --yes tsx scripts/load-csat-tests.mts            (dry run: reads the file only)
 *   npx.cmd --yes tsx scripts/load-csat-tests.mts --apply    (writes)
 *
 * Input: `test series questions/csat-tests/csat-questions.json`, written by
 * `test series questions/csat-tests/generator/build.py` (git-ignored: the repo
 * is public, so question data never goes into git).
 *
 * --apply upserts the 600 questions on question_id (CSAT-T01-Q001 …), then sets
 * each CSAT test's question_ids (in paper order), total_questions = 100,
 * 120 minutes, 1.5 marks per question and 1/4 negative marking, as in the
 * UKPSC CSAT paper. The main loader (load-question-bank.mts) skips CSAT tests,
 * so the two never overwrite each other.
 */
import * as fs from "fs";
import * as path from "path";
import { createClient } from "@supabase/supabase-js";

const APPLY = process.argv.includes("--apply");

const WEBSITE = fs.existsSync(path.join(process.cwd(), "supabase", "seed-phase6-tests.sql"))
  ? process.cwd()
  : path.join(process.cwd(), "website");
const INPUT = path.join(WEBSITE, "..", "test series questions", "csat-tests", "csat-questions.json");
const ENV_FILE = path.join(WEBSITE, ".env.local");

// Fixed ids from supabase/seed-phase6-tests.sql.
const CSAT_TESTS = [
  "45dbca03-8184-46e1-a241-10e7c0983388",
  "04b45cb8-9a4d-409c-a6c1-48094d5d41ae",
  "827f78a8-5641-4490-b941-eb6b3c557263",
  "fa49bf3b-ebe2-4566-967e-57b1b7854085",
  "f49e0e05-f2cd-434b-94bb-aec89ff0597f",
  "bb8b9620-e13c-4854-a774-c584a6e41820",
];
const QUESTIONS_PER_TEST = 100;
const DURATION_MINUTES = 120;
const MARKS_PER_QUESTION = 1.5;
const NEGATIVE_FRACTION = 0.25;
const OPTION_MAX = 500; // varchar(500)

type Row = {
  question_id: string;
  test: number;
  q_no: number;
  section: string;
  topic: string;
  difficulty: string;
  en: string;
  hi: string;
  opts_en: string[];
  opts_hi: string[];
  ans: string;
  sol_en: string;
  sol_hi: string;
};

const SECTION_CODE: Record<string, string> = {
  Reasoning: "CSAT-R",
  "Maths & Data": "CSAT-M",
  "Decision Making": "CSAT-D",
  Hindi: "CSAT-H",
  English: "CSAT-E",
};

// Readable topic names for the result analysis (subject = "CSAT <section>").
const TOPIC_LABEL: Record<string, string> = {
  decision: "Decision Making",
  analogy: "Analogy", ar: "Assertion-Reason", blood: "Blood Relations", calendar: "Calendar", clock: "Clocks",
  coding: "Coding-Decoding", cube: "Cubes & Dice", direction: "Directions", ds: "Data Sufficiency", figures: "Counting Figures",
  letters: "Alphabet & Letter Series", logic: "Logical Reasoning", missing: "Missing Number", odd: "Odd One Out",
  ranking: "Ranking & Order", seating: "Seating Arrangement", series: "Number Series", statement: "Statements (Conclusions, Assumptions, Arguments)",
  syllogism: "Syllogism", symbols: "Symbols & Operations", venn: "Venn Diagrams", wordorder: "Dictionary Order & Words",
  ages: "Ages", algebra: "Algebra", average: "Averages", di: "Data Interpretation", hcf: "HCF & LCM", indices: "Indices & Surds",
  interest: "Interest", mensuration: "Mensuration", number: "Number System", profit: "Profit & Loss", ratio: "Ratio & Proportion",
  speed: "Speed, Time & Distance", stats: "Statistics", work: "Time & Work",
  "english-passage": "Reading Comprehension", "english-synonym": "Synonyms", "english-antonym": "Antonyms",
  "english-one-word": "One-word Substitution", "english-phrasal": "Phrasal Verbs", "english-idiom": "Idioms", "english-grammar": "Grammar",
  "hindi-passage": "गद्यांश (Comprehension)",
};
const topicLabel = (t: string) => TOPIC_LABEL[t] ?? (t.startsWith("hindi-") ? t.slice(6) : t);

function readEnv(): Record<string, string> {
  if (!fs.existsSync(ENV_FILE)) throw new Error(`Missing ${ENV_FILE}`);
  const env: Record<string, string> = {};
  for (const line of fs.readFileSync(ENV_FILE, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return env;
}

// ---------- read and check ----------

if (!fs.existsSync(INPUT)) {
  throw new Error(`Missing ${INPUT}. Build it first: cd "test series questions/csat-tests/generator" then python build.py`);
}
const rows: Row[] = JSON.parse(fs.readFileSync(INPUT, "utf8"));
const problems: string[] = [];
const seen = new Set<string>();
for (const r of rows) {
  const where = r.question_id || `test ${r.test} Q${r.q_no}`;
  if (seen.has(r.question_id)) problems.push(`${where}: duplicate question_id`);
  seen.add(r.question_id);
  if (!r.en?.trim() || !r.hi?.trim()) problems.push(`${where}: empty question text`);
  if (!/^[ABCD]$/.test(r.ans)) problems.push(`${where}: answer "${r.ans}" is not A-D`);
  if (r.opts_en?.length !== 4 || r.opts_hi?.length !== 4) problems.push(`${where}: needs 4 options in each language`);
  for (const o of [...(r.opts_en ?? []), ...(r.opts_hi ?? [])]) {
    if (!String(o).trim()) problems.push(`${where}: empty option`);
    if (String(o).length > OPTION_MAX) problems.push(`${where}: option longer than ${OPTION_MAX} characters`);
  }
  if (new Set(r.opts_en).size !== 4) problems.push(`${where}: repeated option`);
  if (!SECTION_CODE[r.section]) problems.push(`${where}: unknown section "${r.section}"`);
}

const byTest = CSAT_TESTS.map((_, i) =>
  rows.filter((r) => r.test === i + 1).sort((a, b) => a.q_no - b.q_no)
);

console.log(`Input: ${INPUT}`);
console.log(`Questions: ${rows.length}\n`);
console.log("Test     | Qs  | Reasoning | Maths | Decision | Hindi | English | Answers A/B/C/D | Level");
byTest.forEach((qs, i) => {
  const count = (s: string) => qs.filter((q) => q.section === s).length;
  const ans = "ABCD".split("").map((l) => qs.filter((q) => q.ans === l).length).join("/");
  if (qs.length !== QUESTIONS_PER_TEST) problems.push(`CSAT ${i + 1}: ${qs.length} questions (needs ${QUESTIONS_PER_TEST})`);
  qs.forEach((q, k) => {
    if (q.q_no !== k + 1) problems.push(`CSAT ${i + 1}: question numbers not 1-${QUESTIONS_PER_TEST} in order`);
  });
  console.log(
    `CSAT ${i + 1}   | ${String(qs.length).padEnd(3)} | ${String(count("Reasoning")).padEnd(9)} | ${String(count("Maths & Data")).padEnd(5)} | ` +
      `${String(count("Decision Making")).padEnd(8)} | ${String(count("Hindi")).padEnd(5)} | ${String(count("English")).padEnd(7)} | ${ans.padEnd(15)} | ${qs[0]?.difficulty ?? "-"}`
  );
});
const unlabelled = [...new Set(rows.map((r) => r.topic))].filter((t) => !TOPIC_LABEL[t] && !t.startsWith("hindi-"));
if (unlabelled.length) problems.push(`topics without a readable name (add to TOPIC_LABEL): ${unlabelled.join(", ")}`);
console.log(`\nEach test: ${QUESTIONS_PER_TEST} questions, ${DURATION_MINUTES} minutes, ${MARKS_PER_QUESTION} marks each (${QUESTIONS_PER_TEST * MARKS_PER_QUESTION} total), 1/4 negative.`);

if (problems.length) {
  console.log(`\nProblems (${problems.length}):`);
  problems.slice(0, 40).forEach((p) => console.log(`  - ${p}`));
  throw new Error("Fix the problems above (in the generator) and rebuild before loading.");
}
console.log("Problems: none");

// ---------- apply ----------

async function apply() {
  const env = readEnv();
  const url = env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY missing in .env.local");
  const db = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });

  const { data: existing, error: tErr } = await db.from("tests").select("id, test_name").in("id", CSAT_TESTS);
  if (tErr) throw new Error(`Could not read tests: ${tErr.message}`);
  if ((existing ?? []).length !== CSAT_TESTS.length) {
    throw new Error("CSAT 1-6 are not all in the database. Run supabase/seed-phase6-tests.sql first.");
  }

  const now = new Date().toISOString();
  const dbRows = rows.map((r) => ({
    question_id: r.question_id,
    subject: `CSAT ${r.section}`,
    topic: topicLabel(r.topic).slice(0, 100),
    subtopic: r.topic.slice(0, 100),
    difficulty: r.difficulty,
    year: null,
    question_text_english: r.en,
    question_text_hindi: r.hi,
    option_a_english: r.opts_en[0],
    option_a_hindi: r.opts_hi[0],
    option_b_english: r.opts_en[1],
    option_b_hindi: r.opts_hi[1],
    option_c_english: r.opts_en[2],
    option_c_hindi: r.opts_hi[2],
    option_d_english: r.opts_en[3],
    option_d_hindi: r.opts_hi[3],
    correct_answer: r.ans,
    explanation_english: r.sol_en || null,
    explanation_hindi: r.sol_hi || null,
    source_file: "csat-questions.json",
    question_format: r.topic.slice(0, 50),
    section_code: SECTION_CODE[r.section],
    // no `status`: new rows get the default ('active'); a question an admin
    // deactivated after a student report stays inactive on re-runs
    updated_at: now,
  }));

  console.log(`\nUpserting ${dbRows.length} questions...`);
  for (let i = 0; i < dbRows.length; i += 200) {
    const batch = dbRows.slice(i, i + 200);
    const { error } = await db.from("questions").upsert(batch, { onConflict: "question_id" });
    if (error) throw new Error(`Upsert failed at rows ${i + 1}-${i + batch.length}: ${error.message}`);
    console.log(`  ${Math.min(i + 200, dbRows.length)}/${dbRows.length}`);
  }

  const uuid = new Map<string, string>();
  const ids = rows.map((r) => r.question_id);
  for (let i = 0; i < ids.length; i += 200) {
    const { data, error } = await db.from("questions").select("id, question_id").in("question_id", ids.slice(i, i + 200));
    if (error) throw new Error(`Could not read back question ids: ${error.message}`);
    for (const r of data ?? []) uuid.set(r.question_id as string, r.id as string);
  }
  const unmapped = ids.filter((id) => !uuid.has(id));
  if (unmapped.length) throw new Error(`${unmapped.length} questions not found after upsert (e.g. ${unmapped[0]})`);

  console.log("Updating CSAT 1-6...");
  for (const [i, testId] of CSAT_TESTS.entries()) {
    const qids = byTest[i].map((q) => uuid.get(q.question_id)!);
    const { error } = await db
      .from("tests")
      .update({
        question_ids: qids,
        total_questions: qids.length,
        duration_minutes: DURATION_MINUTES,
        marks_per_question: MARKS_PER_QUESTION,
        negative_marking_enabled: true,
        negative_marking_value: NEGATIVE_FRACTION,
        updated_at: now,
      })
      .eq("id", testId);
    if (error) throw new Error(`Updating CSAT ${i + 1} failed: ${error.message}`);
  }
  console.log(`Done: ${dbRows.length} questions upserted, 6 CSAT tests filled.`);
}

if (APPLY) {
  await apply();
} else {
  console.log("\nDry run only. Nothing was written. Add --apply to load.");
}
