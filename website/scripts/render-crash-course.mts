/**
 * Render crash-course master notes into slides, a Hindi student PDF and
 * one-liner book entries. No AI here: everything comes from the master file.
 *
 *   cd website
 *   npx.cmd --yes tsx scripts/render-crash-course.mts          (all videos)
 *   npx.cmd --yes tsx scripts/render-crash-course.mts 2 3      (some videos)
 *
 * Reads  ../test series questions/crash-course/video-NN.md (+ glossary-hi.tsv)
 * Writes ../content-output/crash-course/video-NN/  (git-ignored)
 *   slides.html / slides.pdf   16:9, core facts, English with Hindi key terms
 *   notes-hi.pdf / notes-en.pdf   A4 notes (Hindi medium / English medium), core + extra
 *   book.md / book.tsv         one-liners: Uttarakhand by book chapter, then National by subject
 *   to-verify.md               conflicts for the owner (never shown to students)
 * PDFs are printed with Chrome (set CHROME_PATH if it is not in the usual place).
 */
import * as fs from "fs";
import * as path from "path";
import { execFileSync } from "child_process";
import { pathToFileURL } from "url";
import { BOOK_CHAPTERS, NOTES_DIR, OUT_DIR, ROOT, listVideoFiles, parseVideo, type Fact, type Video } from "./crash-course-lib.mjs";

const SUBJECTS: Record<string, string> = {
  geography: "Geography",
  environment: "Environment & Ecology",
  history: "History",
  polity: "Polity",
  economy: "Economy",
  science: "Science & Technology",
  culture: "Art & Culture",
  ir: "International Relations",
  strategy: "Exam Strategy",
};

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const bold = (s: string) => s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
const plain = (s: string) => s.replace(/\*\*/g, "");

function loadGlossary(): [string, string][] {
  const file = path.join(NOTES_DIR, "glossary-hi.tsv");
  if (!fs.existsSync(file)) return [];
  return fs
    .readFileSync(file, "utf-8")
    .split(/\r?\n/)
    .map((l) => l.split("\t"))
    .filter((p) => p.length >= 2 && p[0].trim() && !p[0].startsWith("#"))
    .map((p) => [p[0].trim(), p[1].trim()] as [string, string])
    .sort((a, b) => b[0].length - a[0].length);
}

/** Adds the Hindi term after the first use of each glossary term on a slide. */
function addHindiTerms(texts: string[], glossary: [string, string][]): string[] {
  const used = new Set<string>();
  return texts.map((t) => {
    let out = t;
    for (const [en, hi] of glossary) {
      if (used.has(hi)) continue;
      const re = new RegExp(`(?<![\\w-])(${en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})(?![\\w-])(\\*\\*)?`, "i");
      if (re.test(out)) {
        out = out.replace(re, (_m, term, close) => `${term}${close ?? ""}\u0000${hi}\u0001`);
        used.add(hi);
      }
    }
    return out;
  });
}

function chunk(facts: Fact[]): Fact[][] {
  const pages: Fact[][] = [];
  let cur: Fact[] = [];
  let chars = 0;
  for (const f of facts) {
    const n = plain(f.en).length;
    if (cur.length && (cur.length >= 6 || chars + n > 620)) {
      pages.push(cur);
      cur = [];
      chars = 0;
    }
    cur.push(f);
    chars += n;
  }
  if (cur.length) pages.push(cur);
  if (pages.length < 2) return pages;
  // Same number of slides, but spread the bullets evenly across them.
  const n = pages.length;
  const total = facts.reduce((s, f) => s + plain(f.en).length, 0);
  const even: Fact[][] = [];
  let page: Fact[] = [];
  let acc = 0;
  for (const f of facts) {
    const len = plain(f.en).length;
    if (page.length && even.length < n - 1 && (acc + len / 2 > (total * (even.length + 1)) / n || page.length >= 6)) {
      even.push(page);
      page = [];
    }
    page.push(f);
    acc += len;
  }
  even.push(page);
  return even;
}

function planDate(n: number): string {
  try {
    const plan = JSON.parse(fs.readFileSync(path.join(ROOT, "website", "content", "crashCoursePlan.json"), "utf-8"));
    const v = plan.videos.find((x: { number: number }) => x.number === n);
    return v ? `${v.module} · ${new Date(v.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}` : "";
  } catch {
    return "";
  }
}

const FONT = `"Segoe UI", "Nirmala UI", system-ui, sans-serif`;

function slidesHtml(v: Video, glossary: [string, string][]): { html: string; count: number } {
  const title = v.meta.title ?? `Video ${v.number}`;
  const footer = `UKPSC Decoded · Video ${v.number} · ${esc(title)}`;
  const slides: string[] = [];
  slides.push(`<section class="slide title">
    <div class="kicker">${esc(planDate(v.number))}</div>
    <div class="vno">Video ${v.number}</div>
    <h1>${esc(title)}</h1>
    <div class="hi big">${esc(v.meta.title_hi ?? "")}</div>
    ${v.meta.book ? `<div class="read">Read: Uttarakhand Decoded — ${esc(v.meta.book)}</div>` : ""}
    <div class="brand">UKPSC Decoded · ukpscdecoded.in</div>
  </section>`);

  const core = v.facts.filter((f) => f.level === "core");
  let lastSection = "";
  const topics: { section: string; sectionHi: string; topic: string; topicHi: string; facts: Fact[] }[] = [];
  for (const f of core) {
    const t = topics[topics.length - 1];
    if (t && t.section === f.section && t.topic === f.topic) t.facts.push(f);
    else topics.push({ section: f.section, sectionHi: f.sectionHi, topic: f.topic, topicHi: f.topicHi, facts: [f] });
  }
  for (const t of topics) {
    if (t.section !== lastSection) {
      lastSection = t.section;
      slides.push(`<section class="slide divider"><h1>${esc(t.section)}</h1><div class="hi big">${esc(t.sectionHi)}</div><footer>${footer}</footer></section>`);
    }
    const pages = chunk(t.facts);
    pages.forEach((page, i) => {
      const chars = page.reduce((s, f) => s + plain(f.en).length, 0);
      const size = chars <= 300 ? 31 : chars <= 460 ? 27 : 24;
      const texts = addHindiTerms(page.map((f) => f.en), glossary).map((t) =>
        bold(esc(t)).replace(/\u0000(.*?)\u0001/g, ` <span class="term">($1)</span>`),
      );
      const nat = page.every((f) => f.origin === "nat" && f.subject !== "strategy");
      slides.push(`<section class="slide">
        <header><h2>${esc(t.topic)}${pages.length > 1 ? ` <span class="contd">${i + 1}/${pages.length}</span>` : ""}</h2>
        <div class="hi">${esc(t.topicHi)}</div>${nat ? `<span class="tag">National</span>` : ""}</header>
        <ul style="font-size:${size}px">${texts.map((x) => `<li>${x}</li>`).join("")}</ul>
        <footer>${footer}</footer>
      </section>`);
    });
  }
  slides.push(`<section class="slide title end">
    <h1>Revise · Practise · Repeat</h1>
    ${v.meta.book ? `<div class="read">Today: read Uttarakhand Decoded — ${esc(v.meta.book)}</div>` : ""}
    <div class="read">Free practice tests: ukpscdecoded.in</div>
    <div class="brand">UKPSC Decoded</div>
  </section>`);

  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Video ${v.number} — ${esc(title)}</title>
<style>
@page { size: 1280px 720px; margin: 0; }
* { box-sizing: border-box; }
html, body { margin: 0; background: #0f0f0e; }
body { font-family: ${FONT}; color: #f1f1ef; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.slide { width: 1280px; height: 720px; position: relative; overflow: hidden; padding: 56px 72px 70px; background: #1b1a19; page-break-after: always; break-after: page; }
@media screen { .slide { margin: 0 auto 24px; } }
.slide::before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 10px; background: #ffb620; }
header { border-bottom: 2px solid #43413e; padding-bottom: 14px; margin-bottom: 26px; position: relative; }
h2 { margin: 0; font-size: 40px; font-weight: 700; color: #fff; }
.contd { font-size: 22px; color: #a3a09a; font-weight: 400; }
.hi { font-family: "Nirmala UI", ${FONT}; color: #ffc94a; font-size: 24px; margin-top: 4px; }
.hi.big { font-size: 40px; margin-top: 14px; }
.tag { position: absolute; right: 0; top: 6px; background: #0b9163; color: #fff; font-size: 16px; padding: 4px 12px; border-radius: 999px; letter-spacing: .06em; text-transform: uppercase; }
ul { margin: 0; padding: 0; list-style: none; line-height: 1.38; }
li { position: relative; padding-left: 34px; margin-bottom: .62em; }
li::before { content: ""; position: absolute; left: 4px; top: .52em; width: 12px; height: 12px; border-radius: 3px; background: #ffb620; }
strong { color: #ffc94a; font-weight: 700; }
.term { font-family: "Nirmala UI", ${FONT}; color: #73e3b3; font-size: .82em; }
footer { position: absolute; left: 72px; right: 72px; bottom: 24px; font-size: 15px; color: #7a7771; border-top: 1px solid #2b2a28; padding-top: 10px; }
.title, .divider { display: flex; flex-direction: column; justify-content: center; }
.title h1 { font-size: 62px; margin: 10px 0 0; line-height: 1.1; }
.divider h1 { font-size: 64px; margin: 0; }
.divider { background: radial-gradient(circle at 85% 20%, #43413e 0, #1b1a19 55%); }
.vno { font-size: 30px; color: #ffb620; font-weight: 700; letter-spacing: .04em; }
.kicker { font-size: 20px; color: #a3a09a; text-transform: uppercase; letter-spacing: .12em; }
.read { margin-top: 28px; font-size: 24px; color: #cbc9c5; }
.brand { position: absolute; bottom: 40px; left: 72px; font-size: 20px; color: #ffb620; font-weight: 600; }
.end h1 { color: #ffb620; }
</style></head><body>
${slides.join("\n")}
</body></html>`;
  return { html, count: slides.length };
}

function notesHtml(v: Video, lang: "hi" | "en"): string {
  const hi = lang === "hi";
  const L = hi
    ? { video: "वीडियो", read: "पढ़ें: उत्तराखंड डिकोडेड", book: v.meta.book_hi || v.meta.book, legend: "● मुख्य तथ्य (स्लाइड में) &nbsp; ○ अतिरिक्त तथ्य", foot: "निःशुल्क अभ्यास टेस्ट वेबसाइट पर" }
    : { video: "Video", read: "Read: Uttarakhand Decoded", book: v.meta.book, legend: "● Core fact (on slides) &nbsp; ○ Extra fact", foot: "free practice tests on the website" };
  const title = (hi ? v.meta.title_hi : v.meta.title) || v.meta.title || `${L.video} ${v.number}`;
  const parts: string[] = [];
  let section = "", topic = "";
  for (const f of v.facts) {
    if (f.section !== section) {
      if (topic) parts.push("</ul>");
      section = f.section;
      topic = "";
      parts.push(`<h2>${esc((hi && f.sectionHi) || f.section)}</h2>`);
    }
    if (f.topic !== topic) {
      if (topic) parts.push("</ul>");
      topic = f.topic;
      parts.push(`<h3>${esc((hi && f.topicHi) || f.topic)}</h3><ul>`);
    }
    parts.push(`<li class="${f.level}${f.origin === "nat" ? " nat" : ""}">${bold(esc((hi && f.hi) || f.en))}</li>`);
  }
  if (topic) parts.push("</ul>");
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><title>${L.video} ${v.number} — ${esc(title)}</title>
<style>
@page { size: A4; margin: 15mm 15mm 16mm; }
body { font-family: "Nirmala UI", ${FONT}; font-size: 11pt; line-height: 1.55; color: #1b1a19; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.top { border-bottom: 3px solid #f59307; padding-bottom: 8px; margin-bottom: 6px; }
.top .k { font-size: 9.5pt; color: #7a7771; letter-spacing: .04em; }
h1 { font-size: 20pt; margin: 2px 0 0; color: #0f0f0e; }
.legend { font-size: 9pt; color: #5c5a55; margin: 6px 0 4px; }
h2 { font-size: 14.5pt; color: #fff; background: #2b2a28; padding: 4px 10px; margin: 16px 0 6px; border-left: 6px solid #ffb620; break-after: avoid; }
h3 { font-size: 12pt; color: #b44b06; margin: 10px 0 3px; break-after: avoid; }
ul { margin: 0; padding-left: 18px; }
li { margin: 2px 0; break-inside: avoid; }
li.core::marker { color: #d96d02; }
li.extra { color: #43413e; list-style-type: circle; }
li.nat { }
strong { color: #92390c; }
.foot { margin-top: 18px; font-size: 9pt; color: #7a7771; border-top: 1px solid #e2e1de; padding-top: 6px; }
</style></head><body>
<div class="top"><div class="k">UKPSC DECODED · ${L.video} ${v.number}${L.book ? ` · ${L.read} ${esc(L.book)}` : ""}</div><h1>${esc(title)}</h1>
<div class="legend">${L.legend}</div></div>
${parts.join("\n")}
<div class="foot">UKPSC Decoded · ukpscdecoded.in · ${L.foot}</div>
</body></html>`;
}

function bookOutputs(v: Video): { md: string; tsv: string } {
  const uk = v.facts.filter((f) => f.origin === "uk").sort((a, b) => (a.bookChapter! - b.bookChapter!) || a.line - b.line);
  const nat = v.facts.filter((f) => f.origin === "nat" && f.subject !== "strategy");
  const md: string[] = [`# One-liners — Video ${v.number}: ${v.meta.title ?? ""}`, ""];
  const tsv: string[] = [["part", "chapter_or_subject", "section", "topic", "level", "english", "hindi", "question_ids", "source"].join("\t")];
  const emit = (facts: Fact[], heading: (f: Fact) => string, part: string, key: (f: Fact) => string) => {
    let h = "", sec = "", n = 0;
    for (const f of facts) {
      if (heading(f) !== h) {
        h = heading(f);
        sec = "";
        md.push(`### ${h}`, "");
      }
      if (f.topic !== sec) {
        sec = f.topic;
        md.push(`#### ${f.topic}`, "");
        n = 0;
      }
      md.push(`${++n}. ${plain(f.en)}`);
      tsv.push([part, key(f), f.section, f.topic, f.level, plain(f.en), plain(f.hi), f.ids.join(" "), f.source ?? ""].join("\t"));
    }
    md.push("");
  };
  if (uk.length) {
    md.push("## Uttarakhand", "");
    emit(uk, (f) => `Ch ${f.bookChapter} — ${BOOK_CHAPTERS[f.bookChapter!] ?? ""}`, "Uttarakhand", (f) => `Ch ${f.bookChapter}`);
  }
  if (nat.length) {
    md.push("## National", "");
    emit(nat, (f) => SUBJECTS[f.subject!] ?? f.subject!, "National", (f) => SUBJECTS[f.subject!] ?? f.subject!);
  }
  return { md: md.join("\n"), tsv: tsv.join("\n") + "\n" };
}

function chromePath(): string | null {
  const candidates = [
    process.env.CHROME_PATH,
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
  ].filter(Boolean) as string[];
  return candidates.find((p) => fs.existsSync(p)) ?? null;
}

function printPdf(chrome: string, htmlFile: string, pdfFile: string) {
  execFileSync(
    chrome,
    ["--headless=new", "--disable-gpu", "--no-pdf-header-footer", "--print-to-pdf-no-header", `--print-to-pdf=${pdfFile}`, pathToFileURL(htmlFile).href],
    { stdio: "ignore", timeout: 180000 },
  );
}

const wanted = process.argv.slice(2).map(Number).filter(Boolean);
const glossary = loadGlossary();
const chrome = chromePath();
if (!chrome) console.log("Chrome not found: writing HTML only (set CHROME_PATH to print PDFs).");

let failed = false;
for (const file of listVideoFiles()) {
  const v = parseVideo(file);
  if (wanted.length && !wanted.includes(v.number)) continue;
  if (v.errors.length) {
    failed = true;
    console.log(`Video ${v.number}: fix these first:\n  ${v.errors.join("\n  ")}`);
    continue;
  }
  const dir = path.join(OUT_DIR, `video-${String(v.number).padStart(2, "0")}`);
  fs.mkdirSync(dir, { recursive: true });
  const slides = slidesHtml(v, glossary);
  fs.writeFileSync(path.join(dir, "slides.html"), slides.html);
  fs.writeFileSync(path.join(dir, "notes-hi.html"), notesHtml(v, "hi"));
  fs.writeFileSync(path.join(dir, "notes-en.html"), notesHtml(v, "en"));
  const book = bookOutputs(v);
  if (book.tsv.split("\n").length > 2) {
    fs.writeFileSync(path.join(dir, "book.md"), book.md);
    fs.writeFileSync(path.join(dir, "book.tsv"), "\ufeff" + book.tsv);
  }
  fs.writeFileSync(
    path.join(dir, "to-verify.md"),
    `# Video ${v.number} — to verify\n\n` + (v.verify.length ? v.verify.map((t) => `- ${t.text} (${t.ids.join(", ")})`).join("\n") : "Nothing.") + "\n",
  );
  if (chrome) {
    printPdf(chrome, path.join(dir, "slides.html"), path.join(dir, "slides.pdf"));
    printPdf(chrome, path.join(dir, "notes-hi.html"), path.join(dir, "notes-hi.pdf"));
    printPdf(chrome, path.join(dir, "notes-en.html"), path.join(dir, "notes-en.pdf"));
  }
  const c = (pred: (f: Fact) => boolean) => v.facts.filter(pred).length;
  console.log(
    `Video ${v.number}: ${v.facts.length} facts (core ${c((f) => f.level === "core")}, extra ${c((f) => f.level === "extra")}; ` +
      `Uttarakhand ${c((f) => f.origin === "uk")}, national ${c((f) => f.origin === "nat")}), ${slides.count} slides, ${v.verify.length} to verify -> ${dir}`,
  );
}
if (failed) process.exit(1);
