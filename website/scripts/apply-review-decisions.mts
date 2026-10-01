/**
 * Apply question review decisions to the question workbooks.
 *
 *   cd website
 *   npx --yes tsx scripts/apply-review-decisions.mts           # dry run: shows every change, writes nothing
 *   npx --yes tsx scripts/apply-review-decisions.mts --apply   # backs up the workbooks, then writes
 *
 * Decisions: every .csv / .xlsx in "../test series questions/review/decisions/"
 * (TEMPLATE.csv is skipped), one change per row, in file-name order:
 *   Question_ID | Column | New_Value | Reason
 * Column is a workbook column — Question (English), Question (Hindi),
 * Option_A … Option_D (the whole "English / Hindi" cell), Correct_Answer,
 * Difficulty, Explanation (updated), Explanation (Hindi if needed),
 * Review_Flag — or Option_A_EN / Option_A_HI (… D) to change one language
 * of an option cell. A Review_Flag (any text) drops the question; the
 * loader then replaces it in its tests.
 *
 * Re-running is safe: a value that is already set is reported as "no change".
 * After the changes, each edited question is re-checked and any remaining
 * automatic flags are listed. Backups: "../test series questions/backups/".
 */
import * as fs from "fs";
import * as path from "path";
import { createRequire } from "module";
import { splitOption, str } from "./question-bank-common.mjs";
import { CHECKS, checkQuestion, type Row } from "./question-checks.mjs";

const XLSX: typeof import("xlsx") = createRequire(import.meta.url)("xlsx");
type WorkSheet = import("xlsx").WorkSheet;
type WorkBook = import("xlsx").WorkBook;

const APPLY = process.argv.includes("--apply");
const WEBSITE = fs.existsSync(path.join(process.cwd(), "scripts", "apply-review-decisions.mts"))
  ? process.cwd()
  : path.join(process.cwd(), "website");
const DATA_DIR = path.join(WEBSITE, "..", "test series questions");
const DECISIONS_DIR = path.join(DATA_DIR, "review", "decisions");
const BACKUP_DIR = path.join(DATA_DIR, "backups");
const SOURCES = [
  { file: "MERGED_QUESTION_BANK_v2.xlsx", sheet: "Question Bank" },
  { file: "GENERATED_QUESTIONS.xlsx", sheet: "Generated Questions" },
  { file: "COMBINED_QUESTIONS.xlsx", sheet: "Combined Questions" },
];
const TEXT_COLUMNS = [
  "Question (English)",
  "Question (Hindi)",
  "Option_A",
  "Option_B",
  "Option_C",
  "Option_D",
  "Correct_Answer",
  "Difficulty",
  "Explanation (updated)",
  "Explanation (Hindi if needed)",
  "Review_Flag",
];

// ---------- decisions ----------

type Decision = { qid: string; column: string; value: string; reason: string; from: string };

function readDecisionFile(file: string): Row[] {
  if (file.endsWith(".csv")) {
    // read as UTF-8 text so Hindi survives; raw keeps "05" or "1,2" as typed
    const text = fs.readFileSync(file, "utf8").replace(/^﻿/, "");
    const wb = XLSX.read(text, { type: "string", raw: true });
    return XLSX.utils.sheet_to_json<Row>(wb.Sheets[wb.SheetNames[0]], { defval: "", raw: false });
  }
  const wb = XLSX.readFile(file);
  return XLSX.utils.sheet_to_json<Row>(wb.Sheets[wb.SheetNames[0]], { defval: "" });
}

if (!fs.existsSync(DECISIONS_DIR)) throw new Error(`${DECISIONS_DIR} not found — run scripts/export-tests-for-review.mts first.`);
const decisionFiles = fs
  .readdirSync(DECISIONS_DIR)
  .filter((f) => /\.(csv|xlsx)$/i.test(f) && !/^TEMPLATE\./i.test(f) && !f.startsWith("~$"))
  .sort();
const decisions: Decision[] = [];
const problems: string[] = [];
for (const f of decisionFiles) {
  readDecisionFile(path.join(DECISIONS_DIR, f)).forEach((r, i) => {
    const d = { qid: str(r["Question_ID"]), column: str(r["Column"]), value: str(r["New_Value"]), reason: str(r["Reason"]), from: `${f} row ${i + 2}` };
    if (!d.qid && !d.column && !d.value) return;
    decisions.push(d);
  });
}

// ---------- workbooks ----------

type Book = { file: string; sheet: string; wb: WorkBook; ws: WorkSheet; header: string[]; rowOf: Map<string, number>; dirty: boolean };
const books: Book[] = [];
for (const s of SOURCES) {
  const file = path.join(DATA_DIR, s.file);
  if (!fs.existsSync(file)) continue;
  const wb = XLSX.readFile(file);
  const ws = wb.Sheets[s.sheet];
  if (!ws) throw new Error(`Sheet "${s.sheet}" not found in ${s.file}`);
  const range = XLSX.utils.decode_range(ws["!ref"] ?? "A1");
  const cell = (r: number, c: number) => str(ws[XLSX.utils.encode_cell({ r, c })]?.v);
  const header: string[] = [];
  for (let c = range.s.c; c <= range.e.c; c++) header[c] = cell(range.s.r, c);
  const idCol = header.indexOf("Question_ID");
  if (idCol < 0) throw new Error(`No Question_ID column in ${s.file}`);
  const rowOf = new Map<string, number>();
  for (let r = range.s.r + 1; r <= range.e.r; r++) {
    const id = cell(r, idCol);
    if (id && !rowOf.has(id)) rowOf.set(id, r);
  }
  books.push({ file, sheet: s.sheet, wb, ws, header, rowOf, dirty: false });
}

const getCell = (b: Book, r: number, col: string) => {
  const c = b.header.indexOf(col);
  return c < 0 ? "" : str(b.ws[XLSX.utils.encode_cell({ r, c })]?.v);
};
function setCell(b: Book, r: number, col: string, value: string) {
  let c = b.header.indexOf(col);
  if (c < 0) {
    // e.g. Review_Flag in a workbook that has no such column yet
    const range = XLSX.utils.decode_range(b.ws["!ref"] ?? "A1");
    c = range.e.c + 1;
    b.header[c] = col;
    b.ws[XLSX.utils.encode_cell({ r: range.s.r, c })] = { t: "s", v: col };
    range.e.c = c;
    b.ws["!ref"] = XLSX.utils.encode_range(range);
  }
  b.ws[XLSX.utils.encode_cell({ r, c })] = value === "" ? { t: "z" } : { t: "s", v: value };
  b.dirty = true;
}
function rowObject(b: Book, r: number): Row {
  const o: Row = {};
  b.header.forEach((h, c) => h && (o[h] = str(b.ws[XLSX.utils.encode_cell({ r, c })]?.v)));
  return o;
}

// ---------- apply ----------

const short = (s: string) => (s.length > 90 ? `${s.slice(0, 87)}...` : s);
const log: Row[] = [];
const touched = new Map<string, { b: Book; r: number }>();
let changed = 0;
let same = 0;

for (const d of decisions) {
  const where = books.map((b) => ({ b, r: b.rowOf.get(d.qid) })).find((x) => x.r !== undefined);
  if (!where || where.r === undefined) {
    problems.push(`${d.from}: ${d.qid} is not in any workbook`);
    continue;
  }
  const { b, r } = where;
  const opt = d.column.match(/^Option_([A-D])_(EN|HI)$/i);
  const column = opt ? `Option_${opt[1].toUpperCase()}` : d.column;
  if (!TEXT_COLUMNS.includes(column)) {
    problems.push(`${d.from}: unknown column "${d.column}" (use ${TEXT_COLUMNS.join(", ")}, or Option_A_EN / Option_A_HI)`);
    continue;
  }
  let value = d.value;
  if (column === "Correct_Answer") value = value.toUpperCase();
  if (column === "Correct_Answer" && !["A", "B", "C", "D"].includes(value)) {
    problems.push(`${d.from}: Correct_Answer must be A, B, C or D (got "${d.value}")`);
    continue;
  }
  if (column === "Difficulty") value = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  if (column === "Difficulty" && !["Easy", "Medium", "Hard"].includes(value)) {
    problems.push(`${d.from}: Difficulty must be Easy, Medium or Hard (got "${d.value}")`);
    continue;
  }
  if (column !== "Review_Flag" && !value) {
    problems.push(`${d.from}: empty New_Value for ${column} (only Review_Flag may be cleared)`);
    continue;
  }
  const old = getCell(b, r, column);
  if (opt) {
    const cur = splitOption(old);
    const en = opt[2].toUpperCase() === "EN" ? value : cur.en;
    const hi = opt[2].toUpperCase() === "HI" ? value : cur.hi;
    value = en === hi ? en : `${en} / ${hi}`;
  }
  if (old === value) {
    same++;
    continue;
  }
  setCell(b, r, column, value);
  touched.set(d.qid, { b, r });
  changed++;
  console.log(`${d.qid}  ${column}: "${short(old)}" -> "${short(value)}"${d.reason ? `  (${d.reason})` : ""}`);
  log.push({ Question_ID: d.qid, Workbook: path.basename(b.file), Column: column, Old: old, New: value, Reason: d.reason, Decision: d.from });
}

console.log(`\n${decisions.length} decisions in ${decisionFiles.length} file(s): ${changed} changes, ${same} already set, ${problems.length} problems.`);
problems.forEach((p) => console.log(`  PROBLEM ${p}`));

// Re-check edited questions that stay in the bank.
const still: string[] = [];
for (const [qid, { b, r }] of touched) {
  if (getCell(b, r, "Review_Flag")) continue;
  const c = checkQuestion(rowObject(b, r));
  const serious = c.found.filter((f) => CHECKS[f].weight >= 3);
  if (serious.length) still.push(`${qid}: ${serious.map((f) => CHECKS[f].label).join("; ")}${c.notes.length ? ` — ${c.notes.join("; ")}` : ""}`);
}
if (still.length) {
  console.log(`\nEdited questions that still trip a check (look again, or flag them):`);
  still.forEach((s) => console.log(`  ${s}`));
}

const cmbEdits = [...touched.keys()].filter((id) => /COMBINED/.test(path.basename(touched.get(id)!.b.file)));
if (cmbEdits.length) {
  console.log(
    `\nNOTE: ${cmbEdits.length} CMB- question(s) edited (${cmbEdits.join(", ")}). build-combined-questions.mts rebuilds` +
      ` COMBINED_QUESTIONS.xlsx from work/cmb/combined.txt, so make the same fix there too (a Review_Flag: delete or fix the spec entry).`,
  );
}

if (!APPLY) {
  console.log("\nDry run only. Re-run with --apply to back up and write the workbooks.");
} else if (problems.length) {
  console.log("\nNothing written: fix the problems above first.");
  process.exitCode = 1;
} else {
  const stamp = new Date().toISOString().replace(/[:T]/g, "-").slice(0, 19);
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  for (const b of books.filter((x) => x.dirty)) {
    const backup = path.join(BACKUP_DIR, `${path.basename(b.file, ".xlsx")}.${stamp}.xlsx`);
    fs.copyFileSync(b.file, backup);
    XLSX.writeFile(b.wb, b.file);
    console.log(`Wrote ${path.basename(b.file)} (backup: ${path.relative(DATA_DIR, backup)})`);
  }
  if (log.length) {
    const out = path.join(DATA_DIR, "review", `APPLIED_CHANGES.${stamp}.xlsx`);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(log), "Changes");
    XLSX.writeFile(wb, out);
    console.log(`Change log: ${path.relative(DATA_DIR, out)}`);
  }
  console.log("Next: run the loader dry run (scripts/load-question-bank.mts) and check its summary.");
}
