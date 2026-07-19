// ════════════════════════════════════════════════════════════════
// UKPSC DECODED — RO/ARO Prelims 2026 Post-Exam Poll System
// Posts 3 polls + 1 message at 12:00 PM on exam day (July 19, 2026)
// Channel: @UKPSCDECODED
// ════════════════════════════════════════════════════════════════
// 
// HOW TO USE:
// 1. Paste this in your existing Google Apps Script (same spreadsheet)
// 2. Replace BOT_TOKEN with your actual token
// 3. Run "createExamDayTrigger()" → Auto-fires at 12:00 PM IST
// OR
// 4. Run "postAllExamPolls()" manually at 12:00 PM if you prefer
// ════════════════════════════════════════════════════════════════

// ═══ CONFIGURE (Same as your daily bot) ═══
const POLL_BOT_TOKEN = 'YOUR_BOT_TOKEN_HERE'; // Same bot token
const POLL_CHANNEL_ID = '@UKPSCDECODED';

// ════════════════════════════════════════════════════════════════
// MASTER FUNCTION — Posts everything in sequence
// ════════════════════════════════════════════════════════════════
function postAllExamPolls() {
  
  // Step 1: Intro message
  const introMsg = `🚨 *RO/ARO PRELIMS 2026 — EXAM KHATAM!*
━━━━━━━━━━━━━━━━━━━━━━━━

📝 Exam abhi khatam hua hai — aur hum sabse pehle jaanna chahte hain TUMHARA experience!

👇 Neeche 3 quick polls hain — VOTE karo (takes 10 seconds):

1️⃣ Paper ka overall level
2️⃣ Kitne questions attempt kiye
3️⃣ Sabse tough section kaunsa laga

📊 Results se hum EXPECTED CUT-OFF predict karenge!
🎬 Video analysis 2 ghante mein aa raha hai!

━━━━━━━━━━━━━━━━━━━━━━━━
_@UKPSCDECODED — Sabse fast analysis_`;

  sendMessage(introMsg);
  Utilities.sleep(2000); // 2 sec gap between posts

  // Step 2: Poll 1 — Overall Difficulty
  sendPoll(
    '📊 RO/ARO Prelims 2026 — Paper ka OVERALL level kaisa laga?',
    [
      'Easy — Bohot direct tha',
      'Moderate — Mix of easy + tough',
      'Tough — Time crunch + confusing options',
      'Very Tough — Bahut mushkil, panic hua'
    ],
    false // anonymous = false (so we can see who voted)
  );
  Utilities.sleep(2000);

  // Step 3: Poll 2 — Total Attempts
  sendPoll(
    '✅ Tumne TOTAL kitne questions ATTEMPT kiye? (Dono sections milake — out of 150)',
    [
      'Less than 90 attempts',
      '90-100 attempts',
      '100-110 attempts', 
      '110-120 attempts',
      '120-130 attempts',
      '130-140 attempts',
      '140+ attempts (almost all)'
    ],
    false
  );
  Utilities.sleep(2000);

  // Step 4: Poll 3 — Toughest Section
  sendPoll(
    '🔥 Sabse TOUGH section kaunsa laga? (Jo section mein sabse zyada time waste hua / galat hue)',
    [
      'History — Statement-based / confusing',
      'Polity — Applied / tricky',
      'Uttarakhand GK — Factual overload',
      'Current Affairs — Unfamiliar topics',
      'Maths — Lengthy calculations',
      'Reasoning — Complex patterns',
      'Geography / Science — Unexpected'
    ],
    false
  );
  Utilities.sleep(2000);

  // Step 5: Closing CTA message
  const ctaMsg = `━━━━━━━━━━━━━━━━━━━━━━━━

✅ *Vote kiya? GREAT!*

📺 *2 ghante mein VIDEO aa raha hai:*
— Complete Paper Analysis
— Section-wise Difficulty
— Expected Cut-Off (Category-wise)
— Good Attempts kitne chahiye

🔔 YouTube subscribe karo: youtube.com/@ukpscdecoded
👆 Bell icon ON — notification miss mat karo!

━━━━━━━━━━━━━━━━━━━━━━━━

💬 *Apna expected score comment karo neeche* 👇
Hum batayenge ki tumhara score SAFE hai ya nahi!

_@UKPSCDECODED_`;

  sendMessage(ctaMsg);
  
  Logger.log('✅ All exam polls posted successfully!');
}

// ════════════════════════════════════════════════════════════════
// SEND NATIVE TELEGRAM POLL
// ════════════════════════════════════════════════════════════════
function sendPoll(question, options, isAnonymous) {
  const url = `https://api.telegram.org/bot${POLL_BOT_TOKEN}/sendPoll`;
  const payload = {
    chat_id: POLL_CHANNEL_ID,
    question: question,
    options: JSON.stringify(options),
    is_anonymous: isAnonymous === undefined ? false : isAnonymous,
    allows_multiple_answers: false
  };

  const httpOptions = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, httpOptions);
  const result = JSON.parse(response.getContentText());

  if (!result.ok) {
    Logger.log('Poll Error: ' + JSON.stringify(result));
  } else {
    Logger.log('Poll posted: ' + question.substring(0, 50) + '...');
  }
  return result;
}

// ════════════════════════════════════════════════════════════════
// SEND TEXT MESSAGE
// ════════════════════════════════════════════════════════════════
function sendMessage(text) {
  const url = `https://api.telegram.org/bot${POLL_BOT_TOKEN}/sendMessage`;
  const payload = {
    chat_id: POLL_CHANNEL_ID,
    text: text,
    parse_mode: 'Markdown',
    disable_web_page_preview: true
  };

  const httpOptions = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, httpOptions);
  const result = JSON.parse(response.getContentText());

  if (!result.ok) {
    Logger.log('Message Error: ' + JSON.stringify(result));
  }
  return result;
}

// ════════════════════════════════════════════════════════════════
// TRIGGER — Auto-post at 12:00 PM IST on July 19, 2026
// ════════════════════════════════════════════════════════════════
function createExamDayTrigger() {
  // Remove any existing exam poll triggers
  ScriptApp.getProjectTriggers().forEach(t => {
    if (t.getHandlerFunction() === 'postAllExamPolls') {
      ScriptApp.deleteTrigger(t);
    }
  });

  // Schedule for 12:00 PM IST (noon) — exam ends at this time
  // Note: Google Apps Script time triggers are approximate (±15 min)
  // For EXACT 12:00 PM, use manual run instead
  ScriptApp.newTrigger('postAllExamPolls')
    .timeBased()
    .atHour(12)
    .onlyOnce()  // Fire once, not daily
    .inTimezone('Asia/Kolkata')
    .create();

  Logger.log('✅ Exam day trigger created: ~12:00 PM IST, July 19, 2026');
  Logger.log('⚠️ Note: Google triggers can fire ±15 min. For exact timing, run postAllExamPolls() manually.');
}

// ════════════════════════════════════════════════════════════════
// TEST — Posts a single test poll (won't spam your channel)
// Use TEST_CHANNEL_ID to test without posting to main channel
// ════════════════════════════════════════════════════════════════
function testSinglePoll() {
  // Change this to your personal chat ID for testing
  // Or leave as channel to test directly
  sendPoll(
    '🧪 TEST POLL — Delete this! Paper level?',
    ['Easy', 'Moderate', 'Tough', 'Very Tough'],
    true
  );
  Logger.log('Test poll sent. Check channel and DELETE it if it went to main channel.');
}

// ════════════════════════════════════════════════════════════════
// BONUS: Post a "Paper PDF Available" message after you get it
// Run this manually when you have the paper
// ════════════════════════════════════════════════════════════════
function postPaperAvailableMessage() {
  const msg = `📄 *RO/ARO Prelims 2026 — Question Paper Available!*
━━━━━━━━━━━━━━━━━━━━━━━━

✅ Paper mil gaya hai! Ab hum kya karenge:

1️⃣ *Paper Analysis Video* — 1-2 ghante mein YouTube par 🎬
2️⃣ *Answer Key Challenge* — Kal tak complete answer key with explanations
3️⃣ *Cut-Off Prediction* — Based on YOUR poll data + paper difficulty

━━━━━━━━━━━━━━━━━━━━━━━━

🔔 YouTube: youtube.com/@ukpscdecoded
👆 Subscribe + Bell ON — Miss mat karo!

_@UKPSCDECODED — Fastest RO/ARO Analysis_`;

  sendMessage(msg);
  Logger.log('Paper available message posted.');
}
