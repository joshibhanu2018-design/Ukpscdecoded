/**
 * Load the question bank into Supabase and fill the 56 non-CSAT tests of the
 * Premium Test Series (fixed ids from supabase/seed-phase6-tests.sql) plus
 * the Free Sample Mock.
 *
 *   cd website
 *   npx --yes tsx scripts/load-question-bank.mts            # dry run (default): writes nothing
 *   npx --yes tsx scripts/load-question-bank.mts --plan     # dry run + writes TEST_ALLOCATION_PLAN.xlsx
 *   npx --yes tsx scripts/load-question-bank.mts --apply    # writes to the database
 *
 * Inputs (in "../test series questions/", which is git-ignored — the repo is public):
 *   MERGED_QUESTION_BANK_v2.xlsx     master bank; rows with a Review_Flag are excluded
 *   GENERATED_QUESTIONS.xlsx         GEN- questions written to cover the shortfalls
 *   COMBINED_QUESTIONS.xlsx          CMB- statement/match questions built from 2-4 spare
 *                                    direct UK questions (scripts/build-combined-questions.ts);
 *                                    their source questions stay in the bank but out of tests
 *   UTTARAKHAND_TEST_STRUCTURE.xlsx  "Test Allocation" sheet, reused for 12 UK tests
 *   UKPCS_Master_Question_Bank_CLEAN.xlsx, Uttarakhand STATIC _Question_Bank.xlsx
 *                                    read only to trace each question's source file
 *
 * Needs supabase/schema-phase8-question-bank.sql (unique question_id),
 * schema-phase14-bank-browser.sql (source columns, Free Sample Mock) and the
 * phase 6 seed files to have been run before --apply. Credentials come from
 * .env.local and are never printed.
 *
 * Every test keeps the questions it has in the database now (so fixing one
 * test never reshuffles the others); only a test with no questions yet, or
 * one named in --recompose="Name,Name", is built afresh. The allocation is deterministic (seeded shuffle), so a dry run and a
 * later --apply produce the same tests. Questions deactivated in the database
 * (status 'inactive') are swapped in place for unused ones. Both modes read the
 * database (read-only) first, so the dry run matches --apply.
 */
import * as fs from "fs";
import * as path from "path";
import { createRequire } from "module";
import { createClient } from "@supabase/supabase-js";
import { numbersIn, splitOption, str } from "./question-bank-common.mjs";

// ESM (.mts) so the live tests can be read before allocating; SheetJS's ESM
// build has no readFile, so load its CommonJS build.
const XLSX: typeof import("xlsx") = createRequire(import.meta.url)("xlsx");

// ---------- paths / flags ----------

const APPLY = process.argv.includes("--apply");
const WRITE_PLAN = process.argv.includes("--plan");

const WEBSITE = fs.existsSync(path.join(process.cwd(), "supabase", "seed-phase6-tests.sql"))
  ? process.cwd()
  : path.join(process.cwd(), "website");
const DATA_DIR = path.join(WEBSITE, "..", "test series questions");
const MASTER_FILE = path.join(DATA_DIR, "MERGED_QUESTION_BANK_v2.xlsx");
const GEN_FILE = path.join(DATA_DIR, "GENERATED_QUESTIONS.xlsx");
const CMB_FILE = path.join(DATA_DIR, "COMBINED_QUESTIONS.xlsx");
const CLEAN_FILE = path.join(DATA_DIR, "UKPCS_Master_Question_Bank_CLEAN.xlsx");
const STATIC_FILE = path.join(DATA_DIR, "Uttarakhand STATIC _Question_Bank.xlsx");
const UK_FILE = path.join(DATA_DIR, "UTTARAKHAND_TEST_STRUCTURE.xlsx");
const SEED_FILE = path.join(WEBSITE, "supabase", "seed-phase6-tests.sql");
const ENV_FILE = path.join(WEBSITE, ".env.local");
const PLAN_FILE = path.join(DATA_DIR, "TEST_ALLOCATION_PLAN.xlsx");

// UKPSC Prelims: a quarter of the question's marks is deducted per wrong answer.
const NEGATIVE_FRACTION = 0.25;

// ---------- types ----------

type Diff = "Easy" | "Medium" | "Hard";
type Mix = Record<Diff, number>;

interface Q {
  qid: string;
  sec: string; // Section_Code: UKGK, CA, POL, HIS, GEO, SCI, ECO, ENV
  subject: string;
  chap: string; // Chapter_Code
  chapName: string;
  qtype: string;
  isCA: boolean;
  en: string;
  hi: string;
  opts: { en: string; hi: string }[];
  ans: string;
  exEn: string;
  exHi: string;
  diff: Diff;
  gen: boolean;
  srcFile: string; // where the question came from (Admin → Question Bank filter)
  srcs?: string[]; // CMB- only: the direct questions whose facts it combines
}

interface TestDef {
  id: string;
  name: string;
  subject: string;
  target: number;
}

type Row = Record<string, unknown>;

// ---------- small helpers ----------

/** Deterministic PRNG (mulberry32) so dry run and --apply agree. */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = rng(20260924);
function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Largest-remainder split of `total` across weights. */
function split(total: number, weights: Record<string, number>): Record<string, number> {
  const keys = Object.keys(weights);
  const sum = keys.reduce((s, k) => s + weights[k], 0) || 1;
  const raw = keys.map((k) => (total * weights[k]) / sum);
  const out = raw.map(Math.floor);
  let rem = total - out.reduce((s, v) => s + v, 0);
  raw
    .map((r, i) => [r - out[i], i] as const)
    .sort((x, y) => y[0] - x[0])
    .forEach(([, i]) => {
      if (rem > 0) {
        out[i]++;
        rem--;
      }
    });
  return Object.fromEntries(keys.map((k, i) => [k, out[i]]));
}

// boilerplate of statement / match stems, so only the substance is compared
const TEMPLATE_WORDS = new Set(
  "consider following statements statement which given above correct incorrect only both neither select answer using codes below match list with from these those regarding about among what that this there their pairs pair correctly matched".split(
    " "
  )
);
const words = (s: string) =>
  new Set(
    s
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3 && !TEMPLATE_WORDS.has(w))
  );
/** Same correct answer and heavily overlapping wording: the same fact asked twice. */
const wordCache = new Map<string, Set<string>>();
const wordsOf = (q: Q) => {
  let w = wordCache.get(q.qid);
  if (!w) wordCache.set(q.qid, (w = words(q.en)));
  return w;
};
const answerOf = (q: Q) => q.opts["ABCD".indexOf(q.ans)].en.toLowerCase();
function nearDup(a: Q, b: Q): boolean {
  if (answerOf(a) !== answerOf(b)) return false;
  const wa = wordsOf(a);
  const wb = wordsOf(b);
  let inter = 0;
  wa.forEach((w) => wb.has(w) && inter++);
  return inter / (wa.size + wb.size - inter || 1) >= 0.4;
}
// A CMB- question also repeats every fact it combines, so it clashes with a
// question that repeats one of its source questions (and vice versa).
const factCache = new Map<string, Q[]>();
const factsOf = (q: Q): Q[] => {
  let f = factCache.get(q.qid);
  if (!f) factCache.set(q.qid, (f = [q, ...(q.srcs ?? []).map((id) => byId.get(id)).filter((x): x is Q => !!x)]));
  return f;
};
const clashes = (q: Q, list: Q[]) =>
  list.some((x) => (q.srcs || x.srcs ? factsOf(q).some((a) => factsOf(x).some((b) => nearDup(a, b))) : nearDup(x, q)));

// ---------- load questions ----------

function readSheet(file: string, sheet: string): Row[] {
  if (!fs.existsSync(file)) throw new Error(`Missing input file: ${file}`);
  const wb = XLSX.readFile(file);
  const ws = wb.Sheets[sheet];
  if (!ws) throw new Error(`Sheet "${sheet}" not found in ${path.basename(file)}`);
  return XLSX.utils.sheet_to_json<Row>(ws, { defval: "" });
}

const rejected: { qid: string; reason: string }[] = [];

function toQ(r: Row, gen: boolean, srcFile: string): Q | null {
  const qid = str(r["Question_ID"]);
  const ans = str(r["Correct_Answer"]).toUpperCase();
  const en = str(r["Question (English)"]);
  const hi = str(r["Question (Hindi)"]);
  const diff = str(r["Difficulty"]) as Diff;
  const reason = !qid
    ? "no Question_ID"
    : !["A", "B", "C", "D"].includes(ans)
      ? "Correct_Answer not A-D"
      : !en || !hi
        ? "missing English or Hindi question text"
        : !["Easy", "Medium", "Hard"].includes(diff)
          ? "Difficulty not Easy/Medium/Hard"
          : "";
  const opts = ["A", "B", "C", "D"].map((l) => splitOption(str(r[`Option_${l}`])));
  const longOpt = opts.some((o) => !o.en || o.en.length > 500 || o.hi.length > 500);
  if (reason || longOpt) {
    rejected.push({ qid: qid || "(blank)", reason: reason || "option empty or over 500 characters" });
    return null;
  }
  return {
    qid,
    sec: str(r["Section_Code"]),
    subject: str(r["Subject"]),
    chap: str(r["Chapter_Code"]),
    chapName: str(r["Chapter/Sub-topic"]),
    qtype: str(r["Question_Type"]),
    isCA: str(r["Static_or_CA"]) !== "Static",
    en,
    hi,
    opts,
    ans,
    exEn: str(r["Explanation (updated)"]),
    exHi: str(r["Explanation (Hindi if needed)"]),
    diff,
    gen,
    srcFile,
  };
}

// ---------- source file of each question ----------
// The master bank's `Sources` names the sheet row it was merged from (first
// line = the kept copy). Rows from the CLEAN bank are traced one step
// further, to CLEAN's own Source_File; the two scans of the Uttarakhand MCQ
// book are named by book chapter.

const optionalSheet = (file: string, sheet: string): Row[] => (fs.existsSync(file) ? readSheet(file, sheet) : []);
const cleanSource = new Map(
  optionalSheet(CLEAN_FILE, "Master Bank").map((r) => [str(r["Question_ID"]), str(r["Source_File"])])
);
const staticRows = optionalSheet(STATIC_FILE, "New Questions Template");

function sourceFileOf(r: Row): string {
  const first = str(r["Sources"]).split(/\r?\n/)[0] ?? "";
  const [file, , rowRef] = first.split(" › ").map((s) => s.trim());
  if (/^UKPCS_Master_Question_Bank_CLEAN/.test(file)) return cleanSource.get(str(r["Question_ID"])) || file;
  if (/^Uttarakhand STATIC/.test(file)) {
    const label = str(staticRows[Number((rowRef ?? "").replace(/\D/g, "")) - 2]?.["Source_Topic_Label"]);
    const m = label.match(/^(Chapter \d+ - .+?) \(Uttarakhand MCQ book\)$/);
    return m ? `Uttarakhand MCQ book: ${m[1]}` : "Uttarakhand MCQ book";
  }
  if (/^uttarakhand_history_bilingual/.test(file)) return "Uttarakhand MCQ book: Chapter 2 - History";
  return file || "MERGED_QUESTION_BANK_v2.xlsx";
}

const MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

// Questions mentioning a month after today (India time) can't be settled
// facts yet — they're left out of every test and listed in the output.
const NOW_KEY = (() => {
  const d = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
  return d.getUTCFullYear() * 100 + d.getUTCMonth() + 1;
})();
const futureDated: { qid: string; key: number }[] = [];

const masterRows = readSheet(MASTER_FILE, "Question Bank");
const flaggedIds = new Set(masterRows.filter((r) => str(r["Review_Flag"])).map((r) => str(r["Question_ID"])));
const genRows = readSheet(GEN_FILE, "Generated Questions");
const cmbRows = optionalSheet(CMB_FILE, "Combined Questions");

const all: Q[] = [];
const seen = new Set<string>();
let duplicateIds = 0;
for (const [rows, gen, file] of [
  [masterRows.filter((r) => !str(r["Review_Flag"])), false, null],
  [genRows, true, "GENERATED_QUESTIONS.xlsx"],
  [cmbRows, true, "COMBINED_QUESTIONS.xlsx"],
] as const) {
  for (const r of rows) {
    const q = toQ(r, gen, file ?? sourceFileOf(r));
    if (!q) continue;
    const srcs = str(r["Source_IDs"]).split(/[,\s]+/).filter(Boolean);
    if (srcs.length) q.srcs = srcs;
    const key = dateKey(q);
    if (key > NOW_KEY) {
      futureDated.push({ qid: q.qid, key });
      continue;
    }
    if (seen.has(q.qid)) {
      duplicateIds++;
      continue;
    }
    seen.add(q.qid);
    all.push(q);
  }
}
// A CMB- question whose source was flagged (or removed) may carry the same
// error, so it is left out too.
const droppedCombined: string[] = [];
for (let i = all.length - 1; i >= 0; i--) {
  const bad = all[i].srcs?.find((id) => !seen.has(id));
  if (bad) {
    droppedCombined.push(`${all[i].qid} (source ${bad} is flagged, future-dated or missing)`);
    all.splice(i, 1);
  }
}
const byId = new Map(all.map((q) => [q.qid, q]));
// Sources of CMB- questions stay in the bank (and the database) but out of every test.
const heldBack = new Set(all.flatMap((q) => q.srcs ?? []));

// ---------- tests from the seed file ----------

const seedSql = fs.readFileSync(SEED_FILE, "utf8");
const tests: TestDef[] = [];
for (const m of seedSql.matchAll(
  /values \('([0-9a-f-]{36})', '([^']+)', '[0-9a-f-]{36}', '([^']+)', (\d+), \d+/g
)) {
  if (m[3] === "CSAT") continue;
  tests.push({ id: m[1], name: m[2], subject: m[3], target: Number(m[4]) });
}
// Free for every logged-in student; row created by schema-phase14-bank-browser.sql.
const FREE_SAMPLE: TestDef = { id: "4cc0172f-6f95-4c69-b6dc-0944a16c5725", name: "Free Sample Mock", subject: "Free Sample", target: 50 };
tests.push(FREE_SAMPLE);
const testById = new Map(tests.map((t) => [t.id, t]));
const byName = (name: string) => {
  const t = tests.find((x) => x.name === name);
  if (!t) throw new Error(`Test "${name}" not found in seed-phase6-tests.sql`);
  return t;
};

// ---------- what the database holds now (read-only) ----------

// Every test that already has questions keeps them (a deactivated one is
// swapped in place, section 5c). To build a test afresh, name it:
//   --recompose="CA: Economy & Budget,Free Sample Mock"   (seed or current name)
// Batch 2 (Sep 2026) was applied with the CA tests + Free Sample Mock in this list.
const recomposeArg = process.argv.find((a) => a.startsWith("--recompose="));
const RECOMPOSE_NAMES = (recomposeArg?.slice("--recompose=".length) ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const liveNames = new Map<string, string>(); // test id -> current name in the database
const RECOMPOSE = new Set<string>();

const inactiveIds = new Set<string>();
const liveQids = new Map<string, string[]>(); // test id -> its Question_IDs in the database, in order
const liveWarnings: string[] = [];

async function readLive() {
  let env: Record<string, string>;
  try {
    env = readEnv();
  } catch {
    liveWarnings.push("WARNING: .env.local not found — live tests and inactive questions were not read; every test is built afresh");
    return;
  }
  const url = env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    liveWarnings.push("WARNING: Supabase credentials missing — live tests and inactive questions were not read; every test is built afresh");
    return;
  }
  const db = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
  for (let from = 0; ; from += 1000) {
    const { data, error } = await db
      .from("questions")
      .select("question_id")
      .eq("status", "inactive")
      .range(from, from + 999);
    if (error) throw new Error(`Could not read inactive questions: ${error.message}`);
    for (const r of data ?? []) inactiveIds.add(r.question_id as string);
    if (!data || data.length < 1000) break;
  }
  const { data: liveTests, error: ltErr } = await db.from("tests").select("id, test_name, question_ids").in("id", tests.map((t) => t.id));
  if (ltErr) throw new Error(`Could not read tests: ${ltErr.message}`);
  const uuids = [...new Set((liveTests ?? []).flatMap((t) => (t.question_ids as string[] | null) ?? []))];
  const qidOf = new Map<string, string>();
  for (let i = 0; i < uuids.length; i += 200) {
    const { data, error } = await db.from("questions").select("id, question_id").in("id", uuids.slice(i, i + 200));
    if (error) throw new Error(`Could not read live questions: ${error.message}`);
    for (const r of data ?? []) qidOf.set(r.id as string, r.question_id as string);
  }
  for (const t of liveTests ?? []) {
    liveQids.set(t.id as string, ((t.question_ids as string[] | null) ?? []).map((u) => qidOf.get(u) ?? u));
    liveNames.set(t.id as string, t.test_name as string);
  }
}
await readLive();
for (const name of RECOMPOSE_NAMES) {
  const t = tests.find((x) => x.name === name || liveNames.get(x.id) === name);
  if (!t) throw new Error(`--recompose: no test named "${name}"`);
  RECOMPOSE.add(t.id);
}

// ---------- allocation state ----------

const used = new Set<string>(heldBack);
const assigned = new Map<string, Q[]>(tests.map((t) => [t.id, []]));
const notes: string[] = [];
const newNames = new Map<string, string>();
const newSubjects = new Map<string, string>();

const free = (pred: (q: Q) => boolean) => all.filter((q) => !used.has(q.qid) && pred(q));
function take(testId: string, qs: Q[]) {
  for (const q of qs) {
    if (used.has(q.qid)) throw new Error(`Internal error: ${q.qid} assigned twice`);
    used.add(q.qid);
    assigned.get(testId)!.push(q);
  }
}

// Tests outside RECOMPOSE keep their live questions, in order. A live
// question that is now the source of a CMB- question gives its slot to that
// CMB- question (the fact stays in the test, with more facts around it) or,
// if that doesn't fit, to an unused question of the same chapter (statement /
// match first). A live question gone from the bank is replaced the same way.
const pinnedIds = new Set<string>();
const cmbOf = new Map<string, Q>();
for (const q of all) for (const s of q.srcs ?? []) cmbOf.set(s, q);
let pinSwapCmb = 0;
let pinSwapOther = 0;
const pinLost: string[] = [];
for (const t of tests) {
  const live = liveQids.get(t.id);
  if (RECOMPOSE.has(t.id) || !live?.length) continue;
  pinnedIds.add(t.id);
  const keep: Q[] = [];
  for (const id of live) {
    const q = byId.get(id);
    if (q && !used.has(q.qid)) {
      keep.push(q);
      continue;
    }
    const cmb = cmbOf.get(id);
    if (cmb && !used.has(cmb.qid) && !clashes(cmb, keep)) {
      keep.push(cmb);
      used.add(cmb.qid);
      pinSwapCmb++;
      continue;
    }
    const like = q ?? (cmb ? byId.get(cmb.srcs![0]) : undefined);
    const rep = like
      ? [
          free((x) => !/^Factual recall/.test(x.qtype) && x.sec === like.sec && x.isCA === like.isCA && x.chap === like.chap),
          free((x) => x.sec === like.sec && x.isCA === like.isCA && x.chap === like.chap),
          free((x) => x.sec === like.sec && x.isCA === like.isCA),
        ]
          .map((g) => g.find((x) => !clashes(x, keep)))
          .find(Boolean)
      : undefined;
    if (rep) {
      keep.push(rep);
      used.add(rep.qid);
      pinSwapOther++;
    } else pinLost.push(`${t.name}: ${id}`);
  }
  // take() marks used again; clear the marks set above so it doesn't see a double assignment
  keep.forEach((q) => used.delete(q.qid));
  take(t.id, keep);
}
if (pinSwapCmb || pinSwapOther) {
  notes.push(
    `Live questions now used as CMB- sources (or gone from the bank): ${pinSwapCmb} replaced by their CMB- question, ${pinSwapOther} by another question of the same chapter.`
  );
}
if (pinLost.length) notes.push(`Live questions with no replacement (test is short): ${pinLost.join(", ")}`);
const pinned = (t: TestDef) => pinnedIds.has(t.id);
notes.push(`Kept their live questions (not re-composed this run): ${pinnedIds.size} tests.`);

const BENCH_MIX: Mix = { Easy: 129, Medium: 149, Hard: 22 }; // 2024-25 papers, per 300 questions
const UK_MIX: Mix = { Easy: 20, Medium: 23, Hard: 7 }; // approved UK test design, per 50
const TOPPER_MIX: Mix = { Easy: 0, Medium: 20, Hard: 30 };

function mixCounts(n: number, mix: Mix): Mix {
  return split(n, mix) as Mix;
}

/** Interleave by chapter so any prefix of the list is spread across topics. */
function interleave(qs: Q[]): Q[] {
  const groups = new Map<string, Q[]>();
  for (const q of shuffle(qs)) {
    if (!groups.has(q.chap)) groups.set(q.chap, []);
    groups.get(q.chap)!.push(q);
  }
  const lists = shuffle([...groups.values()]);
  const out: Q[] = [];
  for (let i = 0; out.length < qs.length; i++) for (const l of lists) if (i < l.length) out.push(l[i]);
  return out;
}

const FALLBACK: Record<Diff, Diff[]> = {
  Easy: ["Medium", "Hard"],
  Medium: ["Easy", "Hard"],
  Hard: ["Medium", "Easy"],
};

/** Pick up to n candidates matching a difficulty mix; shortfalls fall back to neighbouring levels. */
function pick(cands: Q[], n: number, mix: Mix, against: Q[] = []): Q[] {
  const want = mixCounts(n, mix);
  const buckets: Record<Diff, Q[]> = { Easy: [], Medium: [], Hard: [] };
  for (const q of interleave(cands.filter((q) => !used.has(q.qid)))) buckets[q.diff].push(q);
  const out: Q[] = [];
  // take up to k from a bucket, skipping questions that repeat one already in the test
  const grab = (d: Diff, k: number) => {
    let got = 0;
    const b = buckets[d];
    for (let i = 0; i < b.length && got < k; ) {
      if (clashes(b[i], against) || clashes(b[i], out)) {
        i++;
        continue;
      }
      out.push(b.splice(i, 1)[0]);
      got++;
    }
    return got;
  };
  const miss: Record<Diff, number> = { Easy: 0, Medium: 0, Hard: 0 };
  for (const d of ["Hard", "Easy", "Medium"] as Diff[]) miss[d] = want[d] - grab(d, want[d]);
  for (const d of ["Hard", "Easy", "Medium"] as Diff[]) {
    for (const alt of FALLBACK[d]) {
      if (miss[d] <= 0) break;
      miss[d] -= grab(alt, miss[d]);
    }
  }
  return out;
}

/** Fill a test up to its target from `cands` (in preference groups), aiming at `mix` for the whole test. */
function fill(t: TestDef, groups: Q[][], mix: Mix) {
  for (const g of groups) {
    const have = assigned.get(t.id)!;
    const left = t.target - have.length;
    if (left <= 0) return;
    // steer the remaining picks towards the overall mix
    const want = mixCounts(t.target, mix);
    const cur: Mix = { Easy: 0, Medium: 0, Hard: 0 };
    have.forEach((q) => cur[q.diff]++);
    const rest: Mix = {
      Easy: Math.max(0, want.Easy - cur.Easy),
      Medium: Math.max(0, want.Medium - cur.Medium),
      Hard: Math.max(0, want.Hard - cur.Hard),
    };
    if (rest.Easy + rest.Medium + rest.Hard === 0) rest.Medium = 1;
    take(t.id, pick(g, left, rest, have));
  }
}

// ---------- 1. Uttarakhand: reuse the workbook sets ----------

const ukAlloc = readSheet(UK_FILE, "Test Allocation");
const wbSets = new Map<number, string[]>();
for (const r of ukAlloc) {
  const n = Number(r["Test_Number"]);
  if (!wbSets.has(n)) wbSets.set(n, []);
  wbSets.get(n)!.push(str(r["Question_ID"]));
}
const ukStatic = (q: Q) => q.sec === "UKGK" && !q.isCA;
const ukCA = (q: Q) => q.sec === "UKGK" && q.isCA;

const REUSE: [string, [number, number][]][] = [
  ["Ancient & Medieval History", [[1, 50]]],
  ["Gorkha & British rule & Freedom Struggle", [[2, 50]]],
  ["Physical Geography", [[3, 50]]],
  ["Forests Flora-Fauna & National Parks", [[4, 50]]],
  ["Demography & Census", [[5, 50]]],
  ["Polity & Administration", [[6, 50]]],
  ["Economy Development & Budget", [[7, 50]]],
  ["Agriculture Energy & Infrastructure", [[9, 25], [10, 25]]],
  ["Festivals Fairs Folk Music & Dance", [[11, 50]]],
  ["Tourism & Sacred Sites", [[12, 50]]],
  ["Mixed Mock A", [[15, 50]]],
  ["Mixed Mock B", [[16, 50]]],
  ["Mixed Mock C", [[17, 50]]],
  ["Mixed Mock D", [[18, 50]]],
];
let droppedFlagged = 0;
let droppedOverlap = 0;
let droppedRepeat = 0;
for (const [name, sets] of REUSE) {
  const t = byName(name);
  if (pinned(t)) continue;
  for (const [num, count] of sets) {
    const ids = wbSets.get(num) ?? [];
    const chaps = new Set<string>();
    const ok: Q[] = [];
    const lost: { ca: boolean; diff: Diff }[] = [];
    for (const id of ids) {
      const q = byId.get(id);
      if (q) chaps.add(q.chap);
      if (q && !used.has(q.qid) && !clashes(q, [...assigned.get(t.id)!, ...ok])) {
        ok.push(q);
        continue;
      }
      // flagged, already placed by an earlier workbook set, or a repeat within the set: replace like for like
      if (!q) droppedFlagged++;
      else if (used.has(q.qid)) droppedOverlap++;
      else droppedRepeat++;
      const orig = ukAlloc.find((r) => str(r["Question_ID"]) === id);
      lost.push({
        ca: str(orig?.["Static_or_CA"]) !== "Static",
        diff: (str(orig?.["Difficulty"]) as Diff) || "Medium",
      });
    }
    if (count < ids.length) {
      // half of a workbook set (Agriculture 25 + Energy 25): pick by the UK difficulty mix
      take(t.id, pick(ok, count, UK_MIX, assigned.get(t.id)!));
      const short = count - Math.min(count, ok.length);
      if (short > 0) take(t.id, pick(free((q) => ukStatic(q) && chaps.has(q.chap)), short, UK_MIX, assigned.get(t.id)!));
      continue;
    }
    take(t.id, ok);
    // Top up dropped questions from the same topic (Mixed: any UK static / UK CA) and difficulty.
    for (const u of lost) {
      const mix: Mix = { Easy: 0, Medium: 0, Hard: 0 };
      mix[u.diff] = 1;
      const pool = u.ca
        ? free(ukCA)
        : free((q) => ukStatic(q) && (name.startsWith("Mixed") || chaps.has(q.chap)));
      take(t.id, pick(pool, 1, mix, assigned.get(t.id)!));
    }
  }
}
if (REUSE.some(([n]) => !pinned(byName(n)))) notes.push(
  `Reused ${REUSE.length} workbook sets (Agriculture + Energy combined as 25 + 25). Replaced like for like from the same topic and difficulty: ${droppedFlagged} flagged questions, ${droppedOverlap} that the workbook had put in two sets, and ${droppedRepeat} that repeated another question in the same set.`
);

// ---------- 2. Uttarakhand: new tests ----------

// Statehood I & II: all of CH05, then statehood / post-2000 questions from other chapters by keyword.
const STATEHOOD_RE =
  /statehood|separate (hill )?state|Uttarakhand Kranti Dal|\bUKD\b|Rampur Tiraha|Khatima firing|Mussoorie firing|Muzaffarnagar|Uttaranchal|9 November,? 2000|November 9,? 2000|formation of (the )?(state|Uttarakhand)|Reorgani[sz]ation Act|first (elected )?Chief Minister|first Governor|first Speaker|interim (assembly|government)|Nityanand Swami|Dixit Commission|Kaushik Committee|permanent capital|Gairsain.{0,40}capital|capital.{0,40}Gairsain|President'?s Rule|Uttarakhand'?s Uniform Civil Code|Uniform Civil Code \(UCC\)|Indramani Badoni(?! Samman)|Gandhi of Uttarakhand|Rajya Andolan|state movement|agitation for/i;
const STATEHOOD_EXCLUDE = /North-Eastern|Nainital was made summer capital/i;
const POST2000_RE =
  /\b20(0[1-9]|1\d|2\d)\b|UCC|Uniform Civil|Gairsain|Dhami|Trivendra|Tirath|Harish Rawat|Bahuguna|Khanduri|Nishank|N\.?D\.? Tiwari|Koshyari|Nityanand|Governor|Assembly election|Lok Sabha|Chief Minister/i;
{
  const s1 = byName("Uttarakhand (Post-Independence)");
  const s2 = byName("Uttarakhand Polity");
  const need = s1.target + s2.target;
  const ch05 = free((q) => q.sec === "UKGK" && q.chap === "CH05");
  const kwPool = free((q) => q.sec === "UKGK" && q.chap !== "CH05" && STATEHOOD_RE.test(q.en) && !STATEHOOD_EXCLUDE.test(q.en));
  // the bank has reworded repeats of the same statehood fact: keep one of each
  const kwClean: Q[] = [];
  for (const q of kwPool) if (![...ch05, ...kwClean].some((x) => nearDup(x, q))) kwClean.push(q);
  const chosen = [...ch05, ...pick(kwClean, Math.max(0, need - ch05.length), UK_MIX, ch05)].slice(0, need);
  const late = chosen.filter((q) => POST2000_RE.test(q.en));
  const early = chosen.filter((q) => !POST2000_RE.test(q.en));
  // Movement era goes to I, post-2000 to II; balance the halves by moving the overflow.
  while (early.length > s1.target) late.unshift(early.pop()!);
  while (late.length > s2.target) early.push(late.shift()!);
  if (!pinned(s1)) take(s1.id, shuffle(early));
  if (!pinned(s2)) take(s2.id, shuffle(late));
  if (!pinned(s1) || !pinned(s2)) notes.push(
    `Statehood I & II: ${ch05.length} CH05 questions (bank + GEN) plus ${chosen.length - ch05.length} statehood/post-2000 questions from other UK chapters (keyword match); I = movement era, II = post-2000.`
  );
}

// Art, Crafts, Language & Literature: CH11 by keyword, then CH14 crafts/GI, then CH11 at large.
const ART_RE =
  /author|book|poet|poem|writer|novel|written|wrote|literat|dialect|language|bhasha|boli|script|craft|ringal|aipan|painting|painter|kalam|sculpt|weav|handicraft|copper|tamta|wood|carv|\bart\b|artist|Garhwali|Kumaoni|Jaunsari|magazine|newspaper|Molaram|drama|theatre|cinema|film|GI tag|Geographical Indication/i;
{
  const t = byName("Art Crafts Language & Literature");
  fill(
    t,
    [
      free((q) => ukStatic(q) && q.chap === "CH11" && ART_RE.test(q.en)),
      free((q) => ukStatic(q) && q.chap === "CH14" && ART_RE.test(q.en)),
      free((q) => ukStatic(q) && q.chap === "CH11"),
    ],
    UK_MIX
  );
}

// Uttarakhand CA + Budget: budget-chapter CA first, then budget static, then other UK CA.
{
  const t = byName("Uttarakhand CA + Budget");
  // half the test from the budget chapter, half from other UK current affairs
  if (!pinned(t)) take(t.id, pick(free((q) => ukCA(q) && q.chap === "CH09"), 25, BENCH_MIX, assigned.get(t.id)!));
  fill(t, [free((q) => ukCA(q) && q.chap !== "CH09"), free((q) => ukStatic(q) && q.chap === "CH09")], BENCH_MIX);
}

// Uttarakhand Current Affairs: UK CA outside the budget chapter.
fill(byName("Uttarakhand Current Affairs"), [free((q) => ukCA(q) && q.chap !== "CH09"), free(ukCA)], UK_MIX);

// Topper Test: hard-heavy, spread across chapters.
fill(byName("Topper Test"), [free((q) => ukStatic(q) && q.chap !== "CH00")], TOPPER_MIX);

// ---------- 2b. Uttarakhand: more statement / match questions ----------
// Owner review: raise statement ("1 only / 2 only / both / neither") and
// match-the-following questions to ~45-50% of each of the 20 UK tests. Direct
// questions are swapped in place (same chapter and difficulty where possible)
// for unused non-direct ones: CMB- questions first (each carries 2-4 facts from
// spare direct questions), then the bank's own statement/match questions. The
// swapped-out direct questions go back to the pool.

const isDirect = (q: Q) => /^Factual recall/.test(q.qtype);
const SM_TARGET = 0.46;
const UK_TESTS: [string, (q: Q) => boolean][] = [
  ["Uttarakhand (Post-Independence)", (q) => ukStatic(q) && (q.chap === "CH05" || STATEHOOD_RE.test(q.en)) && !POST2000_RE.test(q.en)],
  ["Uttarakhand Polity", (q) => ukStatic(q) && (q.chap === "CH05" || STATEHOOD_RE.test(q.en)) && POST2000_RE.test(q.en)],
  ["Ancient & Medieval History", (q) => ukStatic(q) && q.chap === "CH03"],
  ["Gorkha & British rule & Freedom Struggle", (q) => ukStatic(q) && q.chap === "CH04"],
  ["Physical Geography", (q) => ukStatic(q) && q.chap === "CH01"],
  ["Forests Flora-Fauna & National Parks", (q) => ukStatic(q) && q.chap === "CH02"],
  ["Demography & Census", (q) => ukStatic(q) && q.chap === "CH07"],
  ["Polity & Administration", (q) => ukStatic(q) && q.chap === "CH06"],
  ["Economy Development & Budget", (q) => ukStatic(q) && q.chap === "CH09"],
  ["Agriculture Energy & Infrastructure", (q) => ukStatic(q) && (q.chap === "CH08" || q.chap === "CH13")],
  ["Festivals Fairs Folk Music & Dance", (q) => ukStatic(q) && q.chap === "CH11" && !ART_RE.test(q.en)],
  ["Art Crafts Language & Literature", (q) => ukStatic(q) && (q.chap === "CH11" || q.chap === "CH14") && ART_RE.test(q.en)],
  ["Tourism & Sacred Sites", (q) => ukStatic(q) && q.chap === "CH12"],
  ["Uttarakhand Current Affairs", ukCA],
  ["Mixed Mock A", (q) => ukStatic(q) && q.chap !== "CH00"],
  ["Mixed Mock B", (q) => ukStatic(q) && q.chap !== "CH00"],
  ["Mixed Mock C", (q) => ukStatic(q) && q.chap !== "CH00"],
  ["Mixed Mock D", (q) => ukStatic(q) && q.chap !== "CH00"],
  ["Topper Test", (q) => ukStatic(q) && q.chap !== "CH00"],
  ["Grand Uttarakhand Mock", (q) => ukStatic(q) && q.chap !== "CH00"], // boosted after it is built (section 5)
];
const ukTestIds = new Set(UK_TESTS.map(([name]) => byName(name).id));
const smShort: string[] = [];
let smCombined = 0;
let smBank = 0;
function boostFormats(name: string, fits: (q: Q) => boolean) {
  const t = byName(name);
  const qs = assigned.get(t.id)!;
  let need = Math.ceil(SM_TARGET * qs.length) - qs.filter((q) => !isDirect(q)).length;
  if (need <= 0) return;
  const cands = free((q) => !isDirect(q) && fits(q));
  // CMB- first, then the bank; each group in a fixed shuffled order
  const ordered = [...shuffle(cands.filter((q) => q.srcs)), ...shuffle(cands.filter((q) => !q.srcs))];
  // swap out direct questions from the chapters the test has most of first, so topic balance holds
  const chapCount: Record<string, number> = {};
  qs.forEach((q) => (chapCount[q.chap] = (chapCount[q.chap] || 0) + 1));
  const outs = shuffle(qs.filter(isDirect)).sort((a, b) => chapCount[b.chap] - chapCount[a.chap]);
  for (const out of outs) {
    if (need <= 0) break;
    const i = qs.indexOf(out);
    const others = qs.filter((_, j) => j !== i);
    const ok = (r: Q) => !used.has(r.qid) && !clashes(r, others);
    const rep =
      ordered.find((r) => ok(r) && r.chap === out.chap && r.diff === out.diff) ??
      ordered.find((r) => ok(r) && r.chap === out.chap) ??
      ordered.find((r) => ok(r) && r.diff === out.diff) ??
      ordered.find(ok);
    if (!rep) break;
    used.delete(out.qid);
    used.add(rep.qid);
    qs[i] = rep;
    if (rep.srcs) smCombined++;
    else smBank++;
    need--;
  }
  if (need > 0) smShort.push(`${name} (${need} short)`);
}
for (const [name, fits] of UK_TESTS.slice(0, -1)) boostFormats(name, fits);
const boostNote = () =>
  notes.push(
  `UK statement/match boost (target ${Math.round(SM_TARGET * 100)}% per test): swapped in ${smCombined} CMB- and ${smBank} bank statement/match questions for direct ones.` +
    (smShort.length ? ` Not enough candidates for: ${smShort.join(", ")}.` : "")
);

// ---------- 3. Weights (2024-25 benchmark) ----------

const BENCH: Record<string, Record<string, number>> = {
  UKGK: { CH01: 14, CH02: 10, CH03: 4, CH04: 9, CH05: 1, CH06: 7, CH07: 6, CH08: 5, CH09: 6, CH10: 3, CH11: 11, CH12: 1, CH13: 5, CH14: 5 },
  CA: { AWD: 1, INT: 11, NAT: 13, RPI: 2, SPT: 1 },
  POL: { BOD: 8, CON: 25, GEN: 5, STA: 1, UNI: 9 },
  HIS: { ANC: 9, CUL: 0, GEN: 1, MED: 10, MOD: 14 },
  GEO: { GEN: 0, IND: 18, PHY: 7, WLD: 8 },
  SCI: { BIO: 10, CHE: 4, GEN: 0, ICT: 7, PHY: 7, SPD: 0 },
  ECO: { AGR: 3, BNK: 4, DEV: 5, FIS: 0, GEN: 4, TRD: 4 },
  ENV: { BIO: 8, CLI: 2, GEN: 1, POL: 3 },
};
// +1 smoothing so every topic gets a little coverage
const smooth = (w: Record<string, number>) => Object.fromEntries(Object.entries(w).map(([k, v]) => [k, v + 1]));

/** Choose n questions from a section pool by topic weights (capped by supply) and difficulty mix. */
function chooseByTopic(pool: Q[], n: number, weights: Record<string, number>, mix: Mix, against?: Q[]): Q[] {
  const avail = pool.filter((q) => !used.has(q.qid));
  const byChap = new Map<string, Q[]>();
  for (const q of avail) {
    if (!byChap.has(q.chap)) byChap.set(q.chap, []);
    byChap.get(q.chap)!.push(q);
  }
  const w: Record<string, number> = {};
  for (const [c, v] of Object.entries(weights)) if (byChap.has(c)) w[c] = v;
  let quota = split(n, w);
  // cap by supply and hand the surplus to topics that still have questions (cross-topic fill)
  for (let guard = 0; guard < 10; guard++) {
    let spill = 0;
    const open: Record<string, number> = {};
    for (const c of Object.keys(quota)) {
      const have = byChap.get(c)!.length;
      if (quota[c] > have) {
        spill += quota[c] - have;
        quota[c] = have;
      } else if (quota[c] < have) open[c] = w[c] || 1;
    }
    if (!spill || !Object.keys(open).length) break;
    const add = split(spill, open);
    for (const c of Object.keys(add)) quota[c] += add[c];
  }
  quota = Object.fromEntries(Object.entries(quota).filter(([, v]) => v > 0));
  const out: Q[] = [];
  // `against` (single-test use): skip repeats of questions already in that test
  const ctx = () => (against ? [...against, ...out] : []);
  for (const [c, k] of Object.entries(quota)) out.push(...pick(byChap.get(c)!, k, mix, ctx()));
  // anything still missing (e.g. no weighted topics left): take from the rest of the pool
  if (out.length < n) {
    const taken = new Set(out.map((q) => q.qid));
    out.push(...pick(avail.filter((q) => !taken.has(q.qid) && !weights[q.chap]), n - out.length, mix, ctx()));
  }
  if (out.length < n) {
    const taken = new Set(out.map((q) => q.qid));
    out.push(...pick(avail.filter((q) => !taken.has(q.qid)), n - out.length, mix, ctx()));
  }
  return out;
}

/** Deal chosen questions to several tests so each gets an even share of every difficulty and topic. */
function deal(items: Q[], slots: { t: TestDef; n: number }[], refill: () => Q[], tagOf: Map<string, string>, tag: string) {
  const order: Record<Diff, number> = { Hard: 0, Easy: 1, Medium: 2 };
  const sorted = interleave(items).sort((a, b) => order[a.diff] - order[b.diff]);
  const got = new Map(slots.map((s) => [s.t.id, 0]));
  const diffGot = new Map(slots.map((s) => [s.t.id, { Easy: 0, Medium: 0, Hard: 0 } as Mix]));
  const totalN = slots.reduce((a, s) => a + s.n, 0) || 1;
  const perDiff: Mix = { Easy: 0, Medium: 0, Hard: 0 };
  items.forEach((q) => perDiff[q.diff]++);
  for (const q of sorted) {
    let best: { t: TestDef; n: number } | null = null;
    let bestKey = -Infinity;
    for (const s of shuffle(slots)) {
      const g = got.get(s.t.id)!;
      if (g >= s.n || clashes(q, assigned.get(s.t.id)!)) continue;
      // largest shortfall against this test's proportional share of the difficulty level
      const expected = (perDiff[q.diff] * s.n) / totalN;
      const key = expected - diffGot.get(s.t.id)![q.diff] + (0.001 * (s.n - g)) / s.n;
      if (key > bestKey) {
        bestKey = key;
        best = s;
      }
    }
    if (!best) continue; // repeats a question in every test with room: leave it in the bank
    take(best.t.id, [q]);
    tagOf.set(q.qid, tag);
    got.set(best.t.id, got.get(best.t.id)! + 1);
    diffGot.get(best.t.id)![q.diff]++;
  }
  // tests left short by skipped repeats: top up from the rest of the section
  for (const s of slots) {
    const short = s.n - got.get(s.t.id)!;
    if (short <= 0) continue;
    const extra = pick(refill(), short, BENCH_MIX, assigned.get(s.t.id)!);
    take(s.t.id, extra);
    extra.forEach((q) => tagOf.set(q.qid, tag));
  }
}

// ---------- 4. Current Affairs tests ----------

/** Latest month/year mentioned in the question or explanation (2023-2026), as yyyymm; 0 if undated. */
function dateKey(q: Q): number {
  const text = `${q.en} ${q.exEn}`;
  let best = 0;
  for (const m of text.matchAll(/\b(January|February|March|April|May|June|July|August|September|October|November|December),?\s+(?:\d{1,2},?\s+)?(202[3-6])\b/gi)) {
    best = Math.max(best, Number(m[2]) * 100 + MONTHS.indexOf(m[1].toLowerCase()) + 1);
  }
  for (const m of text.matchAll(/\b\d{1,2}\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(202[3-6])\b/gi)) {
    best = Math.max(best, Number(m[2]) * 100 + MONTHS.indexOf(m[1].toLowerCase()) + 1);
  }
  if (!best) {
    for (const m of text.matchAll(/\b(202[3-6])\b/g)) best = Math.max(best, Number(m[1]) * 100);
  }
  return best;
}
const caQ = (q: Q) => q.sec === "CA";

// Owner review: named, theme-based CA tests instead of "Set 1-8". Each CA
// question gets one theme: chapter first (sports, awards, reports), then
// keywords in the question and its answer, in this priority order.
const SPORT_RE =
  /olympic|cricket|football|hockey|tennis|badminton|chess|athlet|medal|championship|tournament|world cup|\bgames\b|sport|boxing|wrestl|shooting|javelin|grand slam|trophy|FIFA|\bIPL\b/i;
const AWARD_RE = /award|prize|puraskar|ratna|padma|honou?r|conferred|Booker|Nobel|Oscar|Jnanpith|Sahitya Akademi/i;
const SCITECH_RE =
  /satellite|ISRO|NASA|space|rocket|missile|DRDO|defen[cs]e|\barmy\b|\bnavy\b|air force|military|joint exercise|naval exercise|warship|submarine|fighter|aircraft carrier|artificial intelligence|\bAI\b|quantum|semiconductor|supercomputer|vaccine|nuclear|scientist|drone|\b[56]G\b|cyber|genome|telescope|lunar|Chandrayaan|Gaganyaan|Aditya-L1/i;
const ENVIRO_RE =
  /environment|climate|wildlife|tiger|forest|species|biodiversity|ramsar|wetland|pollution|emission|carbon|\bCOP ?\d|conservation|national park|sanctuary|glacier|renewable|biosphere|elephant|mangrove|coral|heatwave/i;
const ECON_RE =
  /econom|GDP|budget|RBI|inflation|\bbank|\btax|GST|export|import|trade|fiscal|monetary|investment|repo rate|rupee|stock|SEBI|FDI|revenue|\bUPI\b|digital payment|currency|disinvest/i;
const SCHEME_RE = /scheme|yojana|mission|abhiyan|index|report|ranking|ranked|survey|programme|portal|initiative/i;
const PERSON_RE =
  /appointed|chief justice|chairman|chairperson|became the first|sworn in|passed away|\bdied\b|\bCEO\b|director general|elected (as )?(the )?(new )?(president|chief|head)/i;

function caTheme(q: Q): string {
  const t = `${q.en} ${answerOf(q)}`;
  if (q.chap === "SPT" || SPORT_RE.test(t)) return "SPT";
  if (q.chap === "AWD" || AWARD_RE.test(t)) return "AWD";
  if (q.chap === "RPI") return "SCH";
  if (SCITECH_RE.test(t)) return "SCI";
  if (ENVIRO_RE.test(t)) return "ENV";
  if (ECON_RE.test(t)) return "ECO";
  if (SCHEME_RE.test(t)) return "SCH";
  if (PERSON_RE.test(t)) return "SPT";
  return q.chap === "INT" ? "INT" : "NAT";
}

const CA_SUBJECT = "Current Affairs";
const CA_REVISION_SUBJECT = "Current Affairs Revision";
// Themes as listed in the owner review (Uttarakhand CA has its own UK tests).
// Awards alone has ~60 questions, so it shares a test with environment.
const CA_THEMES: [string, string, string[]][] = [
  ["Current Affairs - Theme 1", "CA: International Relations & Summits", ["INT"]],
  ["Current Affairs - Theme 2", "CA: Schemes, Reports & Indices", ["SCH"]],
  ["Current Affairs - Month 1", "CA: National Affairs & Governance", ["NAT"]],
  ["Current Affairs - Month 2", "CA: Economy & Budget", ["ECO"]],
  ["Current Affairs - Month 3", "CA: Science, Tech, Defence & Space", ["SCI"]],
  ["Current Affairs - Month 4", "CA: Environment & Awards", ["ENV", "AWD"]],
  ["Current Affairs - Month 5", "CA: Sports & Persons in News", ["SPT"]],
];
// Revision tests: questions dated to those years (month or year mentioned), spread over themes.
const CA_REVISIONS: [string, string, number, number][] = [
  ["Current Affairs - Month 6", "CA Revision: 2023-24", 202300, 202499],
  ["Current Affairs - Month 7", "CA Revision: 2025", 202500, 202599],
  ["Current Affairs - Month 8", "CA Revision: 2026", 202600, 202699],
];
const revisionIds = new Set<string>();
{
  const themeCount: Record<string, number> = {};
  free(caQ).forEach((q) => (themeCount[caTheme(q)] = (themeCount[caTheme(q)] || 0) + 1));
  notes.push(`CA pool by theme before allocation: ${JSON.stringify(themeCount)}`);

  for (const [seedName, name, from, to] of CA_REVISIONS) {
    const t = byName(seedName);
    newNames.set(t.id, name);
    newSubjects.set(t.id, CA_REVISION_SUBJECT);
    revisionIds.add(t.id);
    if (pinned(t)) continue;
    // pick() interleaves by chapter; interleave by theme instead via a theme-keyed copy
    const inRange = free((q) => caQ(q) && dateKey(q) >= from && dateKey(q) <= to);
    const byTheme = new Map(inRange.map((q) => [q.qid, { ...q, chap: caTheme(q) }]));
    const chosen = pick([...byTheme.values()], t.target, BENCH_MIX, assigned.get(t.id)!).map((x) => byId.get(x.qid)!);
    take(t.id, chosen);
    if (chosen.length < t.target) notes.push(`${name}: only ${chosen.length} dated questions available`);
  }

  for (const [seedName, name, keys] of CA_THEMES) {
    const t = byName(seedName);
    newNames.set(t.id, name);
    newSubjects.set(t.id, CA_SUBJECT);
    fill(t, [free((q) => caQ(q) && keys.includes(caTheme(q)))], BENCH_MIX);
    const got = assigned.get(t.id)!.length;
    if (got < t.target) notes.push(`${name}: only ${got} questions on this theme`);
  }
  const grand = byName("Current Affairs Grand Revision");
  newSubjects.set(grand.id, CA_REVISION_SUBJECT);
  if (!pinned(grand)) take(grand.id, chooseByTopic(free(caQ), grand.target, smooth(BENCH.CA), BENCH_MIX, []));
}

// ---------- 5. Full mocks + sectionals by section ----------

const mocks = Array.from({ length: 12 }, (_, i) => byName(`Full Mock ${i + 1}`));
const MOCK_MIX: Record<string, number> = { HIS: 17, GEO: 16, POL: 24, ECO: 10, ENV: 7, SCI: 14, CA: 14, UKGK: 48 };
const SECTION_ORDER = ["HIS", "GEO", "POL", "ECO", "ENV", "SCI", "CA", "UKGK"];
const UK_CA_PER_MOCK = 2; // ~4/95 of UK questions in the 2024-25 papers were current affairs
const sectionTag = new Map<string, string>();

const SECTIONALS: Record<string, [string, number][]> = {
  HIS: [["History Sectional I", 50], ["History Sectional II", 50]],
  GEO: [["Geography Sectional I", 50], ["Geography Sectional II", 50]],
  POL: [["Polity Sectional I", 50], ["Polity Sectional II", 50]],
  SCI: [["Science & Tech Sectional I", 50], ["Science & Tech Sectional II", 50]],
  ECO: [["Economy & Environment Sectional I", 29], ["Economy & Environment Sectional II", 29]],
  ENV: [["Economy & Environment Sectional I", 21], ["Economy & Environment Sectional II", 21]],
  UKGK: [["Uttarakhand GK Sectional I", 50 - UK_CA_PER_MOCK], ["Uttarakhand GK Sectional II", 50 - UK_CA_PER_MOCK]],
  CA: [],
};

// Grand Uttarakhand Mock and the UK share of the mocks come from the same static pool, so do the
// section passes (smallest supply margins first) before the Grand UK Mock.
for (const sec of ["HIS", "GEO", "SCI", "POL", "ENV", "ECO", "CA", "UKGK"]) {
  const perMock = sec === "UKGK" ? MOCK_MIX[sec] - UK_CA_PER_MOCK : MOCK_MIX[sec];
  const slots = [
    ...mocks.map((t) => ({ t, n: perMock })),
    ...SECTIONALS[sec].map(([name, n]) => ({ t: byName(name), n })),
  ].filter((s) => !pinned(s.t));
  const n = slots.reduce((s, x) => s + x.n, 0);
  const pool = all.filter((q) => q.sec === sec && (sec !== "UKGK" || !q.isCA));
  deal(chooseByTopic(pool, n, smooth(BENCH[sec]), BENCH_MIX), slots, () => pool, sectionTag, sec);
  if (sec === "UKGK") {
    const caSlots = [
      ...mocks.map((t) => ({ t, n: UK_CA_PER_MOCK })),
      ...SECTIONALS.UKGK.map(([name]) => ({ t: byName(name), n: UK_CA_PER_MOCK })),
    ].filter((s) => !pinned(s.t));
    const caN = caSlots.reduce((s, x) => s + x.n, 0);
    deal(pick(free(ukCA), caN, BENCH_MIX), caSlots, () => all.filter(ukCA), sectionTag, "UKGK");
  }
}

{
  const t = byName("Grand Uttarakhand Mock");
  if (!pinned(t)) take(t.id, chooseByTopic(free(ukStatic), t.target, smooth(BENCH.UKGK), UK_MIX, []));
  const [name, fits] = UK_TESTS[UK_TESTS.length - 1];
  boostFormats(name, fits);
  boostNote();
}

// ---------- 5b. Free Sample Mock ----------
// 50 questions in the full-mock section mix (scaled from 150), from questions in no paid test.
{
  const SAMPLE_MIX: Record<string, number> = { HIS: 6, GEO: 5, POL: 8, ECO: 3, ENV: 2, SCI: 5, CA: 5, UKGK: 16 };
  for (const [sec, n] of Object.entries(pinned(FREE_SAMPLE) ? {} : SAMPLE_MIX)) {
    const pool = all.filter((q) => q.sec === sec && (sec !== "UKGK" || !q.isCA));
    take(FREE_SAMPLE.id, chooseByTopic(pool, n, smooth(BENCH[sec]), BENCH_MIX, assigned.get(FREE_SAMPLE.id)!));
  }
}

// Order: mocks by section (paper order), CA revisions by date, everything else shuffled.
for (const t of tests) {
  const qs = assigned.get(t.id)!;
  if (pinned(t)) continue;
  if (revisionIds.has(t.id)) {
    assigned.set(t.id, shuffle(qs).sort((a, b) => dateKey(a) - dateKey(b)));
  } else if (t.subject === "Full Mock" || t.id === FREE_SAMPLE.id) {
    const bySec = SECTION_ORDER.flatMap((s) => shuffle(qs.filter((q) => q.sec === s)));
    assigned.set(t.id, bySec);
  } else if (!t.name.startsWith("Statehood")) {
    assigned.set(t.id, shuffle(qs));
  }
}

// ---------- 5c. Replace questions deactivated in the database ----------
// A question an admin deactivated (status 'inactive', e.g. after a student
// report) is swapped in place for an unused one: same section, preferring the
// same chapter, difficulty and (for current affairs) a nearby date. Every
// other test stays exactly as allocated. Both the dry run and --apply read
// the inactive list (read-only), so they agree.

const replacements: string[] = [];

function replaceInactive() {
  replacements.push(...liveWarnings);
  for (const t of tests) {
    const qs = assigned.get(t.id)!;
    qs.forEach((q, i) => {
      if (!inactiveIds.has(q.qid)) return;
      const others = qs.filter((_, j) => j !== i);
      const same = (x: Q) => x.sec === q.sec && x.isCA === q.isCA && !inactiveIds.has(x.qid);
      const d = dateKey(q);
      const near = (x: Q) => {
        const k = dateKey(x);
        if (!d || !k) return !d && !k;
        const months = (y: number) => Math.floor(y / 100) * 12 + (y % 100);
        return Math.abs(months(k) - months(d)) <= 2;
      };
      const mix: Mix = { Easy: 0, Medium: 0, Hard: 0 };
      mix[q.diff] = 1;
      const groups = [
        free((x) => same(x) && x.chap === q.chap && near(x)),
        free((x) => same(x) && x.chap === q.chap),
        free(same),
      ];
      let rep: Q | undefined;
      for (const g of groups) if (!rep) rep = pick(g, 1, mix, others)[0];
      const name = newNames.get(t.id) ?? t.name;
      if (!rep) {
        replacements.push(`${name}: ${q.qid} is inactive and no replacement was available`);
        return;
      }
      used.add(rep.qid);
      qs[i] = rep;
      replacements.push(`${name}: ${q.qid} (inactive) -> ${rep.qid} (${rep.chap}, ${rep.diff})`);
    });
  }
}

// ---------- 6. Report ----------

let allAssigned: string[] = [];

function report() {
const pad = (s: string | number, n: number) => String(s).padEnd(n);
const lpad = (s: string | number, n: number) => String(s).padStart(n);
const NON_DIRECT = (q: Q) => !/^Factual recall/.test(q.qtype);

console.log(`\nQuestion bank load — ${APPLY ? "APPLY" : "DRY RUN (nothing is written)"}`);
console.log("=".repeat(78));
const genCount = all.filter((q) => q.gen).length;
console.log(`Master bank rows:          ${masterRows.length}`);
console.log(`  excluded (Review_Flag):  ${flaggedIds.size}`);
console.log(`  excluded (future date):  ${futureDated.length}` + (futureDated.length ? ` — mention a month after ${Math.floor(NOW_KEY / 100)}-${String(NOW_KEY % 100).padStart(2, "0")}:` : ""));
for (const f of futureDated) console.log(`    ${f.qid}  (${Math.floor(f.key / 100)}-${String(f.key % 100).padStart(2, "0")})`);
console.log(`Generated (GEN-) rows:     ${genRows.length}`);
console.log(
  `Combined (CMB-) rows:      ${cmbRows.length}` +
    (cmbRows.length ? `, built from ${heldBack.size} direct questions (kept in the bank, out of tests)` : " — COMBINED_QUESTIONS.xlsx not found")
);
if (droppedCombined.length) console.log(`  CMB- left out: ${droppedCombined.join("; ")}`);
console.log(`Rejected (invalid rows):   ${rejected.length}`);
console.log(`Duplicate IDs skipped:     ${duplicateIds}`);
const cmbCount = all.filter((q) => q.srcs).length;
console.log(`Questions to upsert:       ${all.length} (bank ${all.length - genCount}, GEN ${genCount - cmbCount}, CMB ${cmbCount})`);
if (rejected.length) {
  const why: Record<string, number> = {};
  rejected.forEach((r) => (why[r.reason] = (why[r.reason] || 0) + 1));
  console.log(`  rejected by reason: ${JSON.stringify(why)}`);
}

console.log(`\nTests (56 non-CSAT + Free Sample Mock; CSAT 1-6 left empty; * = one of the 20 UK tests)`);
console.log("  CMB = combined statement/match; Book = from the Uttarakhand MCQ book scans; Chg = questions not in the test in the database now");
console.log(
  `${pad("Test", 50)}${lpad("Q", 5)}${lpad("E", 5)}${lpad("M", 5)}${lpad("H", 5)}${lpad("S/M%", 6)}${lpad("GEN", 5)}${lpad("CMB", 5)}${lpad("Book", 5)}${lpad("Chg", 5)}  Note`
);
const short: string[] = [];
for (const t of tests) {
  const qs = assigned.get(t.id)!;
  const e = qs.filter((q) => q.diff === "Easy").length;
  const m = qs.filter((q) => q.diff === "Medium").length;
  const h = qs.filter((q) => q.diff === "Hard").length;
  const sm = qs.length ? Math.round((100 * qs.filter(NON_DIRECT).length) / qs.length) : 0;
  const g = qs.filter((q) => q.gen && !q.srcs).length;
  const c = qs.filter((q) => q.srcs).length;
  const book = qs.filter((q) => q.srcFile.startsWith("Uttarakhand MCQ book")).length;
  const live = liveQids.get(t.id);
  const chg = live?.length ? qs.filter((q) => !live.includes(q.qid)).length : "-";
  const name = (ukTestIds.has(t.id) ? "* " : "") + (newNames.get(t.id) ?? t.name);
  const note = qs.length < t.target ? `SHORT by ${t.target - qs.length}` : "";
  if (note) short.push(`${name}: ${qs.length}/${t.target}`);
  console.log(
    `${pad(name.slice(0, 49), 50)}${lpad(qs.length, 5)}${lpad(e, 5)}${lpad(m, 5)}${lpad(h, 5)}${lpad(sm, 6)}${lpad(g, 5)}${lpad(c, 5)}${lpad(book, 5)}${lpad(chg, 5)}  ${note}`
  );
}

console.log("\nSection mix per Full Mock (target HIS 17 / GEO 16 / POL 24 / ECO 10 / ENV 7 / SCI 14 / CA 14 / UKGK 48)");
for (const t of mocks) {
  const qs = assigned.get(t.id)!;
  console.log(`  ${pad(t.name, 13)} ${SECTION_ORDER.map((s) => `${s} ${qs.filter((q) => q.sec === s).length}`).join(" / ")}`);
}

allAssigned = tests.flatMap((t) => assigned.get(t.id)!.map((q) => q.qid));
const reuse = allAssigned.length - new Set(allAssigned).size;
const total = (f: (q: Q) => boolean) => tests.flatMap((t) => assigned.get(t.id)!).filter(f).length;
console.log(`\nQuestions placed in tests: ${allAssigned.length}`);
console.log(
  `Difficulty overall:        Easy ${total((q) => q.diff === "Easy")} / Medium ${total((q) => q.diff === "Medium")} / Hard ${total((q) => q.diff === "Hard")}  (benchmark 43% / 50% / 7%)`
);
console.log(`Statement/Match/other non-direct share: ${Math.round((100 * total(NON_DIRECT)) / allAssigned.length)}%`);
console.log(`Reuse count (questions in more than one test): ${reuse}`);
console.log(`Tests below target size: ${short.length ? short.join("; ") : "none"}`);
const dupPairs: string[] = [];
for (const t of tests) {
  const qs = assigned.get(t.id)!;
  for (let i = 0; i < qs.length; i++)
    for (let j = i + 1; j < qs.length; j++)
      if (clashes(qs[i], [qs[j]])) dupPairs.push(`${newNames.get(t.id) ?? t.name}: ${qs[i].qid} ~ ${qs[j].qid}`);
}
console.log(`Near-duplicate pairs inside a test (same answer, similar wording): ${dupPairs.length}`);
dupPairs.slice(0, 40).forEach((d) => console.log(`  ${d}`));
const left: Record<string, number> = {};
all.filter((q) => !used.has(q.qid)).forEach((q) => (left[q.sec] = (left[q.sec] || 0) + 1));
console.log(`Unused questions left in the bank by section: ${JSON.stringify(left)} (plus ${heldBack.size} held back as CMB- sources)`);
const ukAll = [...ukTestIds].flatMap((id) => assigned.get(id)!);
console.log(`20 UK tests, statement/match/other non-direct share: ${Math.round((100 * ukAll.filter(NON_DIRECT).length) / (ukAll.length || 1))}%`);
console.log("Test names / subjects set by this run:");
for (const t of tests) {
  if (newNames.has(t.id) || newSubjects.has(t.id)) {
    console.log(`  ${t.name} -> ${newNames.get(t.id) ?? t.name}  [${newSubjects.get(t.id) ?? t.subject}]`);
  }
}

// An option whose English and Hindi halves carry different numbers was
// probably split at the wrong " / " (or has a typo in the sheet).
const numberMismatch: string[] = [];
for (const q of all) {
  q.opts.forEach((o, i) => {
    if (o.en !== o.hi && numbersIn(o.en) !== numbersIn(o.hi)) {
      numberMismatch.push(`${q.qid} ${"ABCD"[i]}: "${o.en}" | "${o.hi}"${used.has(q.qid) ? "  [in a test]" : ""}`);
    }
  });
}
console.log(`Options whose English and Hindi numbers differ: ${numberMismatch.length}`);
numberMismatch.forEach((m) => console.log(`  ${m}`));
console.log(`Inactive in the database: ${inactiveIds.size}; replaced in tests: ${replacements.filter((r) => r.includes("->")).length}`);
replacements.forEach((r) => console.log(`  ${r}`));
console.log("\nNotes:");
notes.forEach((n) => console.log(`  - ${n}`));

if (reuse !== 0) throw new Error("Reuse count is not 0 — refusing to continue.");

if (WRITE_PLAN) {
  const rows: Row[] = [];
  for (const t of tests) {
    assigned.get(t.id)!.forEach((q, i) =>
      rows.push({
        Test_ID: t.id,
        Test_Name: newNames.get(t.id) ?? t.name,
        Q_No: i + 1,
        Question_ID: q.qid,
        Section: q.sec,
        Chapter: q.chap,
        Difficulty: q.diff,
        Question_Type: q.qtype,
        Source_File: q.srcFile,
        Question: q.en.slice(0, 160),
      })
    );
  }
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), "Allocation");
  XLSX.writeFile(wb, PLAN_FILE);
  console.log(`\nWrote ${rows.length} rows to ${PLAN_FILE}`);
}
}

// ---------- 7. Apply ----------

function readEnv(): Record<string, string> {
  if (!fs.existsSync(ENV_FILE)) throw new Error(`Missing ${ENV_FILE}`);
  const env: Record<string, string> = {};
  for (const line of fs.readFileSync(ENV_FILE, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return env;
}

async function apply() {
  const env = readEnv();
  const url = env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL;
  const key = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY missing in .env.local");
  const db = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });

  // Tests must exist before anything is written.
  const { data: existing, error: tErr } = await db.from("tests").select("id").in("id", tests.map((t) => t.id));
  if (tErr) throw new Error(`Could not read tests: ${tErr.message}`);
  const have = new Set((existing ?? []).map((r) => r.id as string));
  const missing = tests.filter((t) => !have.has(t.id));
  if (missing.length) {
    throw new Error(
      `${missing.length} tests are missing (e.g. "${missing[0].name}"). Run supabase/seed-phase6-tests.sql and schema-phase14-bank-browser.sql first.`
    );
  }

  const now = new Date().toISOString();
  const rows = all.map((q) => ({
    question_id: q.qid,
    subject: q.subject,
    topic: q.chapName.slice(0, 100) || null,
    subtopic: q.chap || null,
    difficulty: q.diff,
    year: null,
    question_text_english: q.en,
    question_text_hindi: q.hi,
    option_a_english: q.opts[0].en,
    option_a_hindi: q.opts[0].hi,
    option_b_english: q.opts[1].en,
    option_b_hindi: q.opts[1].hi,
    option_c_english: q.opts[2].en,
    option_c_hindi: q.opts[2].hi,
    option_d_english: q.opts[3].en,
    option_d_hindi: q.opts[3].hi,
    correct_answer: q.ans,
    explanation_english: q.exEn || null,
    explanation_hindi: q.exHi || null,
    source_file: q.srcFile,
    question_format: q.qtype || null,
    section_code: q.sec || null,
    // no `status`: new rows get the column default ('active'), and a question
    // an admin deactivated after a student report stays inactive on re-runs
    updated_at: now,
  }));

  console.log(`\nUpserting ${rows.length} questions in batches of 500...`);
  for (let i = 0; i < rows.length; i += 500) {
    const batch = rows.slice(i, i + 500);
    const { error } = await db.from("questions").upsert(batch, { onConflict: "question_id" });
    if (error) {
      throw new Error(
        `Upsert failed at rows ${i + 1}-${i + batch.length}: ${error.message}` +
          (/unique|constraint|ON CONFLICT/i.test(error.message)
            ? " — run supabase/schema-phase8-question-bank.sql first."
            : /source_file|question_format|section_code/.test(error.message)
              ? " — run supabase/schema-phase14-bank-browser.sql first."
              : "")
      );
    }
    console.log(`  ${Math.min(i + 500, rows.length)}/${rows.length}`);
  }

  // question_id -> uuid
  const uuid = new Map<string, string>();
  const needed = [...new Set(allAssigned)];
  for (let i = 0; i < needed.length; i += 200) {
    const { data, error } = await db.from("questions").select("id, question_id").in("question_id", needed.slice(i, i + 200));
    if (error) throw new Error(`Could not read back question ids: ${error.message}`);
    for (const r of data ?? []) uuid.set(r.question_id as string, r.id as string);
  }
  const unmapped = needed.filter((id) => !uuid.has(id));
  if (unmapped.length) throw new Error(`${unmapped.length} questions not found after upsert (e.g. ${unmapped[0]})`);

  console.log(`Updating ${tests.length} tests...`);
  for (const t of tests) {
    const ids = assigned.get(t.id)!.map((q) => uuid.get(q.qid)!);
    const patch: Record<string, unknown> = {
      question_ids: ids,
      total_questions: ids.length,
      negative_marking_value: NEGATIVE_FRACTION,
      updated_at: now,
    };
    if (newNames.has(t.id)) patch.test_name = newNames.get(t.id);
    if (newSubjects.has(t.id)) patch.subject = newSubjects.get(t.id);
    const { error } = await db.from("tests").update(patch).eq("id", t.id);
    if (error) throw new Error(`Updating "${t.name}" failed: ${error.message}`);
  }
  console.log(`Done: ${rows.length} questions upserted, ${tests.length} tests filled.`);
}

async function main() {
  replaceInactive();
  report();
  if (APPLY) await apply();
  else console.log("\nDry run only. Re-run with --apply to write to the database.");
}

main().catch((err: unknown) => {
  console.error(`\nERROR: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});
