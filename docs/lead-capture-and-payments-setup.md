# Lead Capture & Payments — Setup Guide

## 1. Lead Capture (Google Apps Script)

Your leads sheet: `https://docs.google.com/spreadsheets/d/1eZPttwL8qA8KbGnjPlYRgfL8jL34ZNUT76IZ_wER8Cc`

All forms — landing page, main site (contact, popup, courses) — POST to one endpoint. Each row records Source + Page + Site for segregation.

### Deployed URL (already live):
```
https://script.google.com/macros/s/AKfycbyTIOwMIO6iNvJ9gCS8pRO15g5SvnwwW8gt7DdiXSZn939IzJV6WTniu1lETIk-7ufq/exec
```

### `Code.gs` (update to this exact version):

```javascript
var SHEET_ID = '1eZPttwL8qA8KbGnjPlYRgfL8jL34ZNUT76IZ_wER8Cc';
var TAB_NAME = 'Leads';
var HEADERS = ['Timestamp','Source','Page','Site','Name','Email','WhatsApp/Phone','Exam','Course','Message','URL'];

function doPost(e) {
  try {
    var data = (e && e.postData && e.postData.contents) ? JSON.parse(e.postData.contents) : {};
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName(TAB_NAME) || ss.insertSheet(TAB_NAME);
    if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
    sheet.appendRow([
      data.submittedAt || data.timestamp || new Date().toISOString(),
      data.source || '', data.page || '', data.site || '',
      data.name || '', data.email || '', data.phone || '',
      data.exam || '', data.course || '', data.message || '', data.url || ''
    ]);
    return ContentService.createTextOutput(JSON.stringify({ok:true})).setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ok:false,error:String(err)})).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() { return ContentService.createTextOutput('WORKING - UKPSC Decoded Lead Capture Active'); }
```

### To update your deployed script (keeps same URL):
1. Open your sheet → Extensions → Apps Script
2. Replace ALL code with the above
3. Deploy → Manage deployments → pencil icon (Edit) → Version: **New version** → Deploy

---

## 2. Instamojo Payment Links

For each course:
1. Instamojo → Payment Links → Create a Payment Link → set Title + Amount
2. Copy the link (e.g. `https://www.instamojo.com/@Ukpscdecoded/xxxxx`)
3. CMS → Courses → course → "Payment Link (Instamojo)" field → Publish

The button auto-switches from "Register Interest" to "Enroll Now".
