import { supabaseAdmin } from "./supabase";

/**
 * Admin → Question Bank: filter the whole bank (section, chapter, source
 * file, difficulty, format, status, which test uses it) and search the text.
 * Server-side only. Columns source_file / question_format / section_code
 * come from schema-phase14-bank-browser.sql and are set by the loader.
 */

export const SECTIONS: Record<string, string> = {
  UKGK: "Uttarakhand GK",
  CA: "Current Affairs",
  HIS: "History",
  GEO: "Geography",
  POL: "Polity",
  ECO: "Economy",
  ENV: "Environment",
  SCI: "Science & Tech",
};

export const FORMATS = [
  "Factual recall / Direct",
  "Statement-based",
  "Match the following",
  "Multi-statement elimination",
  "Chronology",
  "Assertion-reason",
];

export type BankFilters = {
  q: string;
  section: string;
  chapter: string;
  source: string;
  difficulty: string;
  format: string;
  status: string; // "" | "active" | "inactive"
  usage: string; // "" | "unused" | "used" | <test id>
};

export const EMPTY_FILTERS: BankFilters = { q: "", section: "", chapter: "", source: "", difficulty: "", format: "", status: "", usage: "" };

export function filtersFrom(params: Record<string, string | string[] | undefined>): BankFilters {
  const one = (k: keyof BankFilters) => {
    const v = params[k];
    return (Array.isArray(v) ? v[0] : v ?? "").trim().slice(0, 200);
  };
  return {
    q: one("q"),
    section: one("section"),
    chapter: one("chapter"),
    source: one("source"),
    difficulty: one("difficulty"),
    format: one("format"),
    status: one("status"),
    usage: one("usage"),
  };
}

export type BankTest = { id: string; test_name: string; question_ids: string[] };

export type BankQuestion = {
  id: string;
  question_id: string;
  section_code: string | null;
  subject: string | null;
  topic: string | null;
  subtopic: string | null;
  difficulty: string | null;
  question_format: string | null;
  source_file: string | null;
  status: string | null;
  question_text_english: string;
  question_text_hindi: string;
  option_a_english: string | null;
  option_a_hindi: string | null;
  option_b_english: string | null;
  option_b_hindi: string | null;
  option_c_english: string | null;
  option_c_hindi: string | null;
  option_d_english: string | null;
  option_d_hindi: string | null;
  correct_answer: string;
  explanation_english: string | null;
  explanation_hindi: string | null;
};

const FULL_COLUMNS =
  "id, question_id, section_code, subject, topic, subtopic, difficulty, question_format, source_file, status, question_text_english, question_text_hindi, option_a_english, option_a_hindi, option_b_english, option_b_hindi, option_c_english, option_c_hindi, option_d_english, option_d_hindi, correct_answer, explanation_english, explanation_hindi";

/** Every test with questions, and question uuid -> names of the tests that use it. */
export async function getTestUsage(): Promise<{ tests: BankTest[]; testsOf: Map<string, string[]> }> {
  const { data } = await supabaseAdmin().from("tests").select("id, test_name, question_ids").order("test_name");
  const tests = ((data ?? []) as BankTest[]).filter((t) => (t.question_ids?.length ?? 0) > 0);
  const testsOf = new Map<string, string[]>();
  for (const t of tests) for (const id of t.question_ids) testsOf.set(id, [...(testsOf.get(id) ?? []), t.test_name]);
  return { tests, testsOf };
}

/** Values for the chapter and source-file dropdowns (one light column scan). */
export async function getFilterOptions(section: string): Promise<{ chapters: { code: string; name: string }[]; sources: string[] }> {
  const db = supabaseAdmin();
  const chapters = new Map<string, string>();
  const sources = new Set<string>();
  for (let from = 0; from < 20000; from += 1000) {
    const { data, error } = await db.from("questions").select("section_code, subtopic, topic, source_file").range(from, from + 999);
    if (error || !data?.length) break;
    for (const r of data) {
      if (r.source_file) sources.add(r.source_file as string);
      if (r.subtopic && (!section || r.section_code === section)) chapters.set(r.subtopic as string, (r.topic as string) ?? "");
    }
    if (data.length < 1000) break;
  }
  return {
    chapters: [...chapters].map(([code, name]) => ({ code, name })).sort((a, b) => a.code.localeCompare(b.code)),
    sources: [...sources].sort(),
  };
}

// PostgREST's or() syntax treats , ( ) as separators; drop them from free text.
const safeText = (s: string) => s.replace(/[,()%*\\]/g, " ").trim();

/**
 * All questions matching the filters, as (id, question_id) in question_id
 * order. The "used / unused" filter needs every test's list, so the match is
 * done in memory over at most the whole bank (~8k rows).
 */
export async function matchQuestions(f: BankFilters, testsOf: Map<string, string[]>, tests: BankTest[]): Promise<string[]> {
  const db = supabaseAdmin();
  const onlyIds = f.usage && f.usage !== "used" && f.usage !== "unused" ? new Set(tests.find((t) => t.id === f.usage)?.question_ids ?? []) : null;
  const out: string[] = [];
  for (let from = 0; from < 20000; from += 1000) {
    let query = db.from("questions").select("id, question_id").order("question_id").range(from, from + 999);
    if (f.section) query = query.eq("section_code", f.section);
    if (f.chapter) query = query.eq("subtopic", f.chapter);
    if (f.source) query = query.eq("source_file", f.source);
    if (f.difficulty) query = query.eq("difficulty", f.difficulty);
    if (f.format) query = query.eq("question_format", f.format);
    if (f.status === "inactive") query = query.eq("status", "inactive");
    if (f.status === "active") query = query.or("status.is.null,status.neq.inactive");
    const text = safeText(f.q);
    if (text) {
      query = query.or(`question_id.ilike.*${text}*,question_text_english.ilike.*${text}*,question_text_hindi.ilike.*${text}*`);
    }
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    for (const r of data ?? []) {
      const id = r.id as string;
      if (f.usage === "unused" && testsOf.has(id)) continue;
      if (f.usage === "used" && !testsOf.has(id)) continue;
      if (onlyIds && !onlyIds.has(id)) continue;
      out.push(id);
    }
    if (!data || data.length < 1000) break;
  }
  return out;
}

export async function getQuestionsByIds(ids: string[]): Promise<BankQuestion[]> {
  if (!ids.length) return [];
  const rows: BankQuestion[] = [];
  for (let i = 0; i < ids.length; i += 200) {
    const { data, error } = await supabaseAdmin().from("questions").select(FULL_COLUMNS).in("id", ids.slice(i, i + 200));
    if (error) throw new Error(error.message);
    rows.push(...((data ?? []) as BankQuestion[]));
  }
  const order = new Map(ids.map((id, i) => [id, i]));
  return rows.sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
}
