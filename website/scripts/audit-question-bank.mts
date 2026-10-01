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
import { str } from "./question-bank-common.mjs";
import { CHECKS, checkQuestion, type Row } from "./question-checks.mjs";

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
    const res = checkQuestion(r);

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
