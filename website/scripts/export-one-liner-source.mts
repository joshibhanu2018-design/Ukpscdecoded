/**
 * One-liner book source — READ ONLY. Collects every Uttarakhand question in
 * the bank (used in a test or not, static and current affairs) into one
 * Markdown file per chapter: question, correct answer, explanation. These
 * files are the raw facts the one-liner book is written from.
 *
 *   cd website
 *   npx.cmd --yes tsx scripts/export-one-liner-source.mts
 *
 * Output: "../test series questions/one-liner-source/" (git-ignored folder)
 * Questions with a Review_Flag are left out (dropped as wrong or doubtful).
 */
import * as fs from "fs";
import * as path from "path";
import { createRequire } from "module";
import { str, splitOption } from "./question-bank-common.mjs";

const XLSX: typeof import("xlsx") = createRequire(import.meta.url)("xlsx");

const WEBSITE = fs.existsSync(path.join(process.cwd(), "scripts", "export-one-liner-source.mts"))
  ? process.cwd()
  : path.join(process.cwd(), "website");
const DATA_DIR = path.join(WEBSITE, "..", "test series questions");
const OUT_DIR = path.join(DATA_DIR, "one-liner-source");

const SOURCES = [
  { file: "MERGED_QUESTION_BANK_v2.xlsx", sheet: "Question Bank" },
  { file: "GENERATED_QUESTIONS.xlsx", sheet: "Generated Questions" },
  { file: "COMBINED_QUESTIONS.xlsx", sheet: "Combined Questions" },
];

type Row = Record<string, unknown>;
type Fact = { qid: string; q: string; ans: string; ex: string; ca: boolean };

const byChapter = new Map<string, { name: string; facts: Fact[] }>();
const seen = new Set<string>();
let skippedFlag = 0;

for (const src of SOURCES) {
  const file = path.join(DATA_DIR, src.file);
  if (!fs.existsSync(file)) {
    console.log(`Skipping ${src.file} (not found)`);
    continue;
  }
  const ws = XLSX.readFile(file).Sheets[src.sheet];
  if (!ws) {
    console.log(`Skipping ${src.file}: sheet "${src.sheet}" not found`);
    continue;
  }
  const rows = XLSX.utils.sheet_to_json<Row>(ws, { defval: "" });
  let taken = 0;
  for (const r of rows) {
    const qid = str(r["Question_ID"]);
    if (!qid || seen.has(qid) || str(r["Section_Code"]) !== "UKGK") continue;
    if (str(r["Review_Flag"])) {
      skippedFlag++;
      continue;
    }
    const letter = str(r["Correct_Answer"]).toUpperCase();
    const q = str(r["Question (English)"]);
    if (!q || !["A", "B", "C", "D"].includes(letter)) continue;
    seen.add(qid);
    const chap = str(r["Chapter_Code"]) || "NO-CHAPTER";
    const entry = byChapter.get(chap) ?? { name: str(r["Chapter/Sub-topic"]), facts: [] };
    entry.facts.push({
      qid,
      q,
      ans: `${letter}) ${splitOption(str(r[`Option_${letter}`])).en}`,
      ex: str(r["Explanation (updated)"]),
      ca: str(r["Static_or_CA"]) !== "Static",
    });
    byChapter.set(chap, entry);
    taken++;
  }
  console.log(`${src.file}: ${taken} Uttarakhand questions`);
}

fs.mkdirSync(OUT_DIR, { recursive: true });
const oneLine = (s: string) => s.replace(/\s*\r?\n\s*/g, " / ");
const chapters = [...byChapter.keys()].sort();
for (const chap of chapters) {
  const { name, facts } = byChapter.get(chap)!;
  const lines = [`# ${chap} ${name}`, "", `${facts.length} questions (${facts.filter((f) => f.ca).length} current affairs)`, ""];
  for (const f of facts) {
    lines.push(`- [${f.qid}]${f.ca ? " [CA]" : ""} ${oneLine(f.q)}`);
    lines.push(`  - Answer: ${oneLine(f.ans)}`);
    if (f.ex) lines.push(`  - Why: ${oneLine(f.ex)}`);
  }
  fs.writeFileSync(path.join(OUT_DIR, `${chap}.md`), lines.join("\n") + "\n");
}

console.log(`\nWrote ${chapters.length} chapter files to ${OUT_DIR}`);
for (const chap of chapters) console.log(`  ${chap}: ${byChapter.get(chap)!.facts.length}`);
console.log(`Total: ${seen.size} questions (${skippedFlag} flagged ones left out)`);
