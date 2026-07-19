# POST-EXAM MASTER PROMPT — PASTE INTO CLAUDE AT 12:00 PM
## UKPSC RO/ARO Prelims 2026 — Instant Content Generation

---

## INSTRUCTIONS:
1. Exam ends at 12:00 PM on July 19, 2026
2. Quickly gather student feedback (Telegram groups, WhatsApp, Twitter/X)
3. Fill the bracketed [...] fields below with real observations
4. Copy the ENTIRE prompt below and paste into Claude
5. Claude will generate: Speaking script + Slide data + Cut-off table
6. Use output to update generate_roaro_pptx.py EXAM_DATA dict
7. Record remaining segments, stitch, upload!

---

## ⏱️ MASTER PROMPT — COPY FROM HERE ⏬

---

```
Act as an expert UKPSC exam coach, data analyst, and YouTube content creator who specializes in post-exam analysis videos. I need you to generate COMPLETE post-exam content for today's UKPSC RO/ARO Prelims 2026 exam that ended at 12:00 PM, July 19, 2026.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## REAL-TIME INPUTS FROM TODAY'S PAPER:

**Overall Paper Difficulty:** [Insert: Easy / Moderate / Tough / Surprisingly Tough]

**General Studies (100 Questions) Observations:**
- History questions: [Insert count, e.g., "15-18, mostly statement-based"]
- Polity questions: [Insert count + nature, e.g., "12, mix of direct + applied"]
- Geography questions: [Insert count, e.g., "10, map-based + physical geography"]
- Economy questions: [Insert count, e.g., "8, budget + scheme focused"]
- Science questions: [Insert count, e.g., "10, biology-heavy"]
- Current Affairs questions: [Insert count + recency, e.g., "15, last 6 months focused"]
- Uttarakhand GK questions: [Insert count + nature, e.g., "22, dynasty + district heavy"]
- Toughest GS area: [Insert, e.g., "Statement-based History — confusing options"]
- Easiest GS area: [Insert, e.g., "Uttarakhand GK — direct factual"]
- Any surprises/unusual topics: [Insert, e.g., "3 questions from Sports/Awards"]

**General Aptitude & Reasoning (50 Questions) Observations:**
- Math questions count: [Insert, e.g., "22"]
- Reasoning questions count: [Insert, e.g., "28"]
- Math difficulty: [Insert: Easy / Moderate / Lengthy / Tough]
- Reasoning difficulty: [Insert: Easy / Moderate / Tough]
- Lengthy calculations?: [Insert: Yes/No + details]
- Any DI (Data Interpretation) sets?: [Insert: Yes/No + how many]

**Student Feedback Summary (from Telegram/WhatsApp):**
- General mood: [Insert, e.g., "Mixed — GS tough but Aptitude manageable"]
- Common complaints: [Insert, e.g., "Time crunch in GS, ambiguous History options"]
- What students found easy: [Insert, e.g., "UK GK, Basic Reasoning, Current Affairs"]
- Estimated attempts by avg students: [Insert, e.g., "Most attempted 120-130"]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## CONTEXTUAL DATA (Do NOT change — these are verified):

- Exam: UKPSC RO/ARO Prelims 2026 (Samiksha Adhikari / Sahayak Samiksha Adhikari)
- Total Marks: 150 (GS: 100 Qs + Aptitude: 50 Qs)
- Negative Marking: 1/4 (0.25 marks deducted per wrong answer)
- Duration: 2 hours
- Date: July 19, 2026

**Official Previous Year Cut-Off Data (Verified):**
| Category | RO Secretariat | RO UKPSC |
|----------|---------------|----------|
| General (UR) | 98.00 | 97.00 |
| OBC | 97.75 | 96.25 |
| EWS | ~94.50 | ~94.50 |
| SC | 87.00 | 85.75 |
| ST | 88.50 | — |
| UK Women | ~85-88 | ~85-88 |

**Historical Insight:** Cut-offs hover around 60-65% for Prelims screening. If paper is tougher than previous years, cut-off drops 3-5 marks. If easier, it rises 2-4 marks.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## GENERATE THE FOLLOWING (All 4 outputs):

### OUTPUT 1: POST-EXAM SPEAKING SCRIPT (Segments 5, 6, 7)

Generate a word-for-word SPOKEN script in Hinglish (Hindi + English mix) for these 3 segments that I will record WITH slides on screen:

**Segment 5 — General Studies Review (~60 seconds):**
- Cover subject-wise breakdown with actual numbers
- Mention difficulty of each sub-section
- Highlight what was tough and what was scoring
- Include [Show Slide 3] cue at start

**Segment 6 — Aptitude & Reasoning Review (~60 seconds):**
- Math vs Reasoning split with numbers
- Whether math was lengthy or direct
- What reasoning topics appeared
- Include [Show Slide 4] cue at start

**Segment 7 — Good Attempts & Cut-Off Prediction (~90 seconds):**
- State good attempts section-wise
- State expected cut-off RANGE for each category
- Define safe score clearly
- Speak with authority and confidence
- Include [Show Slide 5] then [Show Slide 6] cues

**Script Style Requirements:**
- Conversational Hinglish (like talking to a friend after exam)
- Use "tum" not "aap"
- Short punchy sentences
- Sound confident and data-backed
- Include [PAUSE] markers for dramatic effect
- Include [EMPHASIZE] markers for key numbers

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### OUTPUT 2: EXAM_DATA DICT (For generate_roaro_pptx.py)

Generate the complete Python dictionary to replace in my PPTX script:

```python
EXAM_DATA = {
    "date": "19 July 2026",
    "overall_difficulty": "[fill]",
    "gs_difficulty": "[fill]",
    "aptitude_difficulty": "[fill]",
    "gs_history": "[fill]",
    "gs_polity": "[fill]",
    "gs_geography": "[fill]",
    "gs_economy": "[fill]",
    "gs_science": "[fill]",
    "gs_current_affairs": "[fill]",
    "gs_uttarakhand_gk": "[fill]",
    "aptitude_math": "[fill]",
    "aptitude_reasoning": "[fill]",
    "toughest_section": "[fill]",
    "easiest_section": "[fill]",
    "student_feedback": "[fill - one line summary]",
    "good_attempts_gs": "[fill range]",
    "good_attempts_aptitude": "[fill range]",
    "good_attempts_total": "[fill range]",
    "cutoff_general": "[fill range]",
    "cutoff_obc": "[fill range]",
    "cutoff_ews": "[fill range]",
    "cutoff_sc": "[fill range]",
    "cutoff_st": "[fill range]",
    "cutoff_women": "[fill range]",
    "safe_score": "[fill]",
}
```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### OUTPUT 3: EXPECTED CUT-OFF TABLE (Formatted)

Provide a clean, formatted expected cut-off prediction table:

| Category | Previous Official | Expected 2026 | Change |
|----------|-----------------|---------------|--------|
| General  | 97-98           | [predict]     | ↑/↓/→  |
| OBC      | 96-97.75        | [predict]     | ↑/↓/→  |
| EWS      | ~94.50          | [predict]     | ↑/↓/→  |
| SC       | 85.75-87        | [predict]     | ↑/↓/→  |
| ST       | 88.50           | [predict]     | ↑/↓/→  |
| UK Women | 85-88           | [predict]     | ↑/↓/→  |

Include your reasoning for the prediction (2-3 lines explaining why cut-off is going up/down/stable).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### OUTPUT 4: UPDATED PINNED COMMENT

Generate the final pinned comment with actual numbers filled in:

Format:
📊 RO/ARO Prelims 2026 — Quick Summary:
━━━━━━━━━━━━━━━━━━━━━━━━
📝 Paper Level: [fill]
✅ Good Attempts: [fill] marks
🎯 Expected General Cut-Off: [fill] marks
🔥 Safe Score: [fill] marks
━━━━━━━━━━━━━━━━━━━━━━━━
+ CTA for Telegram and engagement prompt

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## IMPORTANT NOTES:
- Be PRECISE with numbers. Don't give vague ranges — give tight predictions.
- Sound AUTHORITATIVE. This video needs to feel like an expert's take, not guesswork.
- Factor in: paper difficulty vs previous years, competition level, vacancy count.
- If paper was TOUGHER → cut-off DROPS 3-5 marks from historical.
- If paper was EASIER → cut-off RISES 2-4 marks from historical.
- If SIMILAR → cut-off stays in same range (±1-2 marks).
- Always give a RANGE (e.g., "95-100") not a single number for cut-offs.
- Safe score = Upper end of General cut-off range + 5-7 marks buffer.
```

---

## ⏫ COPY TILL HERE — END OF MASTER PROMPT

---

## QUICK WORKFLOW AFTER PASTING:

1. **Claude gives you 4 outputs** → Save them
2. **Copy OUTPUT 2** → Paste into `generate_roaro_pptx.py` replacing the EXAM_DATA dict
3. **Run:** `python3 generate_roaro_pptx.py` → New slides generated instantly
4. **Use OUTPUT 1** as your speaking script → Record Segments 5, 6, 7 with slides
5. **Use OUTPUT 4** → Ready pinned comment to post after upload
6. **Stitch all segments** → Export → Upload with metadata from VIDEO_ROARO_YOUTUBE_METADATA.md

**Total time from paste to upload: ~45-60 minutes if pre-shoot is done.**

---

## BACKUP: IF YOU GET THE ACTUAL QUESTION PAPER PDF

If someone shares the actual paper PDF before you record, add this to the prompt:

```
ADDITIONAL: I have the actual question paper. Here are specific questions I noted:
- [Paste 5-10 notable/controversial questions]
- [Note any questions with potentially two correct answers]
- [Note any factual errors in the paper if any]

Please also flag any questions that might be challenged/bonus marked.
```

---

## ANSWER KEY GENERATION PROMPT (For follow-up video)

If you get the paper and want to create an answer key, use this separate prompt:

```
I have the UKPSC RO/ARO Prelims 2026 question paper. Please provide:
1. Answer key for ALL 150 questions with brief explanations
2. Flag any controversial/debatable questions
3. Flag any questions likely to be bonus/cancelled
4. Subject-wise score calculator

Here is the paper:
[Paste questions or upload PDF]
```

---

*End of Post-Exam Master Prompt Document*
