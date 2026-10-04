/**
 * Check crash course coverage — identifies which UKGK question IDs are NOT cited
 * in any master notes file.
 *
 * Usage:
 *   cd website
 *   npx.cmd --yes tsx scripts/check-coverage.mts
 *
 * Output: Lists uncovered questions per chapter, grouped by video
 */
import * as fs from "fs";
import * as path from "path";

const REPO_ROOT = path.join(process.cwd(), "..");
const ONE_LINER_DIR = path.join(REPO_ROOT, "test series questions", "one-liner-source");
const CRASH_COURSE_DIR = path.join(REPO_ROOT, "test series questions", "crash-course");

type CoverageMap = Map<string, Set<string>>; // chapter -> set of cited QIDs

// Parse master notes files and extract all cited question IDs
function extractCitedQuestions(): CoverageMap {
  const cited = new Map<string, Set<string>>();

  if (!fs.existsSync(CRASH_COURSE_DIR)) {
    console.log("No crash course directory found");
    return cited;
  }

  const files = fs.readdirSync(CRASH_COURSE_DIR).filter((f) => f.endsWith(".md"));
  for (const file of files) {
    const content = fs.readFileSync(path.join(CRASH_COURSE_DIR, file), "utf-8");
    // Extract all [UKPCS-UKGK-CHxx-xxxx] patterns
    const qidPattern = /\[UKPCS-UKGK-CH(\d+)-(\d+)\]/g;
    let match;
    while ((match = qidPattern.exec(content)) !== null) {
      const chapter = `CH${match[1].padStart(2, "0")}`;
      if (!cited.has(chapter)) cited.set(chapter, new Set());
      cited.get(chapter)!.add(`UKPCS-UKGK-${match[1].padStart(2, "0")}-${match[2].padStart(4, "0")}`);
    }
  }
  return cited;
}

// Parse one-liner source files and extract all question IDs
function extractAllQuestions(): CoverageMap {
  const all = new Map<string, Set<string>>();

  if (!fs.existsSync(ONE_LINER_DIR)) {
    console.log(`One-liner source directory not found: ${ONE_LINER_DIR}`);
    return all;
  }

  const files = fs.readdirSync(ONE_LINER_DIR).filter((f) => f.endsWith(".md"));
  for (const file of files) {
    const chapter = path.basename(file, ".md"); // e.g., CH01
    const content = fs.readFileSync(path.join(ONE_LINER_DIR, file), "utf-8");

    // Extract all [UKPCS-UKGK-CHxx-xxxx] patterns
    const qidPattern = /\[UKPCS-UKGK-CH\d+-(\d+)\]/g;
    const qids = new Set<string>();
    let match;
    while ((match = qidPattern.exec(content)) !== null) {
      // Extract the full QID from the line
      const lineMatch = content.slice(match.index, match.index + 100).match(/\[UKPCS-UKGK-CH\d+-\d+\]/);
      if (lineMatch) qids.add(lineMatch[0].slice(1, -1)); // Remove brackets
    }
    all.set(chapter, qids);
  }

  return all;
}

// Report coverage
function reportCoverage() {
  console.log("Checking crash course coverage...\n");

  const allQuestions = extractAllQuestions();
  const citedQuestions = extractCitedQuestions();

  if (allQuestions.size === 0) {
    console.log("ERROR: No one-liner source files found. Run export-one-liner-source.mts first.\n");
    return;
  }

  if (citedQuestions.size === 0) {
    console.log("WARNING: No master notes files found in crash-course/.\n");
  }

  let totalUncovered = 0;
  const chapterSummary: Record<string, { total: number; cited: number; uncovered: number }> = {};

  for (const [chapter, allQids] of Array.from(allQuestions.entries()).sort()) {
    const citedQids = citedQuestions.get(chapter) || new Set();
    const uncoveredQids = Array.from(allQids).filter((qid) => !citedQids.has(qid));

    chapterSummary[chapter] = {
      total: allQids.size,
      cited: citedQids.size,
      uncovered: uncoveredQids.length,
    };

    totalUncovered += uncoveredQids.length;

    // Only print chapters with uncovered questions
    if (uncoveredQids.length > 0 && uncoveredQids.length <= 10) {
      console.log(`${chapter}: ${citedQids.size}/${allQids.size} cited`);
      console.log(`  Uncovered: ${uncoveredQids.slice(0, 5).join(", ")}${uncoveredQids.length > 5 ? `... (+${uncoveredQids.length - 5} more)` : ""}`);
    } else if (uncoveredQids.length > 10) {
      console.log(`${chapter}: ${citedQids.size}/${allQids.size} cited (${uncoveredQids.length} uncovered)`);
    } else {
      console.log(`${chapter}: ${citedQids.size}/${allQids.size} cited ✓`);
    }
  }

  console.log(`\nTotal Uncovered Questions: ${totalUncovered}`);
  console.log("\nChapter Summary:");
  console.table(chapterSummary);
}

reportCoverage();
