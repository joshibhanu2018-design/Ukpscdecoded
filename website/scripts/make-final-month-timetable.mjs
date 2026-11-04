// Builds public/uploads/final-month-timetable.pdf (Revision Test Series +
// Mock Mahasangram timetable) from content/finalMonthSchedule.json.
// Run in website/:  node scripts/make-final-month-timetable.mjs
// Needs Playwright with Chromium (npx.cmd playwright install chromium once).
import { readFileSync, mkdirSync } from "node:fs";
import { chromium } from "playwright";

const schedule = JSON.parse(readFileSync("content/finalMonthSchedule.json", "utf8"));
const logo = readFileSync("public/logo-badge.png").toString("base64");

// Prices printed on the PDF (keep in step with supabase/schema-phase37/38).
const PRICES = {
  revision: "₹999",
  maha: "₹399 till 11 Nov (then ₹499)",
  upgrade: "₹500",
  crash: { now: "₹2,222", was: "₹2,999" },
  ukNat: { now: "₹1,188", was: "₹1,699" },
  pack: { now: "₹3,299", was: "₹3,999" },
  premium: { now: "₹1,399", was: "₹1,599" },
};

const KIND = {
  mock: { label: "Full mock · live rank · 12 noon–6 pm, ranks 8 pm", hi: "फुल मॉक · लाइव रैंक", color: "#f5b301" },
  uk: { label: "Uttarakhand GK · 100 Q", hi: "उत्तराखंड जीके", color: "#17b47a" },
  ca: { label: "Current Affairs · 100 Q", hi: "करेंट अफेयर्स", color: "#5b8def" },
  csat: { label: "CSAT · 100 Q", hi: "सीसैट", color: "#8a8a8a" },
};

const fmt = (iso) => {
  const d = new Date(`${iso}T12:00:00+05:30`);
  const o = (x) => d.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", ...x });
  return { wd: o({ weekday: "short" }), day: o({ day: "numeric" }), mon: o({ month: "short" }) };
};

const row = (t) => {
  const d = fmt(t.date);
  const k = KIND[t.kind];
  return `<tr>
    <td class="date"><b>${d.day} ${d.mon}</b><span>${d.wd}</span></td>
    <td><span class="dot" style="background:${k.color}"></span><b>${t.name}</b><div class="sub">${k.label} · <span class="hi">${k.hi}</span></div></td>
    <td class="tick"></td>
  </tr>`;
};

const mocks = schedule.tests.filter((t) => t.kind === "mock");

const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;700&display=swap" rel="stylesheet">
<style>
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: Inter, "Noto Sans Devanagari", sans-serif; color: #161616; }
  .page { width: 210mm; height: 297mm; padding: 14mm 14mm 12mm; position: relative; page-break-after: always; overflow: hidden; }
  .page:last-child { page-break-after: auto; }
  .head { display: flex; align-items: center; gap: 10px; border-bottom: 3px solid #f5b301; padding-bottom: 8px; }
  .head img { width: 42px; height: 42px; }
  .brand { font-weight: 800; font-size: 18px; } .brand span { color: #c98f00; }
  .head .right { margin-left: auto; text-align: right; font-size: 11px; color: #555; }
  h1 { font-size: 26px; margin: 14px 0 2px; } h1 span { color: #c98f00; }
  .lead { font-size: 12.5px; color: #444; margin: 0 0 10px; }
  .hi { font-family: "Noto Sans Devanagari", Inter, sans-serif; }
  .cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin: 8px 0 8px; }
  .card { border: 1.5px solid #e6e6e6; border-radius: 10px; padding: 9px 10px; font-size: 11.5px; }
  .card b { display: block; font-size: 13px; margin-bottom: 2px; }
  .card.gold { border-color: #f5b301; background: #fff8e1; }
  table { width: 100%; border-collapse: collapse; font-size: 11.5px; }
  td { border-bottom: 1px solid #ececec; padding: 3px 6px; vertical-align: middle; line-height: 1.25; }
  td.date { width: 84px; white-space: nowrap; } td.date b { font-size: 12.5px; } td.date span { color: #777; font-size: 10px; margin-left: 4px; }
  td.tick { width: 26px; } td.tick::after { content: ""; display: inline-block; width: 13px; height: 13px; border: 1.5px solid #bbb; border-radius: 3px; }
  .dot { display: inline-block; width: 9px; height: 9px; border-radius: 50%; margin-right: 6px; }
  .sub { color: #666; font-size: 9.5px; margin-left: 15px; }
  .rules { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin: 12px 0; }
  .rule { background: #161616; color: #fff; border-radius: 10px; padding: 10px; font-size: 11.5px; }
  .rule b { color: #f5b301; display: block; font-size: 15px; }
  .big { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 8px; }
  .bd { border: 2px solid #f5b301; border-radius: 12px; text-align: center; padding: 8px; }
  .bd .n { font-size: 11px; color: #777; } .bd .d { font-size: 26px; font-weight: 800; } .bd .w { font-size: 11px; font-weight: 600; }
  .bd.free { background: #e9fbf2; border-color: #17b47a; }
  .foot { position: absolute; left: 14mm; right: 14mm; bottom: 10mm; border-top: 2px solid #161616; padding-top: 8px; font-size: 10.5px; }
  .prices { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin: 6px 0; }
  .p { background: #f6f6f6; border-radius: 8px; padding: 6px; } .p b { display: block; font-size: 13px; } .p s { color: #999; }
  .links { color: #555; }
</style></head><body>

<section class="page">
  <div class="head"><img src="data:image/png;base64,${logo}"><div class="brand">UKPSC <span>Decoded</span></div>
    <div class="right">UKPSC Prelims 2026 · Exam: Sun 29 Nov<br>www.ukpscdecoded.in/revision</div></div>
  <h1>Final Revision <span>Test Series</span></h1>
  <p class="lead">22 tests · 2,500 questions · one test a day, finished before the exam. <span class="hi">अंतिम महीने की पूरी रिवीज़न टेस्ट सीरीज़।</span></p>
  <div class="cards">
    <div class="card gold"><b>6 full mocks</b>All Uttarakhand Rank Challenge, 150 Q each, live rank</div>
    <div class="card"><b>Uttarakhand GK</b>8 tests · 800 questions</div>
    <div class="card"><b>Current Affairs</b>6 tests · 600 questions · + 2 CSAT</div>
  </div>
  <table>${schedule.tests.map(row).join("")}
    <tr><td class="date"><b>27–28 Nov</b><span>Fri–Sat</span></td><td><b>No new test</b><div class="sub">Retake your 2 weakest tests · read your wrong-answer list</div></td><td class="tick"></td></tr>
  </table>
  <div class="foot">
    <b>Revision Test Series ${PRICES.revision}</b> · Mock Mahasangram students upgrade for ${PRICES.upgrade} · Crash Course / Basic / other test series buyers: 20% off when logged in · Premium & Complete Prelims Pack: included free.
    <div class="links">Every test stays open till 31 Dec 2026 (useful for Lower PCS too). Telegram: t.me/ukpscdecoded · YouTube: @Ukpscdecoded</div>
  </div>
</section>

<section class="page">
  <div class="head"><img src="data:image/png;base64,${logo}"><div class="brand">UKPSC <span>Decoded</span></div>
    <div class="right">www.ukpscdecoded.in/mahasangram</div></div>
  <h1>All Uttarakhand <span>Rank Challenge</span></h1>
  <p class="lead"><b>Mock Mahasangram · Are you the next topper?</b> Free Warm-up Mock open now till 11 Nov, with a live rank list.</p>
  <p class="lead">6 full-length mocks. Everyone writes the same mock on the same day; at 8 pm the rank list for all of Uttarakhand goes live. <span class="hi">एक ही दिन, एक ही मॉक, रात 8 बजे लाइव रैंक।</span></p>
  <div class="big">${mocks.map((t, i) => { const d = fmt(t.date); return `<div class="bd"><div class="n">Mock ${i + 1}</div><div class="d">${d.day} ${d.mon}</div><div class="w">${d.wd}</div></div>`; }).join("")}</div>
  <div class="rules">
    <div class="rule"><b>12 noon – 6 pm</b>Start any time in this window. 150 questions, 2 hours.</div>
    <div class="rule"><b>8 pm</b>Result, solutions and the live rank list (name + district).</div>
    <div class="rule"><b>Top 20 ★</b>Stars on the rank list. Top 3 win 30% off a course.</div>
  </div>
  <div class="cards">
    <div class="card gold"><b>${PRICES.maha}</b>All 6 Rank Challenge mocks (Mock Mahasangram). Different tests from the Basic Test Series. Try the free Warm-up Mock first.</div>
    <div class="card"><b>Upgrade ${PRICES.upgrade}</b>Add complete Uttarakhand GK (800 Q), Current Affairs (600 Q) and 2 CSAT: the Revision Test Series.</div>
    <div class="card"><b>Already our student?</b>20% off when logged in. Premium & Complete Prelims Pack: included free.</div>
  </div>
  <div class="foot">
    <b>Prices cut till 29 Nov, for one month, to make courses affordable for all</b>
    <div class="prices">
      <div class="p">Crash Course<b>${PRICES.crash.now} <s>${PRICES.crash.was}</s></b></div>
      <div class="p">Complete Prelims Pack<b>${PRICES.pack.now} <s>${PRICES.pack.was}</s></b></div>
      <div class="p">Premium Test Series<b>${PRICES.premium.now} <s>${PRICES.premium.was}</s></b></div>
      <div class="p">UK / National Crash Course<b>${PRICES.ukNat.now} <s>${PRICES.ukNat.was}</s></b></div>
    </div>
    <div class="links">Buy at www.ukpscdecoded.in · Telegram: t.me/ukpscdecoded · YouTube: @Ukpscdecoded</div>
  </div>
</section>
</body></html>`;

mkdirSync("public/uploads", { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(html, { waitUntil: "networkidle" }).catch(() => page.setContent(html));
await page.pdf({ path: "public/uploads/final-month-timetable.pdf", format: "A4", printBackground: true, preferCSSPageSize: true });
await browser.close();
console.log("Wrote public/uploads/final-month-timetable.pdf");
