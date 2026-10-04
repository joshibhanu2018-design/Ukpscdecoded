/**
 * Topic Extraction for One-Liners
 * Reads all question sources and groups by topic/subject/module
 * to generate one-liners based on actual test coverage
 *
 *   cd website
 *   npx --yes tsx scripts/extract-topics-for-oneliners.mts
 *
 * Output: "../test series questions/TOPIC_ANALYSIS.json"
 *   Grouped by topic/module with question counts and sample questions
 */

import * as fs from "fs";
import * as path from "path";
import { createRequire } from "module";
import { str } from "./question-bank-common.mjs";

const XLSX: typeof import("xlsx") = createRequire(import.meta.url)("xlsx");

const WEBSITE = fs.existsSync(path.join(process.cwd(), "scripts", "extract-topics-for-oneliners.mts"))
  ? process.cwd()
  : path.join(process.cwd(), "website");
const DATA_DIR = path.join(WEBSITE, "..", "test series questions");
const OUT_FILE = path.join(DATA_DIR, "TOPIC_ANALYSIS.json");

const SOURCES = [
  { file: "MERGED_QUESTION_BANK_v2.xlsx", sheet: "Question Bank", label: "live" },
  { file: "GENERATED_QUESTIONS.xlsx", sheet: "Generated Questions", label: "generated" },
  { file: "COMBINED_QUESTIONS.xlsx", sheet: "Combined Questions", label: "combined" },
];

interface TopicData {
  topic: string;
  module?: string;
  totalQuestions: number;
  byDifficulty: { easy: number; medium: number; hard: number; [key: string]: number };
  sampleQuestions: string[];
  sources: string[];
}

const topics = new Map<string, TopicData>();

// Read all sources
for (const src of SOURCES) {
  const file = path.join(DATA_DIR, src.file);
  if (!fs.existsSync(file)) {
    console.log(`⏭  Skipping ${src.file} (not found)`);
    continue;
  }

  const wb = XLSX.readFile(file);
  const ws = wb.Sheets[src.sheet];
  if (!ws) {
    console.log(`⏭  Skipping ${src.file}: sheet "${src.sheet}" not found`);
    continue;
  }

  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: "" });
  console.log(`📖 Reading ${src.file} (${rows.length} rows)...`);

  for (const r of rows) {
    const qid = str(r["Question_ID"]);
    if (!qid) continue;

    // Skip if marked for deletion
    if (str(r["Review_Flag"])) continue;

    const topic = str(r["Topic"] || r["Subject"] || r["Chapter"] || "Uncategorized");
    const module = str(r["Module"] || r["Category"] || "");
    const difficulty = str(r["Difficulty"] || r["Level"] || "medium").toLowerCase();
    const questionText = str(r["Question"]);

    const key = module ? `${module}/${topic}` : topic;

    if (!topics.has(key)) {
      topics.set(key, {
        topic,
        module,
        totalQuestions: 0,
        byDifficulty: { easy: 0, medium: 0, hard: 0 },
        sampleQuestions: [],
        sources: [],
      });
    }

    const data = topics.get(key)!;
    data.totalQuestions++;

    // Count by difficulty
    if (difficulty in data.byDifficulty) {
      data.byDifficulty[difficulty]++;
    } else {
      data.byDifficulty[difficulty] = 1;
    }

    // Collect sample questions (up to 3 per topic)
    if (data.sampleQuestions.length < 3 && questionText.length > 10) {
      data.sampleQuestions.push(questionText.substring(0, 100));
    }

    // Track sources
    if (!data.sources.includes(src.label)) {
      data.sources.push(src.label);
    }
  }
}

// Convert to array and sort by question count (descending)
const sorted = Array.from(topics.values()).sort((a, b) => b.totalQuestions - a.totalQuestions);

// Separate Uttarakhand vs National
const ukTopics = sorted.filter((t) =>
  t.topic.toLowerCase().includes("uttarakhand") ||
  t.topic.toLowerCase().includes("uk") ||
  t.module?.toLowerCase().includes("uttarakhand") ||
  t.module?.toLowerCase().includes("uk")
);

const nationalTopics = sorted.filter((t) => !ukTopics.includes(t));

const analysis = {
  exportedAt: new Date().toISOString(),
  summary: {
    totalTopics: topics.size,
    totalQuestions: sorted.reduce((sum, t) => sum + t.totalQuestions, 0),
    ukTopicsCount: ukTopics.length,
    nationalTopicsCount: nationalTopics.length,
  },
  uttarakhandTopics: ukTopics,
  nationalTopics: nationalTopics,
};

fs.writeFileSync(OUT_FILE, JSON.stringify(analysis, null, 2));
console.log(`\n✅ Topic analysis saved to: ${OUT_FILE}`);
console.log(`\n📊 Summary:`);
console.log(`   Total topics: ${topics.size}`);
console.log(`   Total questions: ${analysis.summary.totalQuestions}`);
console.log(`   Uttarakhand topics: ${ukTopics.length}`);
console.log(`   National topics: ${nationalTopics.length}`);
