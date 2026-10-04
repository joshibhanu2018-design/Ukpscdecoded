/**
 * Crash-course coverage check — READ ONLY.
 *
 *   cd website
 *   npx.cmd --yes tsx scripts/check-coverage.mts CH01 CH02
 *
 * For the chapters named, lists every question that is neither cited in a
 * master notes file (crash-course/video-NN.md) nor listed in deferred.md for
 * a later video. "Not covered: none" means every question's fact is placed.
 * Also reports: notes with format errors, IDs cited that don't exist (typos or
 * flagged questions), and deferred questions whose target video file exists
 * but doesn't cite them yet.
 */
import { listVideoFiles, loadDeferred, loadSourceIds, parseVideo } from "./crash-course-lib.mjs";

const chapters = process.argv.slice(2).map((c) => c.toUpperCase());
const source = loadSourceIds();
if (source.size === 0) {
  console.log("No one-liner source found. Run export-one-liner-source.mts first.");
  process.exit(1);
}

const cited = new Map<string, number[]>();
const videos = new Map<number, Set<string>>();
let problems = 0;
for (const file of listVideoFiles()) {
  const v = parseVideo(file);
  const ids = new Set<string>();
  for (const f of v.facts) f.ids.forEach((id) => ids.add(id));
  for (const t of v.verify) t.ids.forEach((id) => ids.add(id));
  videos.set(v.number, ids);
  for (const id of ids) cited.set(id, [...(cited.get(id) ?? []), v.number]);
  if (v.errors.length) {
    problems += v.errors.length;
    console.log(`\nVideo ${v.number}: ${v.errors.length} format problem(s)`);
    v.errors.forEach((e) => console.log("  " + e));
  }
  const unknown = [...ids].filter((id) => !source.has(id));
  if (unknown.length) {
    problems += unknown.length;
    console.log(`\nVideo ${v.number}: IDs not in the question bank export (typo or flagged): ${unknown.join(" ")}`);
  }
}

const deferred = loadDeferred();
const unknownDeferred = [...deferred.keys()].filter((id) => !source.has(id));
if (unknownDeferred.length) {
  problems += unknownDeferred.length;
  console.log(`\ndeferred.md IDs not in the export: ${unknownDeferred.join(" ")}`);
}

const pending: string[] = [];
for (const [id, targets] of deferred) {
  for (const v of targets) if (videos.has(v) && !videos.get(v)!.has(id)) pending.push(`${id} -> V${v}`);
}
if (pending.length) console.log(`\nDeferred to a video that exists but doesn't cite them yet:\n  ${pending.join("\n  ")}`);

if (chapters.length === 0) {
  console.log("\nName the chapters to check, e.g.: npx.cmd --yes tsx scripts/check-coverage.mts CH01 CH02");
} else {
  console.log("");
  let missing = 0;
  for (const ch of chapters) {
    const all = [...source].filter(([, c]) => c === ch).map(([id]) => id);
    const notCovered = all.filter((id) => !cited.has(id) && !deferred.has(id));
    const inNotes = all.filter((id) => cited.has(id)).length;
    const later = all.filter((id) => !cited.has(id) && deferred.has(id)).length;
    missing += notCovered.length;
    console.log(`${ch}: ${all.length} questions — ${inNotes} in notes, ${later} deferred to later videos, ${notCovered.length} not covered`);
    if (notCovered.length) console.log("  " + notCovered.join("\n  "));
  }
  console.log(`\nNot covered: ${missing === 0 ? "none" : missing}`);
  if (problems) console.log(`Other problems: ${problems} (see above)`);
  if (missing || problems) process.exit(1);
}
