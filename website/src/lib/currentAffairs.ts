// Current Affairs data helpers.
//
// Two ways to add a week's content in the CMS:
//
//  1. Structured — fill in Headline / Context / Source for each item.
//  2. Quick Publish — paste raw text into one box and let this file format it.
//
// Both can be used together; pasted items are appended after structured ones.

export interface CAItem {
  category: string;
  title: string;
  context?: string;
  source?: string;
}

export interface CAWeek {
  id: string;
  label: string;
  gistNote?: string;
  publishDate?: string;
  items: CAItem[];
}

/** Shape as it comes out of content/currentAffairs.json (most fields optional). */
export interface RawCAWeek {
  id?: string;
  label?: string;
  gistNote?: string;
  publishDate?: string;
  items?: CAItem[];
  paste?: string;
  pasteCategory?: string;
}

export const CA_CATEGORIES = ["Uttarakhand", "National", "International"] as const;

/** Accepted spellings for a category, mapped to the canonical name. */
const CATEGORY_ALIASES: Record<string, string> = {
  uttarakhand: "Uttarakhand",
  uk: "Uttarakhand",
  ukd: "Uttarakhand",
  state: "Uttarakhand",
  national: "National",
  india: "National",
  indian: "National",
  bharat: "National",
  international: "International",
  world: "International",
  global: "International",
};

function canonicalCategory(value: string | undefined, fallback = "Uttarakhand"): string {
  if (!value) return fallback;
  return CATEGORY_ALIASES[value.trim().toLowerCase()] ?? fallback;
}

/** Strip bullets, numbering and markdown decoration from a pasted line. */
function cleanLine(line: string): string {
  return line
    .replace(/[\u200b\u200e\u200f\ufeff]/g, "")
    .replace(/^\s*#{1,6}\s*/, "")
    .replace(/^\s*>\s*/, "")
    .replace(/^\s*(?:[-*•▪●·◦]|\(?\d{1,3}[.)]|\(?[a-z][.)])\s+/i, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/^\s*\*(.+?)\*\s*$/, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

function isBulleted(line: string): boolean {
  return /^\s*(?:[-*•▪●·◦]|\(?\d{1,3}[.)])\s+/.test(line);
}

/**
 * A line that is *only* a category name — e.g. "National", "## Uttarakhand",
 * "International Current Affairs:" — switches the category for the lines below it.
 */
function categoryHeader(text: string): string | null {
  const stripped = text
    .replace(/[:\-–—]+\s*$/, "")
    .replace(/\b(current affairs|affairs|news|section|updates?|gist|round[- ]?up)\b/gi, "")
    .replace(/[^a-z\s]/gi, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
  if (!stripped || stripped.length > 20) return null;
  return CATEGORY_ALIASES[stripped] ?? null;
}

/** "National: Something happened" -> category National, rest of the line. */
function inlineCategory(text: string): { category: string; rest: string } | null {
  const match = text.match(/^([A-Za-z][A-Za-z ]{1,18}?)\s*[:\-–—]\s+(\S.*)$/);
  if (!match) return null;
  const category = CATEGORY_ALIASES[match[1].trim().toLowerCase()];
  if (!category) return null;
  return { category, rest: match[2].trim() };
}

/** Pull a trailing source out of a line, if one is present. */
function extractSource(text: string): { text: string; source?: string } {
  const patterns: RegExp[] = [
    // (Source: The Hindu) / [Src - PIB]
    /\s*[([]\s*(?:source|src|courtesy)\s*[:\-–—]?\s*([^)\]]{2,80}?)\s*[)\]]\s*$/i,
    // ... | Source: PIB   /   ... — src: Tribune
    /\s*[|—–]\s*(?:source|src|courtesy)\s*[:\-–—]?\s*(.{2,80})$/i,
    // trailing parenthetical that contains a year, e.g. (Tribune India, 12 July 2026)
    /\s*\(\s*([^()]{3,70}?\b(?:19|20)\d{2}\b[^()]{0,15})\s*\)\s*$/,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return { text: text.replace(pattern, "").trim(), source: match[1].trim() };
    }
  }
  return { text };
}

/** Split "Headline — supporting context" into its two parts. */
function splitTitleContext(text: string): { title: string; context?: string } {
  for (const separator of [" — ", " – ", " -- ", " | ", " :: "]) {
    const index = text.indexOf(separator);
    if (index >= 12 && index <= 180) {
      const title = text.slice(0, index).trim();
      const context = text.slice(index + separator.length).trim();
      if (title) return { title, context: context || undefined };
    }
  }
  // A very long single line: break after the first sentence.
  if (text.length > 150) {
    const match = text.match(/^(.{25,150}?[.!?])\s+(\S.*)$/);
    if (match) {
      return { title: match[1].replace(/\.$/, "").trim(), context: match[2].trim() };
    }
  }
  return { title: text };
}

/** Page numbers, section titles, bare URLs and other paste debris. */
function isNoise(text: string): boolean {
  if (text.length < 8) return true;
  if (!/[a-z]/i.test(text)) return true;
  if (/^page\s*\d+/i.test(text)) return true;
  if (/^https?:\/\/\S+$/i.test(text)) return true;
  if (/^(current affairs|weekly gist|daily current affairs|index|contents?|notes?)$/i.test(text)) {
    return true;
  }
  return false;
}

const MAX_ITEMS_PER_WEEK = 250;

/**
 * Turn a raw pasted blob into formatted headlines.
 *
 * Recognised on each line:
 *  - bullets and numbering ("- ", "1. ", "• ") are stripped
 *  - a line that is just a category name switches category for what follows
 *  - "National: headline" sets the category for that one headline
 *  - "Headline — context" splits into headline plus context
 *  - "(Source: PIB)" or "| Source: PIB" is captured as the source
 *  - "Context: ..." / "Source: ..." lines attach to the headline above them
 *  - a wrapped line starting with a lowercase letter joins the line above it
 */
export function parseQuickPaste(raw?: string, defaultCategory?: string): CAItem[] {
  if (!raw || !raw.trim()) return [];

  let category = canonicalCategory(defaultCategory);
  const items: CAItem[] = [];
  const seen = new Set<string>();
  let breakPending = false;

  const lines = raw.replace(/\r\n?/g, "\n").split("\n");

  for (const rawLine of lines) {
    if (!rawLine.trim()) {
      breakPending = true;
      continue;
    }

    const bulleted = isBulleted(rawLine);
    let text = cleanLine(rawLine);
    if (!text) {
      breakPending = true;
      continue;
    }

    // A standalone category heading.
    const header = categoryHeader(text);
    if (header) {
      category = header;
      breakPending = true;
      continue;
    }

    const previous = items[items.length - 1];

    // Explicit "Context:" / "Source:" lines attach to the previous headline.
    const contextLabel = text.match(/^(?:context|analysis|why it matters)\s*[:\-–—]\s*(\S.*)$/i);
    if (contextLabel && previous) {
      previous.context = previous.context
        ? `${previous.context} ${contextLabel[1].trim()}`
        : contextLabel[1].trim();
      breakPending = false;
      continue;
    }
    const sourceLabel = text.match(/^(?:source|src|courtesy)\s*[:\-–—]\s*(\S.*)$/i);
    if (sourceLabel && previous) {
      previous.source = sourceLabel[1].trim();
      breakPending = false;
      continue;
    }

    if (isNoise(text)) {
      continue;
    }

    // Per-line category prefix.
    let lineCategory = category;
    const inline = inlineCategory(text);
    if (inline) {
      lineCategory = inline.category;
      category = inline.category;
      text = inline.rest;
    }

    // A wrapped continuation line starts lowercase and follows a headline directly.
    const isContinuation =
      !bulleted && !breakPending && !!previous && /^[a-z(,;]/.test(text);

    if (isContinuation && previous) {
      previous.context = previous.context ? `${previous.context} ${text}` : text;
      const pulled = extractSource(previous.context);
      previous.context = pulled.text || undefined;
      if (pulled.source && !previous.source) previous.source = pulled.source;
      continue;
    }

    if (items.length >= MAX_ITEMS_PER_WEEK) break;

    const withoutSource = extractSource(text);
    const { title, context } = splitTitleContext(withoutSource.text);
    if (!title || isNoise(title)) {
      breakPending = false;
      continue;
    }

    const key = title.toLowerCase();
    if (seen.has(key)) {
      breakPending = false;
      continue;
    }
    seen.add(key);

    items.push({
      category: lineCategory,
      title,
      ...(context ? { context } : {}),
      ...(withoutSource.source ? { source: withoutSource.source } : {}),
    });
    breakPending = false;
  }

  return items;
}

/** "2026-08-03" -> "August 2026 — Week 1" */
function deriveLabel(publishDate?: string): string {
  if (!publishDate) return "Latest Week";
  const date = new Date(publishDate);
  if (Number.isNaN(date.getTime())) return publishDate;
  const month = date.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  const week = Math.ceil(date.getDate() / 7);
  return `${month} — Week ${week}`;
}

/**
 * Normalise the raw JSON weeks: merge structured items with Quick Publish
 * items, fill in missing ids/labels, drop empty weeks, newest first.
 */
export function buildWeeks(rawWeeks: RawCAWeek[]): CAWeek[] {
  const usedIds = new Set<string>();

  const weeks = rawWeeks.map((week, index) => {
    const structured = (week.items ?? []).filter((item) => item && item.title);
    const pasted = parseQuickPaste(week.paste, week.pasteCategory);

    // De-duplicate across both sources, keeping the structured entry.
    const seen = new Set(structured.map((item) => item.title.trim().toLowerCase()));
    const merged = [...structured];
    for (const item of pasted) {
      const key = item.title.trim().toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push({ ...item, category: canonicalCategory(item.category) });
    }

    let id = (week.id || week.publishDate || week.label || `week-${index + 1}`).trim();
    while (usedIds.has(id)) id = `${id}-${index + 1}`;
    usedIds.add(id);

    return {
      id,
      label: week.label?.trim() || deriveLabel(week.publishDate),
      gistNote: week.gistNote,
      publishDate: week.publishDate,
      items: merged,
    };
  });

  return weeks
    .filter((week) => week.items.length > 0)
    .sort((a, b) => (b.publishDate || "").localeCompare(a.publishDate || ""));
}

/** Group a week's items into the three display sections. */
export function groupByCategory(items: CAItem[]): Record<string, CAItem[]> {
  return {
    Uttarakhand: items.filter((item) => item.category === "Uttarakhand"),
    National: items.filter((item) => item.category === "National"),
    International: items.filter((item) => item.category === "International"),
  };
}
