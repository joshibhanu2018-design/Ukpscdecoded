/**
 * Shared parser for crash-course master notes (test series questions/crash-course/video-NN.md).
 *
 * Master file format:
 *
 *   ---
 *   video: 2
 *   title: Glaciers, Rivers & Prayags
 *   title_hi: हिमनद, नदियाँ और प्रयाग
 *   ---
 *   # Section (English) | Section (Hindi)          -> divider slide / PDF heading
 *   ## Topic (English) | Topic (Hindi)             -> one slide (split if long)
 *   - core uk16 | Fact in English with **key words**. {CH01-0199 CMB-CH01-0014}
 *     hi: वही तथ्य हिंदी में।
 *   - extra nat:geography | National fact. {src: Indian Geography p40}
 *     hi: ...
 *   # To verify                                     -> owner's list, never rendered
 *   - What the questions disagree on. {CH01-0396 CH01-0200}
 *
 * IDs: "CH01-0199" means UKPCS-UKGK-CH01-0199; "CMB-CH01-0014" means CMB-UKGK-CH01-0014.
 * Level: core = slides + PDF + book, extra = PDF + book.
 */
import * as fs from "fs";
import * as path from "path";

export const ROOT = fs.existsSync(path.join(process.cwd(), "scripts", "crash-course-lib.mts"))
  ? path.join(process.cwd(), "..")
  : process.cwd();
export const DATA_DIR = path.join(ROOT, "test series questions");
export const NOTES_DIR = path.join(DATA_DIR, "crash-course");
export const SOURCE_DIR = path.join(DATA_DIR, "one-liner-source");
export const OUT_DIR = path.join(ROOT, "content-output", "crash-course");

export const BOOK_CHAPTERS: Record<number, string> = {
  1: "Prehistoric & Proto-historic Period, Ancient Tribes",
  2: "Ancient Dynasties — Kartikeyapur, Katyuri & Parmar",
  3: "Chand Dynasty & Gorkha Invasion",
  4: "British Rule in Uttarakhand",
  5: "Tehri Princely State",
  6: "National Movement & Freedom Fighters",
  7: "People's Movements, Social Reformers & Statehood",
  8: "Society of Uttarakhand",
  9: "Folk Culture — Songs, Dance, Art, Instruments",
  10: "Religious Places, Temples, Fairs & Festivals",
  11: "Political System — Governor, CM, Legislature, Parties",
  12: "Administrative System — Govt Structure, UKPSC, High Court",
  13: "Local Self-Government",
  14: "Good Governance & Public Policy",
  15: "Physical Geography Part 1 (Structure, Climate, Rivers)",
  16: "Physical Geography Part 2 (Soils, Vegetation, Glaciers)",
  17: "Resources & Agriculture",
  18: "Industry, Transport & Energy",
  19: "Tourism, National Parks & Wildlife",
  20: "Population, Migration & Urbanization",
  21: "Economy — Features, GSDP, Income Sources",
  22: "Industrial Development & MSME",
  23: "Infrastructure",
  24: "Economic Planning, Budget & Public Finance",
  25: "Major Economic Problems & Welfare Programs",
  26: "Disaster Management",
  27: "Education & Human Resource Development",
  28: "Health",
};

export type Fact = {
  level: "core" | "extra";
  origin: "uk" | "nat";
  bookChapter?: number; // uk facts
  subject?: string; // nat facts
  en: string;
  hi: string;
  ids: string[]; // full question IDs
  source?: string; // nat source note
  section: string;
  sectionHi: string;
  topic: string;
  topicHi: string;
  line: number;
};

export type Verify = { text: string; ids: string[]; line: number };

export type Video = {
  file: string;
  meta: Record<string, string>;
  number: number;
  facts: Fact[];
  verify: Verify[];
  errors: string[];
};

export function expandId(token: string): string | null {
  const m = token.match(/^(?:(CMB|GEN|UKPCS)-)?(CH\d\d-\d{4})$/);
  if (!m) return null;
  return `${m[1] ?? "UKPCS"}-UKGK-${m[2]}`;
}

function splitTitle(s: string): [string, string] {
  const [en, hi] = s.split("|").map((x) => x.trim());
  return [en, hi ?? ""];
}

function parseBraces(body: string, line: number, errors: string[]): { ids: string[]; source?: string } {
  const t = body.trim();
  if (t.startsWith("src:")) return { ids: [], source: t.slice(4).trim() };
  const ids: string[] = [];
  let source: string | undefined;
  for (const part of t.split(/;\s*/)) {
    if (part.startsWith("src:")) {
      source = part.slice(4).trim();
      continue;
    }
    for (const tok of part.split(/[\s,]+/).filter(Boolean)) {
      const id = expandId(tok);
      if (id) ids.push(id);
      else errors.push(`line ${line}: bad question ID "${tok}"`);
    }
  }
  return { ids, source };
}

export function parseVideo(file: string): Video {
  const lines = fs.readFileSync(file, "utf-8").replace(/\r/g, "").split("\n");
  const meta: Record<string, string> = {};
  const facts: Fact[] = [];
  const verify: Verify[] = [];
  const errors: string[] = [];
  let i = 0;
  if (lines[0]?.trim() === "---") {
    for (i = 1; i < lines.length && lines[i].trim() !== "---"; i++) {
      const m = lines[i].match(/^(\w+):\s*(.*)$/);
      if (m) meta[m[1]] = m[2].trim();
    }
    i++;
  }
  let section = "", sectionHi = "", topic = "", topicHi = "";
  let inVerify = false;
  for (; i < lines.length; i++) {
    const raw = lines[i];
    const ln = i + 1;
    if (!raw.trim()) continue;
    if (raw.startsWith("# ")) {
      [section, sectionHi] = splitTitle(raw.slice(2));
      inVerify = /^to verify$/i.test(section);
      topic = topicHi = "";
      continue;
    }
    if (raw.startsWith("## ")) {
      [topic, topicHi] = splitTitle(raw.slice(3));
      continue;
    }
    if (inVerify) {
      const m = raw.match(/^- (.+?)\s*\{([^}]*)\}\s*$/);
      if (m) verify.push({ text: m[1], ids: parseBraces(m[2], ln, errors).ids, line: ln });
      else if (raw.startsWith("- ")) errors.push(`line ${ln}: to-verify item needs {IDs}`);
      continue;
    }
    if (raw.startsWith("- ")) {
      const m = raw.match(/^- (core|extra) (uk(\d+)|nat:([a-z-]+)) \| (.+?)\s*\{([^}]*)\}\s*$/);
      if (!m) {
        errors.push(`line ${ln}: fact line not in format "- core|extra ukNN|nat:subject | text {IDs}"`);
        continue;
      }
      if (!topic) errors.push(`line ${ln}: fact outside a ## topic`);
      const next = lines[i + 1] ?? "";
      const hm = next.match(/^\s+hi:\s*(.+)$/);
      if (!hm) errors.push(`line ${ln}: missing "  hi:" line after fact`);
      else i++;
      const { ids, source } = parseBraces(m[6], ln, errors);
      const origin = m[3] ? "uk" : "nat";
      if (origin === "uk" && ids.length === 0) errors.push(`line ${ln}: Uttarakhand fact without question IDs`);
      if (origin === "nat" && !source && ids.length === 0) errors.push(`line ${ln}: national fact without a source`);
      facts.push({
        level: m[1] as Fact["level"],
        origin,
        bookChapter: m[3] ? Number(m[3]) : undefined,
        subject: m[4],
        en: m[5],
        hi: hm ? hm[1] : "",
        ids,
        source,
        section,
        sectionHi,
        topic,
        topicHi,
        line: ln,
      });
      continue;
    }
    if (!/^\s+hi:/.test(raw)) errors.push(`line ${ln}: unexpected line`);
  }
  const number = Number(meta.video ?? path.basename(file).match(/\d+/)?.[0] ?? 0);
  return { file, meta, number, facts, verify, errors };
}

export function listVideoFiles(): string[] {
  if (!fs.existsSync(NOTES_DIR)) return [];
  return fs
    .readdirSync(NOTES_DIR)
    .filter((f) => /^video-\d\d\.md$/.test(f))
    .sort()
    .map((f) => path.join(NOTES_DIR, f));
}

/** Every question ID in the exported one-liner source, with the chapter file it sits in. */
export function loadSourceIds(): Map<string, string> {
  const ids = new Map<string, string>();
  if (!fs.existsSync(SOURCE_DIR)) return ids;
  for (const f of fs.readdirSync(SOURCE_DIR).filter((x) => /^CH\d\d\.md$/.test(x))) {
    const chapter = f.slice(0, 4);
    for (const m of fs.readFileSync(path.join(SOURCE_DIR, f), "utf-8").matchAll(/^- \[([A-Z]+-UKGK-CH\d\d-\d{4})\]/gm)) {
      ids.set(m[1], chapter);
    }
  }
  return ids;
}

/** deferred.md lines: "- V40 | CH01-0012 CH01-0050 | why". A question may go to several videos. */
export function loadDeferred(): Map<string, number[]> {
  const file = path.join(NOTES_DIR, "deferred.md");
  const out = new Map<string, number[]>();
  if (!fs.existsSync(file)) return out;
  for (const line of fs.readFileSync(file, "utf-8").split(/\r?\n/)) {
    const m = line.match(/^- V(\d+)\s*\|\s*([^|]+)/);
    if (!m) continue;
    for (const tok of m[2].split(/[\s,]+/).filter(Boolean)) {
      const id = expandId(tok) ?? `BAD:${tok}`;
      out.set(id, [...(out.get(id) ?? []), Number(m[1])]);
    }
  }
  return out;
}
