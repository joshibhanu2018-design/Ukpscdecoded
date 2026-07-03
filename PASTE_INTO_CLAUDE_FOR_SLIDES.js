const pptxgen = require("pptxgenjs");

// ============ PALETTE: "Himalayan Slate & Amber" ============
const NAVY = "16233A";
const STEEL = "2E4057";
const AMBER = "E0A458";
const IVORY = "F7F5F1";
const CHARCOAL = "2A2A2A";
const WHITE = "FFFFFF";
const MUTED = "6B7280";
const GREEN = "3F7D58";
const GREY = "C7CFDB";

async function main() {
  let pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
  pres.author = "UKPSC Decoded";
  pres.title = "Video 1 — 450+ Questions Analysed";

  // ============ HELPER FUNCTIONS ============
  function questionCard(slide, x, y, w, h, tag, qno, text) {
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x, y, w, h, fill: { color: WHITE }, rectRadius: 0.07,
      shadow: { type: "outer", color: "000000", blur: 7, offset: 2, angle: 90, opacity: 0.1 }
    });
    slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: x + 0.2, y: y + 0.18, w: 1.7, h: 0.38, fill: { color: AMBER }, rectRadius: 0.19
    });
    slide.addText(tag, {
      x: x + 0.2, y: y + 0.18, w: 1.7, h: 0.38, align: "center", valign: "middle",
      fontFace: "Calibri", fontSize: 11, bold: true, color: NAVY, margin: 0
    });
    slide.addText(`Q.${qno}`, {
      x: x + w - 1.3, y: y + 0.18, w: 1.1, h: 0.38, align: "right",
      fontFace: "Cambria", fontSize: 15, bold: true, color: STEEL, margin: 0
    });
    slide.addText(text, {
      x: x + 0.2, y: y + 0.7, w: w - 0.4, h: h - 0.9,
      fontFace: "Calibri", fontSize: 12.5, color: CHARCOAL, margin: 0, valign: "top"
    });
  }

  // ============ SLIDE 1: TITLE ============
  let s1 = pres.addSlide();
  s1.background = { color: NAVY };

  s1.addText("UKPSC GS1 — PYQ DEEP ANALYSIS", {
    x: 0.8, y: 1.3, w: 11.7, h: 0.5,
    fontFace: "Calibri", fontSize: 15, color: AMBER, bold: true, charSpacing: 3
  });
  s1.addText("450+ Questions. 4 Papers. Asli Pattern.", {
    x: 0.8, y: 1.9, w: 11.7, h: 1.4,
    fontFace: "Cambria", fontSize: 42, color: WHITE, bold: true
  });
  s1.addText("2016 · 2021 · 2024 · 2025 — Question-by-Question, Cluster-by-Cluster", {
    x: 0.8, y: 3.3, w: 11, h: 0.5,
    fontFace: "Calibri", fontSize: 17, color: GREY
  });

  // Stat boxes
  const stats = [
    { n: "600", label: "Questions Tagged" },
    { n: "14", label: "Repeat-Topic Clusters" },
    { n: "8", label: "Confirmed Cross-Year Repeats" }
  ];
  stats.forEach((s, i) => {
    const x = 0.8 + i * 3.9;
    s1.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x, y: 4.5, w: 3.6, h: 1.2, fill: { color: STEEL, transparency: 30 }, rectRadius: 0.08
    });
    s1.addText([
      { text: s.n, options: { fontSize: 34, bold: true, color: AMBER, breakLine: true } },
      { text: s.label, options: { fontSize: 12, color: GREY } }
    ], { x: x + 0.2, y: 4.6, w: 3.2, h: 1.0, fontFace: "Calibri", valign: "middle" });
  });

  // Logo placeholder text
  s1.addText("UKPSC DECODED", {
    x: 4.5, y: 6.5, w: 4.3, h: 0.5, align: "center",
    fontFace: "Calibri", fontSize: 11, color: GREY, bold: true
  });

  // ============ SLIDE 2: WHAT I ANALYSED ============
  let s2 = pres.addSlide();
  s2.background = { color: IVORY };

  s2.addText("What I Analysed", {
    x: 0.7, y: 0.5, w: 11.9, h: 0.8,
    fontFace: "Cambria", fontSize: 32, bold: true, color: NAVY
  });
  s2.addText("4 Official Papers. Every Question Hand-Tagged.", {
    x: 0.7, y: 1.2, w: 11.9, h: 0.5,
    fontFace: "Calibri", fontSize: 15, color: MUTED
  });

  // 4 Paper cards
  const papers = ["2016", "2021", "2024", "2025"];
  papers.forEach((yr, i) => {
    const x = 0.7 + i * 3.15;
    s2.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x, y: 2.0, w: 2.9, h: 2.3, fill: { color: WHITE }, rectRadius: 0.09,
      shadow: { type: "outer", color: "000000", blur: 8, offset: 3, angle: 90, opacity: 0.1 }
    });
    s2.addText([
      { text: "UKPCS", options: { fontSize: 12, color: MUTED, breakLine: true } },
      { text: yr, options: { fontSize: 44, bold: true, color: NAVY, breakLine: true } },
      { text: "150 Questions", options: { fontSize: 13, color: AMBER, bold: true } }
    ], { x, y: 2.2, w: 2.9, h: 1.9, fontFace: "Calibri", align: "center", valign: "middle" });
  });

  // Bottom bar
  s2.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.7, y: 4.8, w: 11.9, h: 1.5, fill: { color: NAVY }, rectRadius: 0.08
  });
  s2.addText([
    { text: "Every question tagged: ", options: { bold: true, color: WHITE } },
    { text: "Subject · Syllabus Unit · Cross-year repeat check", options: { color: GREY } }
  ], { x: 1.0, y: 5.0, w: 11.3, h: 1.1, fontFace: "Calibri", fontSize: 16, valign: "middle" });

  // ============ SLIDE 3: MAITI MOVEMENT CONFIRMED REPEAT ============
  let s3 = pres.addSlide();
  s3.background = { color: IVORY };

  s3.addText("CONFIRMED REPEAT: Maiti Movement", {
    x: 0.7, y: 0.4, w: 11.9, h: 0.6,
    fontFace: "Cambria", fontSize: 27, bold: true, color: NAVY
  });
  s3.addText("Same topic. 3 year gap. Different option order. Same answer.", {
    x: 0.7, y: 0.95, w: 11.9, h: 0.4,
    fontFace: "Calibri", fontSize: 14, color: MUTED
  });

  // Left card - 2021
  questionCard(s3, 0.7, 1.5, 5.75, 2.9, "UKPCS 2021", "99",
    "Who initiated the 'Maiti Movement'\nin Uttarakhand?\n\nA) Sundar Lal Bahuguna\nB) Chandi Prasad Bhatt\nC) Kalyan Singh Rawat  ✓\nD) Medha Patkar");

  // Right card - 2024
  questionCard(s3, 6.7, 1.5, 5.75, 2.9, "UKPCS 2024", "24",
    "Who started the 'Maiti Movement'\nfor plantation?\n\nA) Bhagat Singh Rawat\nB) Kalyan Singh Rawat  ✓\nC) Sundar Lal Bahuguna\nD) Mohan Singh Negi");

  // Bottom insight
  s3.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.7, y: 4.7, w: 11.75, h: 1.7, fill: { color: NAVY }, rectRadius: 0.08
  });
  s3.addText([
    { text: "Answer both times: Kalyan Singh Rawat", options: { bold: true, color: AMBER, breakLine: true } },
    { text: "\nOptions reordered. Wording changed. Core fact: identical.", options: { color: GREY, breakLine: true } },
    { text: "Pattern: Movement-Founder recall questions REPEAT across years.", options: { color: GREY } }
  ], { x: 1.0, y: 4.85, w: 11.2, h: 1.4, fontFace: "Calibri", fontSize: 15, valign: "middle" });

  // ============ SLIDE 4: WILDLIFE CLUSTER (6 questions) ============
  let s4 = pres.addSlide();
  s4.background = { color: IVORY };

  s4.addText("Wildlife Sanctuaries & National Parks", {
    x: 0.7, y: 0.35, w: 11.9, h: 0.6,
    fontFace: "Cambria", fontSize: 26, bold: true, color: NAVY
  });
  s4.addText("Every single paper. Format: Match / Arrange / Identify. Most reliable cluster.", {
    x: 0.7, y: 0.9, w: 11.9, h: 0.4,
    fontFace: "Calibri", fontSize: 13, color: MUTED
  });

  const wildCards = [
    ["2024", "86", "Match Sanctuary → Year:\nGovind WLS — 1955\nValley of Flowers — 1982\nKedarnath — 1972\nAskote — 1986"],
    ["2024", "87", "Match Sanctuary → District:\nSona Nadi — Pauri\nAskote — Pithoragarh\nGovind — Uttarkashi\nBinsar — Almora"],
    ["2021", "23", "Govind National Park\nincludes source region\nof which river?\n\nAnswer: Tons ✓"],
    ["2025", "19", "Match Wildlife Sanctuary\nwith Location:\nAskot, Binsar,\nGovind, Nandhaur"],
    ["2025", "22", "National Parks — Year:\nGovind — 1989\nRajaji — 1983\nCorbett — 1936\nGangotri — 1989"],
    ["2024", "102", "Kedarnath WLS for\nconservation of which\nanimal?\n\nAnswer: Musk Deer ✓"]
  ];
  wildCards.forEach((c, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = 0.7 + col * 4.1;
    const y = 1.5 + row * 2.8;
    questionCard(s4, x, y, 3.8, 2.5, c[0], c[1], c[2]);
  });

  // ============ SLIDE 5: GOVIND TRAP ============
  let s5 = pres.addSlide();
  s5.background = { color: NAVY };

  s5.addText("⚠️  WARNING: Most Common Student Mistake", {
    x: 0.7, y: 0.4, w: 11.9, h: 0.7,
    fontFace: "Cambria", fontSize: 25, bold: true, color: WHITE
  });

  // Left - Sanctuary
  s5.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.7, y: 1.4, w: 5.75, h: 3.1, fill: { color: STEEL, transparency: 15 }, rectRadius: 0.08
  });
  s5.addText([
    { text: "Govind Wildlife SANCTUARY", options: { fontSize: 16, bold: true, color: AMBER, breakLine: true } },
    { text: "\nPaper: 2024, Q.86", options: { fontSize: 12, color: GREY, breakLine: true } },
    { text: "\n", options: { fontSize: 8, breakLine: true } },
    { text: "Established: 1955", options: { fontSize: 30, bold: true, color: WHITE, breakLine: true } },
    { text: "\nStatus: Wildlife Sanctuary", options: { fontSize: 13, color: GREY, breakLine: true } },
    { text: "Uttarkashi District", options: { fontSize: 13, color: GREY } }
  ], { x: 1.0, y: 1.6, w: 5.2, h: 2.7, fontFace: "Calibri", valign: "top" });

  // Right - National Park
  s5.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 6.7, y: 1.4, w: 5.75, h: 3.1, fill: { color: STEEL, transparency: 15 }, rectRadius: 0.08
  });
  s5.addText([
    { text: "Govind NATIONAL PARK", options: { fontSize: 16, bold: true, color: AMBER, breakLine: true } },
    { text: "\nPaper: 2025, Q.22", options: { fontSize: 12, color: GREY, breakLine: true } },
    { text: "\n", options: { fontSize: 8, breakLine: true } },
    { text: "Established: 1989", options: { fontSize: 30, bold: true, color: WHITE, breakLine: true } },
    { text: "\nStatus: National Park (carved out)", options: { fontSize: 13, color: GREY, breakLine: true } },
    { text: "Separate legal entity", options: { fontSize: 13, color: GREY } }
  ], { x: 7.0, y: 1.6, w: 5.2, h: 2.7, fontFace: "Calibri", valign: "top" });

  // Bottom amber bar
  s5.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.7, y: 4.85, w: 11.75, h: 1.5, fill: { color: AMBER }, rectRadius: 0.08
  });
  s5.addText([
    { text: "Sanctuary ≠ National Park", options: { fontSize: 18, bold: true, color: NAVY, breakLine: true } },
    { text: "Same name. Different entity. Different year. UKPSC's favourite trap.", options: { fontSize: 15, color: NAVY } }
  ], { x: 1.0, y: 5.0, w: 11.2, h: 1.2, fontFace: "Calibri", valign: "middle", align: "center" });

  // ============ SLIDE 6: CENTRAL INSTITUTES ============
  let s6 = pres.addSlide();
  s6.background = { color: IVORY };

  s6.addText("Central Govt Institutes in Uttarakhand", {
    x: 0.7, y: 0.35, w: 11.9, h: 0.6,
    fontFace: "Cambria", fontSize: 26, bold: true, color: NAVY
  });
  s6.addText("Same 12 institutes. Every paper. Format: Which is / Which is NOT / Match with city.", {
    x: 0.7, y: 0.9, w: 11.9, h: 0.4,
    fontFace: "Calibri", fontSize: 13, color: MUTED
  });

  const instCards = [
    ["2024", "115", "HQ in Dehradun — which?\n\nASI / Survey of India /\nBSI / GSI\n\n(Answer: Survey of India)"],
    ["2021", "74", "Which is NOT in UK?\n\nCBRI / ONGC /\nHAL / BHEL\n\n(Answer: BHEL)"],
    ["2025", "111", "Incorrect match:\nASI — Dehradun\nHydrology — Roorkee\nFRI — Dehradun\nFisheries — Haldwani"]
  ];
  instCards.forEach((c, i) => {
    const x = 0.7 + i * 4.1;
    questionCard(s6, x, 1.5, 3.8, 3.0, c[0], c[1], c[2]);
  });

  // Action bar
  s6.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.7, y: 4.9, w: 11.75, h: 1.4, fill: { color: NAVY }, rectRadius: 0.08
  });
  s6.addText([
    { text: "Action: ", options: { bold: true, color: AMBER } },
    { text: "Make a list — 12 Institutes × City × Function. 15 minutes. Guaranteed 1-2 marks every paper.", options: { color: GREY } }
  ], { x: 1.0, y: 5.1, w: 11.2, h: 1.0, fontFace: "Calibri", fontSize: 15, valign: "middle" });

  // ============ SLIDE 7: TAKEAWAYS ============
  let s7 = pres.addSlide();
  s7.background = { color: NAVY };

  s7.addText("Action Items — Karna Kya Hai", {
    x: 0.7, y: 0.5, w: 11.9, h: 0.8,
    fontFace: "Cambria", fontSize: 32, bold: true, color: WHITE
  });

  const takeaways = [
    ["Wildlife Master Table", "20 Protected Areas × Name / Year / District / Species / Legal Status"],
    ["Movement-Founder List", "15-20 UK Movements × Founder × Year × Type"],
    ["Central Institutes List", "12 Institutes × City × Function"]
  ];
  takeaways.forEach((t, i) => {
    const y = 1.6 + i * 1.6;
    s7.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.7, y, w: 0.65, h: 0.65, fill: { color: AMBER }, rectRadius: 0.32
    });
    s7.addText(String(i + 1), {
      x: 0.7, y, w: 0.65, h: 0.65, align: "center", valign: "middle",
      fontFace: "Cambria", fontSize: 24, bold: true, color: NAVY
    });
    s7.addText(t[0], {
      x: 1.55, y: y - 0.05, w: 10.9, h: 0.45,
      fontFace: "Calibri", fontSize: 18, bold: true, color: WHITE
    });
    s7.addText(t[1], {
      x: 1.55, y: y + 0.45, w: 10.9, h: 0.45,
      fontFace: "Calibri", fontSize: 14, color: GREY
    });
  });

  // Summary bar
  s7.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.7, y: 6.0, w: 11.75, h: 0.8, fill: { color: STEEL }, rectRadius: 0.08
  });
  s7.addText("3 lists. 2 hours. 8-10 guaranteed marks.", {
    x: 1.0, y: 6.1, w: 11.2, h: 0.6, align: "center",
    fontFace: "Calibri", fontSize: 17, bold: true, color: AMBER
  });

  // ============ SLIDE 8: CTA / END CARD ============
  let s8 = pres.addSlide();
  s8.background = { color: NAVY };

  s8.addText("Next Video...", {
    x: 0.8, y: 1.8, w: 11.7, h: 0.5,
    fontFace: "Calibri", fontSize: 16, color: AMBER, bold: true
  });
  s8.addText("Dynasty Cluster — 12 Questions in ONE Paper", {
    x: 0.8, y: 2.4, w: 11.7, h: 1.2,
    fontFace: "Cambria", fontSize: 34, bold: true, color: WHITE
  });
  s8.addText("The densest pattern nobody warns you about.", {
    x: 0.8, y: 3.5, w: 11.7, h: 0.5,
    fontFace: "Calibri", fontSize: 17, color: GREY
  });

  // CTA Box
  s8.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 2.2, y: 4.6, w: 8.9, h: 1.4, fill: { color: AMBER }, rectRadius: 0.08
  });
  s8.addText([
    { text: "FREE PYQ Tracker → Telegram Link in Description", options: { fontSize: 17, bold: true, color: NAVY, breakLine: true } },
    { text: "\nComment 'TRACKER' — Link milega  ·  Subscribe + 🔔", options: { fontSize: 14, color: NAVY } }
  ], { x: 2.5, y: 4.75, w: 8.3, h: 1.1, fontFace: "Calibri", align: "center", valign: "middle" });

  // Channel name bottom
  s8.addText("UKPSC DECODED — Prepare Smarter, Not Longer", {
    x: 0.8, y: 6.5, w: 11.7, h: 0.5, align: "center",
    fontFace: "Calibri", fontSize: 13, color: GREY
  });

  // ============ SAVE ============
  await pres.writeFile({ fileName: "/mnt/user-data/outputs/UKPSC_Video1_Slides.pptx" });
  console.log("✓ Generated: UKPSC_Video1_Slides.pptx (8 slides)");
}

main().catch(e => { console.error(e); process.exit(1); });
