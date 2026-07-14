// ════════════════════════════════════════════════════════════════
// UKPSC DECODED — Daily Telegram PYQ Practice (v2)
// Posts 5 questions from ONE subject daily to @UKPSCDECODED
// Format: Clean, no Q numbers, branded header
// ════════════════════════════════════════════════════════════════

// ═══ CONFIGURE THESE ═══
const BOT_TOKEN = 'YOUR_BOT_TOKEN_HERE'; // Paste your bot token
const CHANNEL_ID = '@UKPSCDECODED';
const SHEET_NAME = 'Sheet1';
const QUESTIONS_PER_DAY = 5;

// ═══ MAIN FUNCTION — Runs daily at 8 AM ═══
function postDailyQuestions() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  const postedCol = headers.indexOf('Posted');
  
  // Get all unposted questions
  let unposted = [];
  for (let i = 1; i < data.length; i++) {
    if (data[i][postedCol] !== 'YES' && data[i][3] !== '') {
      unposted.push({ row: i + 1, data: data[i] });
    }
  }
  
  // If all posted, reset
  if (unposted.length === 0) {
    for (let i = 2; i <= data.length; i++) {
      sheet.getRange(i, postedCol + 1).setValue('');
    }
    const newData = sheet.getDataRange().getValues();
    for (let i = 1; i < newData.length; i++) {
      if (newData[i][3] !== '') {
        unposted.push({ row: i + 1, data: newData[i] });
      }
    }
  }
  
  // Pick a random SUBJECT that has at least 5 unposted questions
  const subjectCount = {};
  unposted.forEach(q => {
    const subj = q.data[1];
    subjectCount[subj] = (subjectCount[subj] || 0) + 1;
  });
  
  // Get subjects with enough questions
  let availableSubjects = Object.keys(subjectCount).filter(s => subjectCount[s] >= QUESTIONS_PER_DAY);
  
  // If no subject has 5, pick any subject with most questions
  if (availableSubjects.length === 0) {
    availableSubjects = Object.keys(subjectCount).sort((a, b) => subjectCount[b] - subjectCount[a]);
  }
  
  // Pick random subject from available
  const todaySubject = availableSubjects[Math.floor(Math.random() * availableSubjects.length)];
  
  // Get questions from this subject
  const subjectQs = unposted.filter(q => q.data[1] === todaySubject);
  
  // Pick 5 random from this subject (or fewer if not enough)
  const count = Math.min(QUESTIONS_PER_DAY, subjectQs.length);
  const selected = [];
  const pool = [...subjectQs];
  
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    selected.push(pool.splice(idx, 1)[0]);
  }
  
  // Build the message
  const today = new Date().toLocaleDateString('en-IN', { 
    timeZone: 'Asia/Kolkata', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
  
  let message = `📚 *UKPSC Daily PYQ Practice*\n`;
  message += `📅 ${today}\n`;
  message += `📌 *${todaySubject}*\n`;
  message += `━━━━━━━━━━━━━━━━━━\n\n`;
  
  selected.forEach((q, i) => {
    const topic = q.data[2];
    const question = q.data[3];
    const optA = q.data[4];
    const optB = q.data[5];
    const optC = q.data[6];
    const optD = q.data[7];
    const answer = q.data[8];
    
    message += `*${i + 1}. ${question}*\n`;
    message += `   A) ${optA}\n`;
    message += `   B) ${optB}\n`;
    message += `   C) ${optC}\n`;
    message += `   D) ${optD}\n`;
    message += `   ✅ ||${answer}||\n\n`;
  });
  
  message += `━━━━━━━━━━━━━━━━━━\n`;
  message += `_Roz subah 8 baje — nayi practice._\n`;
  message += `_@UKPSCDECODED_`;
  
  // Send to Telegram
  sendTelegramMessage(message);
  
  // Mark all selected as posted
  selected.forEach(q => {
    sheet.getRange(q.row, postedCol + 1).setValue('YES');
    sheet.getRange(q.row, postedCol + 2).setValue(new Date().toLocaleString('en-IN', {timeZone: 'Asia/Kolkata'}));
  });
  
  Logger.log('Posted ' + count + ' questions from subject: ' + todaySubject);
}

// ═══ SEND MESSAGE TO TELEGRAM ═══
function sendTelegramMessage(text) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  const payload = {
    chat_id: CHANNEL_ID,
    text: text,
    parse_mode: 'Markdown'
  };
  
  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  
  const response = UrlFetchApp.fetch(url, options);
  const result = JSON.parse(response.getContentText());
  
  if (!result.ok) {
    Logger.log('Telegram Error: ' + JSON.stringify(result));
  }
  
  return result;
}

// ═══ TEST — Run this to verify (posts immediately) ═══
function testPost() {
  postDailyQuestions();
}

// ═══ SET DAILY TRIGGER — Run ONCE ═══
function createDailyTrigger() {
  // Delete old triggers
  ScriptApp.getProjectTriggers().forEach(t => ScriptApp.deleteTrigger(t));
  
  // New trigger: 8 AM IST daily
  ScriptApp.newTrigger('postDailyQuestions')
    .timeBased()
    .atHour(8)
    .everyDays(1)
    .inTimezone('Asia/Kolkata')
    .create();
  
  Logger.log('✅ Daily trigger set: 8 AM IST — posts 5 questions from one subject');
}
