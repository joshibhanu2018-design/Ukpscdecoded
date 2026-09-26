/**
 * Build COMBINED_QUESTIONS.xlsx: CMB- questions that each combine 2-4 facts
 * from spare direct ("Factual recall") Uttarakhand questions of the bank into
 * one statement or match-the-following question. The loader
 * (load-question-bank.mts) reads the file, prefers these questions when it
 * raises the statement/match share of the Uttarakhand tests, and keeps their
 * source questions out of every test (they stay in the bank).
 *
 *   cd website
 *   npx --yes tsx scripts/build-combined-questions.mts
 *
 * Input:  ../test series questions/work/cmb/combined.txt  (question data: git-ignored)
 * Output: ../test series questions/COMBINED_QUESTIONS.xlsx
 *
 * Spec format — questions separated by a blank line, "#" starts a comment:
 *   S2 | S3 | M4                 2 or 3 statements, or a 4-pair match
 *   <ID> | <English> | <Hindi> [| <letter>]
 *       A statement. {A} marks where the answer goes: the source question's
 *       correct option makes it true; a letter puts that (wrong) option there
 *       instead and makes it false. Both languages are filled from the option.
 *   <ID> | <List-I English> | <List-I Hindi>
 *       A match pair; List-II is the source question's correct option.
 * <ID> may leave out the "UKPCS-UKGK-" prefix. Question IDs are
 * CMB-UKGK-<chapter>-NNNN numbered per chapter in file order, so only ever
 * append to the spec once questions are live.
 */
import * as fs from "fs";
import * as path from "path";
import { createRequire } from "module";
import { splitOption, str } from "./question-bank-common.mjs";

const XLSX: typeof import("xlsx") = createRequire(import.meta.url)("xlsx");

const WEBSITE = fs.existsSync(path.join(process.cwd(), "scripts", "build-combined-questions.mts"))
  ? process.cwd()
  : path.join(process.cwd(), "website");
const DATA_DIR = path.join(WEBSITE, "..", "test series questions");
const SPEC_FILE = path.join(DATA_DIR, "work", "cmb", "combined.txt");
const OUT_FILE = path.join(DATA_DIR, "COMBINED_QUESTIONS.xlsx");
const PLAN_FILE = path.join(DATA_DIR, "TEST_ALLOCATION_PLAN.xlsx");

type Row = Record<string, unknown>;
type Opt = { en: string; hi: string };
interface Src {
  id: string;
  row: Row;
  opts: Opt[];
  ans: number;
  diff: string;
}

const sheet = (file: string, name: string): Row[] =>
  XLSX.utils.sheet_to_json<Row>(XLSX.readFile(file).Sheets[name], { defval: "" });

const bank = new Map<string, Src>();
for (const r of [
  ...sheet(path.join(DATA_DIR, "MERGED_QUESTION_BANK_v2.xlsx"), "Question Bank"),
  ...sheet(path.join(DATA_DIR, "GENERATED_QUESTIONS.xlsx"), "Generated Questions"),
]) {
  const id = str(r["Question_ID"]);
  if (!id || str(r["Review_Flag"])) continue;
  bank.set(id, {
    id,
    row: r,
    opts: ["A", "B", "C", "D"].map((l) => splitOption(str(r[`Option_${l}`]))),
    ans: "ABCD".indexOf(str(r["Correct_Answer"]).toUpperCase()),
    diff: str(r["Difficulty"]),
  });
}
const inTests = new Set(fs.existsSync(PLAN_FILE) ? sheet(PLAN_FILE, "Allocation").map((r) => str(r["Question_ID"])) : []);

// ---------- deterministic helpers ----------

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}
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
function shuffle<T>(arr: T[], rand: () => number): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ---------- parse the spec ----------

interface Item {
  kind: "S2" | "S3" | "M4";
  lines: string[][];
  at: number; // line number, for error messages
}
const items: Item[] = [];
{
  let cur: Item | null = null;
  fs.readFileSync(SPEC_FILE, "utf8")
    .split(/\r?\n/)
    .forEach((raw, i) => {
      const line = raw.replace(/#.*$/, "").trim();
      if (!line) {
        cur = null;
        return;
      }
      if (/^(S2|S3|M4)$/.test(line)) {
        cur = { kind: line as Item["kind"], lines: [], at: i + 1 };
        items.push(cur);
        return;
      }
      if (!cur) throw new Error(`combined.txt line ${i + 1}: expected S2, S3 or M4 before "${line.slice(0, 40)}"`);
      cur.lines.push(line.split("|").map((p) => p.trim()));
    });
}

// ---------- build ----------

const errors: string[] = [];
const warnings: string[] = [];
const usedSrc = new Map<string, number>();
const perChapter = new Map<string, number>();
const out: Row[] = [];
const ROMAN = ["I", "II"];
const S3_CODES: Record<string, number> = { TTF: 0, FTT: 1, TFT: 2, TTT: 3 };
const S3_OPTS = ["1 and 2 only / केवल 1 और 2", "2 and 3 only / केवल 2 और 3", "1 and 3 only / केवल 1 और 3", "1, 2 and 3 / 1, 2 और 3"];
const S2_OPTS = ["I only / केवल I", "II only / केवल II", "Both I and II / I और II दोनों", "Neither I nor II / न तो I और न ही II"];
const S2_CODES: Record<string, number> = { TF: 0, FT: 1, TT: 2, FF: 3 };
// Spellings in the bank's Hindi options that are wrong in a full sentence.
const HI_FIX: [RegExp, string][] = [[/तेहरी/g, "टिहरी"]];
const fixHi = (s: string) => HI_FIX.reduce((t, [re, to]) => t.replace(re, to), s);
const fill = (tpl: string, text: string) => tpl.split("{A}").join(text);
const endEn = (s: string) => (/[.?!]$/.test(s) ? s : `${s}.`);
const endHi = (s: string) => (/[।?!]$/.test(s) ? s : `${s}।`);

for (const it of items) {
  const where = `combined.txt line ${it.at} (${it.kind})`;
  const want = it.kind === "S2" ? 2 : it.kind === "S3" ? 3 : 4;
  if (it.lines.length !== want) {
    errors.push(`${where}: needs ${want} lines, has ${it.lines.length}`);
    continue;
  }
  const srcs: Src[] = [];
  let bad = false;
  for (const parts of it.lines) {
    const id = parts[0].startsWith("GEN-") || parts[0].startsWith("UKPCS-") ? parts[0] : `UKPCS-UKGK-${parts[0]}`;
    const s = bank.get(id);
    const problem = !s
      ? "not in the bank (or flagged)"
      : str(s.row["Section_Code"]) !== "UKGK"
        ? "not a UKGK question"
        : !/^Factual recall/.test(str(s.row["Question_Type"]))
          ? "not a direct question"
          : s.ans < 0
            ? "no valid answer key"
            : usedSrc.has(id)
              ? `already used at line ${usedSrc.get(id)}`
              : "";
    if (problem) {
      errors.push(`${where}: ${id} ${problem}`);
      bad = true;
      continue;
    }
    usedSrc.set(id, it.at);
    if (inTests.has(id)) warnings.push(`${id} is in a test in TEST_ALLOCATION_PLAN.xlsx (it will be taken out of that test)`);
    srcs.push(s!);
  }
  if (bad) continue;
  const caFlags = new Set(srcs.map((s) => str(s.row["Static_or_CA"]) === "Static"));
  if (caFlags.size > 1) errors.push(`${where}: mixes static and current-affairs sources`);

  const first = srcs[0];
  const chap = str(first.row["Chapter_Code"]);
  const n = (perChapter.get(chap) ?? 0) + 1;
  perChapter.set(chap, n);
  const qid = `CMB-UKGK-${chap}-${String(n).padStart(4, "0")}`;
  // Difficulty: 2 statements are Easy when every fact is Easy, else Medium; 3 statements and
  // 4-pair matches are Medium, or Hard when one of the facts is already rated Hard.
  const easy = srcs.every((s) => s.diff === "Easy");
  const hard = srcs.some((s) => s.diff === "Hard");

  let en = "";
  let hi = "";
  let opts: string[] = [];
  let ans = 0;
  let exEn = "";
  let exHi = "";
  let diff = "Medium";
  let qtype = "Statement-based";
  let reform = "Statement-Based";

  if (it.kind === "M4") {
    qtype = "Match the following";
    reform = "Match-Following";
    diff = hard ? "Hard" : "Medium";
    const left = it.lines.map((p, i) => {
      const r = srcs[i].opts[srcs[i].ans];
      return { en: p[1] ?? "", hi: p[2] ?? "", right: { en: r.en, hi: fixHi(r.hi) } };
    });
    if (left.some((l) => !l.en || !l.hi)) errors.push(`${where}: every match line needs English and Hindi List-I text`);
    if (new Set(left.map((l) => l.right.en.toLowerCase())).size < 4) errors.push(`${where}: the four answers (List-II) must differ`);
    const rand = rng(hash(qid + srcs.map((s) => s.id).join()));
    const order = shuffle([0, 1, 2, 3], rand); // List-II position k holds left[order[k]]'s answer
    const code = (perm: number[]) => "ABCD".split("").map((l, i) => `${l}-${perm.indexOf(i) + 1}`).join(", ");
    const right = code(order);
    const wrong = new Set<string>();
    while (wrong.size < 3) {
      const c = code(shuffle([0, 1, 2, 3], rand));
      if (c !== right) wrong.add(c);
    }
    ans = hash(qid) % 4;
    opts = [...wrong];
    opts.splice(ans, 0, right);
    en = [
      "Match List-I with List-II and select the correct answer using the codes given below:",
      "List-I",
      ...left.map((l, i) => `${"ABCD"[i]}. ${l.en}`),
      "List-II",
      ...order.map((k, j) => `${j + 1}. ${left[k].right.en}`),
    ].join("\n");
    hi = [
      "सूची-I को सूची-II से सुमेलित कीजिए तथा नीचे दिए गए कूट का प्रयोग कर सही उत्तर चुनिए:",
      "सूची-I",
      ...left.map((l, i) => `${"ABCD"[i]}. ${l.hi}`),
      "सूची-II",
      ...order.map((k, j) => `${j + 1}. ${left[k].right.hi}`),
    ].join("\n");
    exEn = `Correct matching: ${left.map((l, i) => `${"ABCD"[i]}-${order.indexOf(i) + 1} (${l.en} – ${l.right.en})`).join("; ")}.`;
    exHi = `सही सुमेलन: ${left.map((l, i) => `${"ABCD"[i]}-${order.indexOf(i) + 1} (${l.hi} – ${l.right.hi})`).join("; ")}।`;
  } else {
    const three = it.kind === "S3";
    diff = three ? (hard ? "Hard" : "Medium") : easy ? "Easy" : "Medium";
    const st = it.lines.map((p, i) => {
      const s = srcs[i];
      const [tplEn, tplHi, letter] = [p[1] ?? "", p[2] ?? "", (p[3] ?? "").toUpperCase()];
      if (!tplEn.includes("{A}") || !tplHi.includes("{A}")) errors.push(`${where}: ${s.id} statement needs {A} in both languages`);
      const correct = s.opts[s.ans];
      const wrongIdx = letter ? "ABCD".indexOf(letter) : -1;
      if (letter && (wrongIdx < 0 || wrongIdx === s.ans)) errors.push(`${where}: ${s.id} false-letter "${letter}" must be a wrong option`);
      const used = wrongIdx >= 0 ? s.opts[wrongIdx] : correct;
      return {
        ok: wrongIdx < 0,
        en: endEn(fill(tplEn, used.en)),
        hi: endHi(fill(tplHi, fixHi(used.hi))),
        trueEn: endEn(fill(tplEn, correct.en)),
        trueHi: endHi(fill(tplHi, fixHi(correct.hi))),
      };
    });
    const pattern = st.map((s) => (s.ok ? "T" : "F")).join("");
    const label = (i: number) => (three ? String(i + 1) : ROMAN[i]);
    if (three) {
      if (!(pattern in S3_CODES)) errors.push(`${where}: 3-statement pattern ${pattern} has no option (use TTF, FTT, TFT or TTT)`);
      ans = S3_CODES[pattern] ?? 0;
      opts = S3_OPTS;
    } else {
      ans = S2_CODES[pattern];
      opts = S2_OPTS;
    }
    en = ["Consider the following statements:", ...st.map((s, i) => `${label(i)}. ${s.en}`), "Which of the statements given above is/are correct?"].join("\n");
    hi = ["निम्नलिखित कथनों पर विचार कीजिए:", ...st.map((s, i) => `${label(i)}. ${s.hi}`), "उपर्युक्त कथनों में से कौन-सा/से सही है/हैं?"].join("\n");
    exEn = st
      .map((s, i) => (s.ok ? `Statement ${label(i)} is correct: ${s.trueEn}` : `Statement ${label(i)} is incorrect – the correct fact is: ${s.trueEn}`))
      .join(" ");
    exHi = st.map((s, i) => (s.ok ? `कथन ${label(i)} सही है: ${s.trueHi}` : `कथन ${label(i)} गलत है – सही तथ्य: ${s.trueHi}`)).join(" ");
  }

  out.push({
    Question_ID: qid,
    Section_Code: "UKGK",
    Subject: str(first.row["Subject"]),
    Chapter_Code: chap,
    "Chapter/Sub-topic": str(first.row["Chapter/Sub-topic"]),
    Question_Type: qtype,
    Static_or_CA: str(first.row["Static_or_CA"]),
    "Question (English)": en,
    "Question (Hindi)": hi,
    Option_A: opts[0],
    Option_B: opts[1],
    Option_C: opts[2],
    Option_D: opts[3],
    Correct_Answer: "ABCD"[ans],
    Correct_Answer_Text: opts[ans].split(" / ")[0],
    "Explanation (updated)": exEn,
    "Explanation (Hindi if needed)": exHi,
    Difficulty: diff,
    Tag_Confidence: "High",
    Sources: `Combined from: ${srcs.map((s) => s.id).join(", ")}`,
    Reformatted_Status: reform,
    Review_Flag: "",
    Explanation_Source: "Answer keys of the source questions",
    Hindi_Source: "Generated (Claude, Sept 2026)",
    Difficulty_Basis: `${srcs.length} facts (${srcs.map((s) => s.diff).join("/")})`,
    Options_Source: "Standard statement/match codes",
    Basis: "Combined (Claude, Sept 2026) from spare bank facts",
    Source_IDs: srcs.map((s) => s.id).join(", "),
  });
}

if (errors.length) {
  console.error(`${errors.length} problem(s) in combined.txt:`);
  errors.forEach((e) => console.error(`  ${e}`));
  process.exit(1);
}
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(out), "Combined Questions");
XLSX.writeFile(wb, OUT_FILE);
const byKind: Record<string, number> = {};
items.forEach((it) => (byKind[it.kind] = (byKind[it.kind] || 0) + 1));
const answers: Record<string, number> = {};
out.forEach((r) => (answers[str(r.Correct_Answer)] = (answers[str(r.Correct_Answer)] || 0) + 1));
console.log(`Wrote ${out.length} CMB- questions (${JSON.stringify(byKind)}) from ${usedSrc.size} source questions to ${OUT_FILE}`);
console.log(`By chapter: ${JSON.stringify(Object.fromEntries(perChapter))}; answer letters: ${JSON.stringify(answers)}`);
warnings.forEach((w) => console.log(`  note: ${w}`));
