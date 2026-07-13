# UKPSC DECODED — Lead Capture Setup Guide
## Google Sheets + Apps Script (FREE, UNLIMITED leads)

---

## STEP 1: Create the Google Sheet

1. Go to **sheets.google.com** → Click **+ Blank** (new spreadsheet)
2. Name it: **"UKPSC Decoded Leads"**
3. In **Row 1**, type these column headers:

| A1 | B1 | C1 | D1 |
|----|----|----|-----|
| Timestamp | Name | Email | Source |

4. **That's it** — leave the rest empty. Leads will auto-fill below.

---

## STEP 2: Add the Apps Script (Copy-Paste)

1. In the same spreadsheet → Click **Extensions** → **Apps Script**
2. **Delete all existing code** in the editor
3. **Copy-paste this ENTIRE code:**

```javascript
// ═══════════════════════════════════════════════════════════════
// UKPSC DECODED — Lead Capture Script
// Receives form data from landing page → saves to this Sheet
// FREE, UNLIMITED submissions
// ═══════════════════════════════════════════════════════════════

function doPost(e) {
  try {
    // Get the active spreadsheet and sheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse incoming JSON data
    var data = JSON.parse(e.postData.contents);
    
    // Append new row with: Timestamp, Name, Email, Source
    sheet.appendRow([
      new Date().toLocaleString('en-IN', {timeZone: 'Asia/Kolkata'}),
      data.name || '',
      data.email || '',
      data.source || 'landing-page'
    ]);
    
    // ═══ OPTIONAL: Email notification for each new lead ═══
    // Uncomment the next 3 lines if you want email alerts:
    // var subject = "🎯 New UKPSC Lead: " + data.name;
    // var body = "Name: " + data.name + "\nEmail: " + data.email + "\nTime: " + new Date().toLocaleString('en-IN', {timeZone: 'Asia/Kolkata'});
    // MailApp.sendEmail("YOUR_EMAIL@gmail.com", subject, body);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({result: "success", message: "Lead saved"}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error (won't break the user experience)
    return ContentService
      .createTextOutput(JSON.stringify({result: "error", message: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ═══ Test function (run this once to verify it works) ═══
function testDoPost() {
  var testData = {
    postData: {
      contents: JSON.stringify({
        name: "Test User",
        email: "test@example.com",
        source: "test"
      })
    }
  };
  var result = doPost(testData);
  Logger.log(result.getContent());
}
```

4. Click **Save** (💾 icon) — name the project "Lead Capture"

---

## STEP 3: Deploy as Web App

1. Click **Deploy** → **New deployment**
2. Click the ⚙️ gear icon next to "Select type" → Choose **Web app**
3. Fill in:
   - Description: `Lead capture for UKPSC Decoded`
   - Execute as: **Me (your email)**
   - Who has access: **Anyone**
4. Click **Deploy**
5. Click **Authorize access** → Choose your Google account → Click "Allow"
   - (If it says "This app isn't verified" → Click "Advanced" → "Go to Lead Capture (unsafe)" → Allow)
6. **COPY THE WEB APP URL** — it looks like:
   ```
   https://script.google.com/macros/s/AKfycbx.......LONG_ID....../exec
   ```
7. **Save this URL** — you need it for the next step

---

## STEP 4: Update Your Landing Page

1. Go to **github.com/joshibhanu2018-design/Ukpscdecoded**
2. Click on **`index.html`**
3. Click the **pencil ✏️** icon (Edit)
4. Find this line (use browser search: Ctrl+F or Cmd+F):
   ```
   const FORM_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';
   ```
5. **Replace the entire URL** with your Google Apps Script URL:
   ```
   const FORM_ENDPOINT = 'https://script.google.com/macros/s/YOUR_ACTUAL_SCRIPT_ID/exec';
   ```
6. Scroll down → Click **"Commit changes"**
7. Done!

---

## STEP 5: Test Everything

1. Open your landing page (GitHub Pages link)
2. Enter a test name + email → Click "Unlock Free Access"
3. Check:
   - ✅ You get redirected to WhatsApp Channel
   - ✅ Open your Google Sheet — the test entry appears there

---

## OPTIONAL: Get Email Alerts

If you want an email every time someone signs up:

1. Go back to **Extensions → Apps Script**
2. Find these 3 lines (they have `//` in front):
   ```
   // var subject = "🎯 New UKPSC Lead: " + data.name;
   // var body = "Name: " + data.name + "\nEmail: " + data.email + ...
   // MailApp.sendEmail("YOUR_EMAIL@gmail.com", subject, body);
   ```
3. Remove the `//` from all 3 lines
4. Replace `YOUR_EMAIL@gmail.com` with your actual Gmail
5. Click **Deploy** → **Manage deployments** → **Edit (pencil)** → Version: **New version** → **Deploy**
6. Now you'll get an email alert for every new lead!

---

## OPTIONAL: Auto-send Welcome Email to Lead

Want to automatically email the person who signed up? Add this line after `sheet.appendRow(...)`:

```javascript
MailApp.sendEmail(data.email, 
  "Welcome to UKPSC Decoded! 🎯", 
  "Hi " + data.name + ",\n\nWelcome! Here are your next steps:\n\n1. Join our WhatsApp Channel: https://whatsapp.com/channel/0029VbD7B0aHQbRvTSXjOt2B\n2. Join Telegram for PYQ Tracker: https://t.me/UKPSCDECODED\n3. Subscribe on YouTube: https://youtube.com/@ukpscdecoded\n\nLet's crack UKPSC together!\n\n— UKPSC Decoded Team"
);
```

⚠️ Gmail daily limit: 100 emails/day on free account. Enough for now.

---

## SUMMARY

| What | Status |
|------|--------|
| Cost | FREE forever |
| Lead limit | UNLIMITED |
| Where data goes | Your Google Sheet (you own it) |
| Email alerts | Optional (enable anytime) |
| Works with your landing page | YES (just paste the URL) |
| Time to set up | 5-10 minutes |

---

## TROUBLESHOOTING

| Problem | Fix |
|---------|-----|
| "This app isn't verified" warning | Click Advanced → Go to app (unsafe) → Allow |
| Data not appearing in sheet | Check you deployed as "Anyone" access |
| CORS error in browser console | This is normal — the redirect still works fine |
| Want to redeploy after changes | Deploy → Manage deployments → Edit → New version → Deploy |

---

*Your lead capture is now FREE, unlimited, and goes straight to a Google Sheet you control.*
