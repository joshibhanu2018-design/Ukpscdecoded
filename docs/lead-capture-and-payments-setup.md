# Lead Capture & Payments — Setup Guide

This guide connects two things you control from outside the codebase:

1. **Lead capture** — every form on the site (contact form, free-guide popup, course
   "Register Interest") sends the visitor's **name + email + WhatsApp number** into ONE
   Google Sheet, with a **Source** and **Page** column so you always know where the lead
   came from.
2. **Payments** — Instamojo payment links for each course.

---

## 1. Lead capture — Google Sheet backend (via Google Apps Script)

Your sheet: `https://docs.google.com/spreadsheets/d/1eZPttwL8qA8KbGnjPlYRgfL8jL34ZNUT76IZ_wER8Cc/edit`

**One sheet is enough** — it does NOT need to be split per page. Every row records a
`Source` (e.g. `course-interest`, `lead-popup-answer-writing-guide`, `about-contact-form`)
and the `Page` + `Site` the lead came from (e.g. `/courses`, `ukpscdecoded.netlify.app`),
so leads are fully segregated and filterable.

### Steps

1. Open the sheet → **Extensions → Apps Script**.
2. Delete anything in `Code.gs` and paste the script below.
3. Click **Deploy → New deployment**.
   - Type: **Web app**
   - Description: `UKPSC lead capture`
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy**, authorise access, and **copy the Web app URL**
   (looks like `https://script.google.com/macros/s/AKfy.../exec`).
5. In the website admin CMS → **Site Settings → Lead Capture Endpoint** → paste that URL →
   **Publish**. (Or send me the URL and I'll put it in `content/settings.json`.)

That's it — leads start flowing into the sheet immediately.

### `Code.gs`

```javascript
var SHEET_ID = '1eZPttwL8qA8KbGnjPlYRgfL8jL34ZNUT76IZ_wER8Cc';
var TAB_NAME = 'Leads';
var HEADERS = ['Timestamp', 'Source', 'Page', 'Site', 'Name', 'Email', 'WhatsApp/Phone', 'Course', 'Message', 'URL'];

function doPost(e) {
  try {
    var data = {};
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    }
    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName(TAB_NAME) || ss.insertSheet(TAB_NAME);
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
    }
    sheet.appendRow([
      data.submittedAt || new Date().toISOString(),
      data.source || '',
      data.page || '',
      data.site || '',
      data.name || '',
      data.email || '',
      data.phone || '',
      data.course || '',
      data.message || '',
      data.url || ''
    ]);
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService.createTextOutput('UKPSC Decoded lead endpoint is live.');
}
```

> Note: the website sends the request with `mode: "no-cors"`, so no extra CORS setup is
> needed. If you ever change the sheet, just update `SHEET_ID` and re-deploy (Deploy →
> Manage deployments → Edit → New version).

---

## 2. Instamojo payment links for courses

Your Instamojo account is created (documents under review — you can still create links).

### Steps for each course

1. Instamojo dashboard → **Payment Links** → **Create** (or **Create New → Payment Link**).
2. Fill in:
   - **Title**: e.g. `UKPSC / Upper PCS 2026 Prelims Crash Course`
   - **Amount**: e.g. `2399`
   - **Description** (optional).
3. Create it and **copy the payment link** (looks like `https://imjo.in/xxxxxx` or
   `https://www.instamojo.com/@yourhandle/xxxxxx`).
4. In the website admin CMS → **Courses** → open the course → paste the link into the
   **Payment Link (Instamojo)** field → **Publish**.

As soon as a course has a payment link, its button automatically changes from
**"Register Interest"** to **"Enroll Now"** and sends buyers to Instamojo.
Until then it keeps collecting interest into your leads sheet.

Course prices currently set: Crash Course ₹2399 · Uttarakhand GK Intensive ₹1399 ·
Test Series ₹499 · Mentorship (On Request).

### Course demo videos

Same idea: paste a YouTube demo link into each course's **Demo Video URL** field in the CMS.
Until then the card shows **"Demo video coming soon."**
