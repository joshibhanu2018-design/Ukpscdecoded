# HOW TO ADD MORE QUESTIONS TO YOUR BOT
## Screenshot → Claude → Google Sheet → Auto-posts

---

## STEP 1: Take Screenshots of Questions

From any source:
- Your PYQ book (scan pages)
- Other Telegram channels (screenshot the questions)
- Any study material with MCQs

Take 10-20 screenshots at a time.

---

## STEP 2: Upload to Claude with this EXACT PROMPT

Copy-paste this prompt into Claude along with your screenshots:

```
I'm uploading screenshots of UKPSC exam questions. Extract each MCQ into this EXACT CSV format. Give me ONLY the data rows — no headers, no explanation, no extra text.

FORMAT (comma-separated):
QNo,Subject,Topic,Question,OptA,OptB,OptC,OptD,Answer,Posted

RULES:
- QNo: Start from [NEXT NUMBER] (tell Claude what number to start from)
- Subject: Use ONE of these exactly: UK History, UK Geography, UK Culture, UK Economy, UK Governance, UK Movements, Indian History, Indian Polity, Indian Geography, Indian Economy, Science, Environment, Current Affairs
- Topic: Be specific (e.g., "Katyuri Dynasty", "Glaciers", "Tribes", "Census Data")
- Question: Write in Hinglish (Hindi words in Roman script)
- OptA/B/C/D: Just the option text, NO A)/B)/C)/D) prefix
- Answer: Include letter + text like "B) Bhagirathi"
- Posted: Leave EMPTY (just a comma at the end)

IMPORTANT:
- One question per row
- No blank lines between rows
- No quotes around fields unless the field itself contains a comma
- If image is unclear, skip that question

START FROM QNo: 101
```

**Change "101" to whatever your next number should be** (check your Sheet's last QNo and add 1).

---

## STEP 3: Copy Claude's Output

Claude will give you rows like:
```
101,UK Geography,Rivers,Devprayag mein kaun si nadiyaan milti hain?,Alaknanda + Mandakini,Bhagirathi + Alaknanda,Bhagirathi + Mandakini,Alaknanda + Pindar,B) Bhagirathi + Alaknanda,
102,UK History,Movements,Doodhatoli Andolan kisse sambandhit hai?,Anti-Dam,Vriksha Ropan,Anti-Alcohol,Chipko,B) Vriksha Ropan,
103,UK Culture,Tribes,Polyandry kis janjati mein hai?,Bhotiya,Tharu,Jaunsari,Buksa,C) Jaunsari,
```

---

## STEP 4: Paste into Google Sheet

### Method A: Direct Paste (Easiest)

1. Open your "UKPSC Daily Questions" Google Sheet
2. Click on cell **A** of the first empty row (after your existing data)
3. Paste Claude's output
4. Google Sheets MIGHT auto-split into columns (if separated by commas)
5. If it pastes into ONE column → do Step 4B

### Method B: If paste goes into one column

1. Select the column with pasted data
2. **Data** → **Split text to columns**
3. Separator: **Comma**
4. Done — it splits into proper columns

### Method C: Import as CSV (Most reliable)

1. Copy Claude's output into a plain text file (Notes app or anywhere)
2. Save as `.csv` file (or just copy the text)
3. In Google Sheets → **File** → **Import** → **Upload**
4. Paste data or upload file
5. Import location: **"Append to current sheet"** ← IMPORTANT (not replace!)
6. Separator: **Comma**
7. Click Import
8. Done — new questions added at bottom

---

## STEP 5: Verify

After pasting, check:
- Column A (QNo) has numbers
- Column B (Subject) matches one of the allowed subjects
- Column D (Question) has actual question text
- Column I (Answer) has "B) something" format
- Column J (Posted) is EMPTY for new rows

---

## COLUMN MAP (Must be this EXACT order):

| Column | A | B | C | D | E | F | G | H | I | J |
|--------|---|---|---|---|---|---|---|---|---|---|
| Header | QNo | Subject | Topic | Question | OptA | OptB | OptC | OptD | Answer | Posted |
| Example | 101 | UK Geography | Rivers | Devprayag mein kya milta hai? | Option 1 | Option 2 | Option 3 | Option 4 | B) Option 2 | |

**If columns are in wrong order → bot will post garbage. Always verify after paste.**

---

## HOW OFTEN TO ADD:

| Questions in Sheet | Days of content (at 5/day) |
|---|---|
| 100 | 20 days |
| 200 | 40 days |
| 500 | 100 days (3+ months) |

**Goal:** Add 50-100 questions per week via Claude screenshots. Takes ~15 min/week.

---

## SUBJECTS THE BOT WILL ROTATE:

The bot picks a RANDOM subject each day from whatever's available (unposted). So if you add questions from multiple subjects, it will naturally rotate:

- Monday: UK History (picked randomly)
- Tuesday: UK Geography
- Wednesday: Indian Polity
- Thursday: UK Culture
- ...etc

You don't control which subject posts on which day — it's random. This keeps variety.

---

## EXAMPLE WORKFLOW:

```
Sunday evening (15 min):
1. Screenshot 20 questions from your PYQ book
2. Upload to Claude with the prompt above
3. Copy output → paste into Sheet
4. Done — bot has 4 more days of content
```

That's it. 15 minutes per week = daily automated content on your channel.
