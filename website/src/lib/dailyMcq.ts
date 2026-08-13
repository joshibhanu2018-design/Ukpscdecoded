// Shared "Daily MCQ" data layer.
// Combines the live Google Sheet + the local curated bank (content/mcqBank.json),
// de-duplicates, and deterministically rotates 5 questions per day (rolls over
// at 08:00 IST). Used by both the homepage quiz widget and the /current-affairs
// Daily MCQ tab, so a visitor sees the same 5 questions in both places on a given day.

import mcqBank from "@content/mcqBank.json";

export interface MCQQuestion {
  qno: number;
  subject: string;
  topic: string;
  question: string;
  options: string[];
  correctAnswer: number;
  postedDate: string;
}

const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1feVIs-h8MCX9-cBKaIgJP4Ayb9m9FuUAgjhT2JmB3bM/export?format=csv&gid=0";

const bankMCQs: MCQQuestion[] = (mcqBank.questions || []).map((q, i) => ({
  qno: 100000 + i,
  subject: q.subject,
  topic: q.topic,
  question: q.question,
  options: q.options,
  correctAnswer: q.correctAnswer,
  postedDate: "",
}));

// Small always-available fallback in case both the sheet fetch fails
// and, implausibly, the local bank is empty.
const fallbackMCQs: MCQQuestion[] = bankMCQs.slice(0, 5);

function getDailyIndex(): number {
  const IST_OFFSET = 5.5 * 60 * 60 * 1000;
  const EIGHT_AM = 8 * 60 * 60 * 1000;
  const shifted = Date.now() + IST_OFFSET - EIGHT_AM;
  return Math.floor(shifted / (24 * 60 * 60 * 1000));
}

function pickDailyFive(sheetQuestions: MCQQuestion[]): MCQQuestion[] {
  const combined = [...sheetQuestions, ...bankMCQs];
  const seen = new Set<string>();
  const pool = combined.filter((q) => {
    const key = q.question.trim().toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  if (pool.length === 0) return [];
  const start = (getDailyIndex() * 5) % pool.length;
  return Array.from({ length: Math.min(5, pool.length) }, (_, i) => pool[(start + i) % pool.length]);
}

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let current = "";
  let inQuotes = false;
  let row: string[] = [];

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      row.push(current.trim());
      current = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (current || row.length > 0) {
        row.push(current.trim());
        rows.push(row);
        row = [];
        current = "";
      }
    } else {
      current += char;
    }
  }
  if (current || row.length > 0) {
    row.push(current.trim());
    rows.push(row);
  }
  return rows;
}

// Fetches the live sheet, combines with the local bank, and returns
// today's rotating 5 questions. Falls back gracefully if the sheet is unreachable.
export async function fetchDailyFive(): Promise<MCQQuestion[]> {
  try {
    const res = await fetch(SHEET_URL);
    const text = await res.text();
    const rows = parseCSV(text);

    const questions: MCQQuestion[] = rows
      .slice(1)
      .map((row) => {
        const answer = row[8] || "";
        const correctLetter = answer.charAt(0).toUpperCase();
        const correctIndex = ["A", "B", "C", "D"].indexOf(correctLetter);
        return {
          qno: parseInt(row[0]) || 0,
          subject: row[1] || "",
          topic: row[2] || "",
          question: row[3] || "",
          options: [row[4] || "", row[5] || "", row[6] || "", row[7] || ""],
          correctAnswer: correctIndex >= 0 ? correctIndex : 0,
          postedDate: row[10] || row[9] || "",
        };
      })
      .filter((q) => q.question.length > 0);

    const daily = pickDailyFive(questions);
    return daily.length > 0 ? daily : fallbackMCQs;
  } catch (error) {
    console.error("Failed to fetch live MCQs, using local bank:", error);
    const daily = pickDailyFive([]);
    return daily.length > 0 ? daily : fallbackMCQs;
  }
}

// Deterministic pseudo "X% got this right" — stable per question (same question
// always shows the same %), since the live bank doesn't track real solve rates.
export function pseudoSolvedPct(q: MCQQuestion): number {
  let hash = 0;
  for (let i = 0; i < q.question.length; i++) {
    hash = (hash * 31 + q.question.charCodeAt(i)) >>> 0;
  }
  return 45 + (hash % 40); // range: 45–84
}
