# TELEGRAM AUTO-POST SYSTEM — Complete Setup Guide
## Daily Question Bot for @UKPSCDECODED

---

## HOW IT WORKS:

```
Google Sheet (Question Bank — 200+ MCQs)
    ↓
Google Apps Script (runs daily at 8 AM IST)
    ↓
Picks 1 random UNPOSTED question
    ↓
Formats with emoji template
    ↓
Posts to @UKPSCDECODED via Bot API
    ↓
Marks question as "POSTED" in Sheet
    ↓
Tomorrow: picks ANOTHER random unposted Q
```

**Your daily effort: ZERO. It runs itself.**

---

## STEP 1: ADD BOT AS ADMIN TO YOUR CHANNEL

1. Open Telegram → Go to your channel @UKPSCDECODED
2. Tap channel name (top) → **Edit** (pencil icon)
3. **Administrators** → **Add Administrator**
4. Search for your bot: `@ukpscdecoded_bot` (whatever username you gave it)
5. Give permission: **Post Messages** ✅
6. Save

---

## STEP 2: CREATE THE QUESTION BANK SHEET

1. Open **sheets.google.com** → Create new spreadsheet
2. Name it: **"UKPSC Daily Questions"**
3. In Row 1, create these headers:

| A | B | C | D | E | F | G | H | I |
|---|---|---|---|---|---|---|---|---|
| QNo | Subject | Topic | Question | OptA | OptB | OptC | OptD | Answer | Posted |

4. From Row 2 onwards: paste the question data (I've provided 200+ questions below)

---

## STEP 3: ADD THE APPS SCRIPT (Copy-Paste)

1. In the same spreadsheet → **Extensions** → **Apps Script**
2. Delete all existing code
3. Paste this ENTIRE code:

```javascript
// ════════════════════════════════════════════════════════
// UKPSC DECODED — Daily Telegram Question Poster
// Posts 1 random question per day to @UKPSCDECODED
// ════════════════════════════════════════════════════════

// ═══ CONFIGURE THESE ═══
const BOT_TOKEN = 'YOUR_BOT_TOKEN_HERE'; // Replace after setup, then revoke old one
const CHANNEL_ID = '@UKPSCDECODED';
const SHEET_NAME = 'Sheet1'; // Default sheet name

// ═══ MAIN FUNCTION — This runs daily ═══
function postDailyQuestion() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  // Find "Posted" column index
  const postedCol = headers.indexOf('Posted');
  
  // Get all unposted questions (rows where "Posted" column is empty)
  let unposted = [];
  for (let i = 1; i < data.length; i++) {
    if (data[i][postedCol] !== 'YES' && data[i][3] !== '') { // Has question text + not posted
      unposted.push({ row: i + 1, data: data[i] });
    }
  }
  
  // If all questions posted, reset and start over
  if (unposted.length === 0) {
    for (let i = 2; i <= data.length; i++) {
      sheet.getRange(i, postedCol + 1).setValue('');
    }
    // Re-fetch
    const newData = sheet.getDataRange().getValues();
    for (let i = 1; i < newData.length; i++) {
      if (newData[i][3] !== '') {
        unposted.push({ row: i + 1, data: newData[i] });
      }
    }
  }
  
  // Pick random question
  const random = Math.floor(Math.random() * unposted.length);
  const selected = unposted[random];
  const q = selected.data;
  
  // Format: QNo, Subject, Topic, Question, OptA, OptB, OptC, OptD, Answer
  const qNo = q[0];
  const subject = q[1];
  const topic = q[2];
  const question = q[3];
  const optA = q[4];
  const optB = q[5];
  const optC = q[6];
  const optD = q[7];
  const answer = q[8];
  
  // Build message with Telegram formatting
  const message = `📚 *UKPSC Daily Practice — Q.${qNo}*
━━━━━━━━━━━━━━━━━━

📌 *Subject:* ${subject}
📎 *Topic:* ${topic}

❓ *${question}*

A) ${optA}
B) ${optB}
C) ${optC}
D) ${optD}

━━━━━━━━━━━━━━━━━━
✅ *Answer:* ||${answer}||

💡 _Explanation aur detailed analysis ke liye YouTube video dekhein._

📺 youtube.com/@ukpscdecoded
━━━━━━━━━━━━━━━━━━
_@UKPSCDECODED — Daily UKPSC Practice_`;

  // Send to Telegram
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  const payload = {
    chat_id: CHANNEL_ID,
    text: message,
    parse_mode: 'Markdown'
  };
  
  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload)
  };
  
  try {
    const response = UrlFetchApp.fetch(url, options);
    const result = JSON.parse(response.getContentText());
    
    if (result.ok) {
      // Mark as posted
      sheet.getRange(selected.row, postedCol + 1).setValue('YES');
      sheet.getRange(selected.row, postedCol + 2).setValue(new Date().toLocaleString('en-IN', {timeZone: 'Asia/Kolkata'}));
      Logger.log('Posted Q.' + qNo + ' successfully');
    } else {
      Logger.log('Telegram error: ' + JSON.stringify(result));
    }
  } catch (error) {
    Logger.log('Error: ' + error.toString());
  }
}

// ═══ TEST FUNCTION — Run this first to verify ═══
function testPost() {
  postDailyQuestion();
}

// ═══ SETUP TRIGGER — Run this ONCE to schedule daily posts ═══
function createDailyTrigger() {
  // Delete existing triggers
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(t => ScriptApp.deleteTrigger(t));
  
  // Create new daily trigger at 8 AM IST
  ScriptApp.newTrigger('postDailyQuestion')
    .timeBased()
    .atHour(8)
    .everyDays(1)
    .inTimezone('Asia/Kolkata')
    .create();
  
  Logger.log('Daily trigger created: 8 AM IST');
}
```

4. Click **Save** (💾)

---

## STEP 4: CONFIGURE + TEST

1. In the code, replace `'YOUR_BOT_TOKEN_HERE'` with your actual bot token
2. Click **Run** (▶️) → Select `testPost` from dropdown → Run
3. It will ask to Authorize → Allow
4. Check your Telegram channel — a question should appear!

---

## STEP 5: SET DAILY SCHEDULE

1. In Apps Script → Select `createDailyTrigger` from dropdown
2. Click **Run** (▶️)
3. Done — it will now post every day at 8 AM IST automatically

---

## STEP 6: REVOKE OLD BOT TOKEN (Security)

Since you shared your token in chat:
1. Open Telegram → @BotFather
2. Send: `/revoke`
3. Select your bot
4. Get NEW token
5. Update the token in your Apps Script code
6. Save + test again

---

## HOW TO ADD MORE QUESTIONS:

Just add rows to your Google Sheet. The system automatically picks from ALL unposted rows.

| QNo | Subject | Topic | Question | OptA | OptB | OptC | OptD | Answer | Posted |
|-----|---------|-------|----------|------|------|------|------|--------|--------|
| 201 | UK History | Katyuri | New question here | A | B | C | D | B | |

That's it. No code changes needed. Ever.

---

## WHAT THE POST LOOKS LIKE:

```
📚 UKPSC Daily Practice — Q.47
━━━━━━━━━━━━━━━━━━

📌 Subject: UK Geography
📎 Topic: Glaciers

❓ Gangotri glacier se kaun si nadi nikalti hai?

A) Alaknanda
B) Bhagirathi
C) Mandakini
D) Yamuna

━━━━━━━━━━━━━━━━━━
✅ Answer: B) Bhagirathi

💡 Explanation aur detailed analysis ke liye YouTube video dekhein.

📺 youtube.com/@ukpscdecoded
━━━━━━━━━━━━━━━━━━
@UKPSCDECODED — Daily UKPSC Practice
```

---

## FAQ:

| Question | Answer |
|----------|--------|
| What if all 200 questions are posted? | Script auto-resets and starts again (marks all as unposted) |
| Can I post 2 questions/day? | Run `postDailyQuestion` twice in trigger (change to every 12 hours) |
| Can I change posting time? | Edit `atHour(8)` in the trigger code to any hour (0-23) |
| What if I want to skip a day? | Just disable trigger temporarily in Apps Script → Triggers page |
| Can I edit a question? | Yes — just edit the Sheet row. Next time it's picked, new version posts |

---
