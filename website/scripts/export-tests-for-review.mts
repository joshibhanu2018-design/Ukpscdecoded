/**
 * Per-test review export — READ ONLY. Writes every test's questions as a
 * readable Markdown file, with the automatic checks' flags and the same fact
 * asked in other tests, so the tests can be read and corrected one by one.
 *
 *   cd website
 *   npx --yes tsx scripts/export-tests-for-review.mts                  # the live tests (needs .env.local)
 *   npx --yes tsx scripts/export-tests-for-review.mts --plan           # the loader's TEST_ALLOCATION_PLAN.xlsx instead
 *   npx --yes tsx scripts/export-tests-for-review.mts --plan --only-new  # only questions not live yet
 *   ... --tests="Physical Geography,Topper Test"                        # only these tests
 *
 * Output: "../test series questions/review/"
 *   INDEX.md          one line per test: size, Easy/Medium/Hard, flags, repeats
 *   tests/NN - <test>.md   the questions, flags first in each question
 *   decisions/TEMPLATE.csv the format scripts/apply-review-decisions.mts reads
 *
 * --plan reads the plan the loader writes with `--plan` (run the loader with
 * --harden --plan first to review the questions a hardening run brings in).
 */
import * as fs from "fs";
import * as path from "path";
import { createRequire } from "module";
import { createClient } from "@supabase/supabase-js";
import { str } from "./question-bank-common.mjs";
import { CHECKS, checkQuestion, factWords, sameFact, type Row } from "./question-checks.mjs";

const XLSX: typeof import("xlsx") = createRequire(import.meta.url)("xlsx");

const WEBSITE = fs.existsSync(path.join(process.cwd(), "scripts", "export-tests-for-review.mts"))
  ? process.cwd()
  : path.join(process.cwd(), "website");
const DATA_DIR = path.join(WEBSITE, "..", "test series questions");
const OUT_DIR = path.join(DATA_DIR, "review");
const PLAN_FILE = path.join(DATA_DIR, "TEST_ALLOCATION_PLAN.xlsx");
const SOURCES = [
  { file: "MERGED_QUESTION_BANK_v2.xlsx", sheet: "Question Bank", label: "master" },
  { file: "GENERATED_QUESTIONS.xlsx", sheet: "Generated Questions", label: "GEN" },
  { file: "COMBINED_QUESTIONS.xlsx", sheet: "Combined Questions", label: "CMB" },
];

const USE_PLAN = process.argv.includes("--plan");
const ONLY_NEW = process.argv.includes("--only-new");
const testsArg = process.argv.find((a) => a.startsWith("--tests="));
const ONLY_TESTS = new Set(
  (testsArg?.slice("--tests=".length) ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
);

// ---------- the bank ----------

const rows = new Map<string, { r: Row; src: string }>();
for (const s of SOURCES) {
  const file = path.join(DATA_DIR, s.file);
  if (!fs.existsSync(file)) {
    console.warn(`Skipping ${s.file} (not found)`);
    continue;
  }
  const ws = XLSX.readFile(file).Sheets[s.sheet];
  if (!ws) throw new Error(`Sheet "${s.sheet}" not found in ${s.file}`);
  for (const r of XLSX.utils.sheet_to_json<Row>(ws, { defval: "" })) {
    const qid = str(r["Question_ID"]);
    if (qid && !rows.has(qid)) rows.set(qid, { r, src: s.label });
  }
}
if (!rows.size) throw new Error(`No question workbooks found in ${DATA_DIR}`);

// ---------- the tests ----------

const one = (s: string) => s.replace(/\s*\n\s*/g, " / ");

type Test = { name: string; qids: string[] };

function readEnv(): Record<string, string> | null {
  const file = path.join(WEBSITE, ".env.local");
  if (!fs.existsSync(file)) return null;
  const env: Record<string, string> = {};
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return env;
}

// Open "Report error" reports from students, by Question_ID.
const reports = new Map<string, string[]>();

async function readLiveTests(): Promise<Test[] | null> {
  const env = readEnv();
  const url = env?.NEXT_PUBLIC_SUPABASE_URL || env?.SUPABASE_URL;
  const key = env?.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  const db = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data: open, error: rErr } = await db.from("question_reports").select("question_id, reason, note").eq("status", "open");
  if (rErr) console.warn(`Could not read student reports (${rErr.message}); they are left out.`);
  const { data: tests, error } = await db.from("tests").select("test_name, question_ids");
  if (error) throw new Error(`Could not read tests: ${error.message}`);
  const uuids = [...new Set((tests ?? []).flatMap((t) => (t.question_ids as string[] | null) ?? []))];
  const qidOf = new Map<string, string>();
  for (let i = 0; i < uuids.length; i += 200) {
    const { data, error: qErr } = await db.from("questions").select("id, question_id").in("id", uuids.slice(i, i + 200));
    if (qErr) throw new Error(`Could not read questions: ${qErr.message}`);
    for (const r of data ?? []) qidOf.set(r.id as string, r.question_id as string);
  }
  const reported = [...new Set((open ?? []).map((r) => r.question_id as string))].filter((u) => !qidOf.has(u));
  for (let i = 0; i < reported.length; i += 200) {
    const { data } = await db.from("questions").select("id, question_id").in("id", reported.slice(i, i + 200));
    for (const r of data ?? []) qidOf.set(r.id as string, r.question_id as string);
  }
  for (const r of open ?? []) {
    const qid = qidOf.get(r.question_id as string);
    if (qid) reports.set(qid, [...(reports.get(qid) ?? []), `${r.reason}${r.note ? `: ${one(str(r.note))}` : ""}`]);
  }
  return (tests ?? [])
    .map((t) => ({
      name: t.test_name as string,
      qids: ((t.question_ids as string[] | null) ?? []).map((u) => qidOf.get(u) ?? u),
    }))
    .filter((t) => t.qids.length);
}

function readPlan(): Test[] {
  if (!fs.existsSync(PLAN_FILE)) {
    throw new Error(`${PLAN_FILE} not found — run the loader with --plan first (e.g. --harden --plan).`);
  }
  const plan = XLSX.utils.sheet_to_json<Row>(XLSX.readFile(PLAN_FILE).Sheets["Allocation"], { defval: "" });
  const byName = new Map<string, string[]>();
  for (const r of plan) {
    const name = str(r["Test_Name"]);
    if (!byName.has(name)) byName.set(name, []);
    byName.get(name)!.push(str(r["Question_ID"]));
  }
  return [...byName.entries()].map(([name, qids]) => ({ name, qids }));
}

const live = await readLiveTests();
let tests: Test[];
if (USE_PLAN) tests = readPlan();
else if (live) tests = live;
else throw new Error("Supabase credentials not found in website/.env.local — use --plan to review the loader's plan instead.");
if (ONLY_NEW && !live) throw new Error("--only-new needs .env.local, to know which questions are live now.");
const liveIds = new Set((live ?? []).flatMap((t) => t.qids));
if (ONLY_TESTS.size) {
  const unknown = [...ONLY_TESTS].filter((n) => !tests.some((t) => t.name === n));
  if (unknown.length) throw new Error(`--tests: no test named ${unknown.map((n) => `"${n}"`).join(", ")}`);
  tests = tests.filter((t) => ONLY_TESTS.has(t.name));
}
// Topic tests first, full mocks and the free mock last.
const isMock = (n: string) => /^Full Mock|Free Sample Mock/.test(n);
tests.sort((a, b) => Number(isMock(a.name)) - Number(isMock(b.name)) || a.name.localeCompare(b.name, "en", { numeric: true }));

// ---------- the same fact in more than one test ----------

const facts = new Map<string, { answer: string; words: Set<string> }>();
const testsOf = new Map<string, string[]>();
for (const t of tests) {
  for (const id of t.qids) {
    testsOf.set(id, [...(testsOf.get(id) ?? []), t.name]);
    const row = rows.get(id);
    if (!row || facts.has(id)) continue;
    const c = checkQuestion(row.r);
    const answer = (c.opts["ABCD".indexOf(c.ans)]?.en ?? "").toLowerCase();
    facts.set(id, { answer, words: factWords(c.en) });
  }
}
// compare only questions with the same answer text
const byAnswer = new Map<string, string[]>();
for (const [id, f] of facts) byAnswer.set(f.answer, [...(byAnswer.get(f.answer) ?? []), id]);
const repeats = new Map<string, string[]>();
for (const ids of byAnswer.values()) {
  for (let i = 0; i < ids.length; i++)
    for (let j = i + 1; j < ids.length; j++) {
      if (!sameFact(facts.get(ids[i])!, facts.get(ids[j])!)) continue;
      repeats.set(ids[i], [...(repeats.get(ids[i]) ?? []), ids[j]]);
      repeats.set(ids[j], [...(repeats.get(ids[j]) ?? []), ids[i]]);
    }
}

// ---------- write ----------

fs.mkdirSync(path.join(OUT_DIR, "tests"), { recursive: true });
fs.mkdirSync(path.join(OUT_DIR, "decisions"), { recursive: true });
// old test files go, so a renamed test doesn't leave a stale copy
for (const f of fs.readdirSync(path.join(OUT_DIR, "tests"))) if (f.endsWith(".md")) fs.rmSync(path.join(OUT_DIR, "tests", f));
const template = path.join(OUT_DIR, "decisions", "TEMPLATE.csv");
if (!fs.existsSync(template)) {
  fs.writeFileSync(
    template,
    "﻿Question_ID,Column,New_Value,Reason\n" +
      'UK-EXAMPLE-0001,Correct_Answer,C,"Statement 2 is wrong (Nanda Devi is 7,816 m), so the answer is 1 only"\n' +
      "UK-EXAMPLE-0002,Review_Flag,too easy,One-line recall below exam level\n",
    "utf8",
  );
}

const safe = (s: string) => s.replace(/[\\/:*?"<>|]+/g, "-").trim();
const index: string[] = [
  `# Test review — ${USE_PLAN ? "loader plan (TEST_ALLOCATION_PLAN.xlsx)" : "live tests"}${ONLY_NEW ? ", only questions not live yet" : ""}`,
  "",
  "Flags are heuristics (look, don't trust). Repeats = the same fact (same answer, similar wording) asked in another test.",
  "",
  "| # | Test | Q | Easy | Med | Hard | Flagged | Student reports | Repeats | Missing |",
  "|---|---|---|---|---|---|---|---|---|---|",
];
let written = 0;
let missingTotal = 0;
const flagTotals = new Map<string, number>();

tests.forEach((t, ti) => {
  const qids = ONLY_NEW ? t.qids.filter((id) => !liveIds.has(id)) : t.qids;
  if (!qids.length) return;
  const diff = { Easy: 0, Medium: 0, Hard: 0 } as Record<string, number>;
  let flagged = 0;
  let repeated = 0;
  let missing = 0;
  let reportedHere = 0;
  const body: string[] = [];
  qids.forEach((id, i) => {
    const row = rows.get(id);
    if (!row) {
      missing++;
      body.push(`### ${i + 1}. ${id} — NOT FOUND in the workbooks (removed or renamed?)`, "");
      return;
    }
    const r = row.r;
    const c = checkQuestion(r);
    const d = str(r["Difficulty"]);
    diff[d] = (diff[d] ?? 0) + 1;
    const flags = c.found.map((f) => CHECKS[f].label);
    if (str(r["Review_Flag"])) flags.unshift(`ALREADY FLAGGED: ${str(r["Review_Flag"])} (the loader replaces it)`);
    if (flags.length) flagged++;
    const studentReports = reports.get(id) ?? [];
    if (studentReports.length) reportedHere++;
    c.found.forEach((f) => flagTotals.set(f, (flagTotals.get(f) ?? 0) + 1));
    const elsewhere = (repeats.get(id) ?? []).map((o) => `${o} (${(testsOf.get(o) ?? []).join("; ")})`);
    if (elsewhere.length) repeated++;
    const isNew = live && !liveIds.has(id) ? " · NEW (not live yet)" : "";
    body.push(
      `### ${i + 1}. ${id} · ${str(r["Section_Code"])} ${str(r["Chapter_Code"])} ${str(r["Chapter/Sub-topic"])} · ${d} · ${str(r["Question_Type"]) || "?"} · ${str(r["Static_or_CA"])} · ${row.src}${isNew}`,
    );
    if (flags.length) body.push(`**FLAGS:** ${flags.join("; ")}${c.notes.length ? ` — ${c.notes.join("; ")}` : ""}`);
    if (studentReports.length) {
      body.push(`**STUDENT REPORTS (${studentReports.length} open):** ${studentReports.map((x) => `"${x}"`).join("; ")}`);
    }
    if (elsewhere.length) {
      body.push(`**SAME FACT ALSO IN:** ${elsewhere.slice(0, 6).join(", ")}${elsewhere.length > 6 ? ` and ${elsewhere.length - 6} more` : ""}`);
    }
    body.push(
      "",
      `**Q:** ${c.en}`,
      "",
      ...c.opts.map((o, k) => `- ${"ABCD"[k]}) ${o.en}${o.hi !== o.en ? `  —  ${o.hi}` : ""}`),
      "",
      `**Answer:** ${c.ans}) ${c.opts["ABCD".indexOf(c.ans)]?.en ?? "(not A-D!)"}`,
      `**Explanation:** ${one(c.exEn) || "(none)"}`,
      `**HI:** ${one(c.hi)}`,
      "",
    );
  });
  missingTotal += missing;
  const num = String(ti + 1).padStart(2, "0");
  const head = [
    `# ${t.name}`,
    "",
    `${qids.length} questions${ONLY_NEW ? " (not live yet)" : ""} · Easy ${diff.Easy ?? 0} / Medium ${diff.Medium ?? 0} / Hard ${diff.Hard ?? 0} · flagged ${flagged} · student reports ${reportedHere} · same fact in another test ${repeated}${missing ? ` · NOT FOUND ${missing}` : ""}`,
    "",
  ];
  fs.writeFileSync(path.join(OUT_DIR, "tests", `${num} - ${safe(t.name)}.md`), [...head, ...body].join("\n"), "utf8");
  index.push(`| ${num} | ${t.name} | ${qids.length} | ${diff.Easy ?? 0} | ${diff.Medium ?? 0} | ${diff.Hard ?? 0} | ${flagged} | ${reportedHere} | ${repeated} | ${missing} |`);
  written++;
});

index.push("", "## Flags across these tests", "");
for (const c of Object.values(CHECKS)) if (flagTotals.get(c.id)) index.push(`- ${c.label}: ${flagTotals.get(c.id)}`);
fs.writeFileSync(path.join(OUT_DIR, "INDEX.md"), index.join("\n") + "\n", "utf8");

console.log(`Wrote ${written} test files to ${path.join(OUT_DIR, "tests")}`);
if (reports.size) console.log(`Questions with open student reports: ${reports.size} (shown in the test files)`);
console.log(`Questions repeating a fact from another question in the tests: ${repeats.size}`);
if (missingTotal) console.log(`Questions in tests but not in the workbooks: ${missingTotal}`);
for (const c of Object.values(CHECKS)) if (flagTotals.get(c.id)) console.log(`  ${c.label}: ${flagTotals.get(c.id)}`);
console.log(`Index: ${path.join(OUT_DIR, "INDEX.md")}`);
