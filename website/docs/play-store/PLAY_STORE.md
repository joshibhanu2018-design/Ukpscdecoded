# Android app — Phase 2 guide (PWABuilder → Play Store)

Files in this folder:
- `app-icon-512.png` — Play Store app icon (512 × 512).
- `feature-graphic-1024x500.png` — Play Store feature graphic.

Before starting, the website changes from this branch (new icons, the
`/delete-account` page) must be merged and live, because PWABuilder reads the
live site.

## Step 1 — Build the app on pwabuilder.com (about 10 minutes)
1. Open https://www.pwabuilder.com in Chrome.
2. Type `https://www.ukpscdecoded.in` and click **Start**.
3. Wait for the report card. Warnings are fine; red errors are not — send
   Claude a screenshot if any appear.
4. Click **Package For Stores** → **Android** → **Generate Package**.
5. Click **All Settings** and fill in:
   - Package ID: `in.ukpscdecoded.app`
   - App name: `UKPSC Decoded`
   - Short name: `UKPSC Decoded`
   - App version: `1.0.0`, App version code: `1`
   - Host: `www.ukpscdecoded.in`, Start URL: `/app?source=app`
   - Display mode: Standalone
   - Google Play billing: **off** (see "Payments" below)
   - Signing key: **Create new**. Fill in your name, "UKPSC Decoded",
     country IN. PWABuilder makes the passwords.
6. Click **Download**. You get a `.zip` file.

## Step 2 — Keep the signing key safe (very important)
The zip contains:
- `app-release-bundle.aab` — upload this to Play Console.
- `app-release-signed.apk` — you can install this on your own phone to test.
- `signing.keystore` and `signing-key-info.txt` — the key and its passwords.
- `assetlinks.json` — contains the key's fingerprint.

Copy the whole zip to **two** safe places (for example Google Drive and a pen
drive). **Never** put it in the `Ukpscdecoded` folder or on GitHub. If this
key is lost, the app can never be updated.

## Step 3 — Upload to Play Console
1. https://play.google.com/console → **Create app**: name `UKPSC Decoded`,
   language English (India), App, Free. Tick the declarations.
2. Left menu → **Test and release → Testing → Internal testing** →
   **Create new release**. Accept Play App Signing when asked.
3. Upload `app-release-bundle.aab`. Release name `1.0.0`. **Save** →
   **Review release** → **Start rollout**.
4. Left menu → **Test and release → Setup → App signing** (older menus:
   Setup → App integrity). Copy the **SHA-256 certificate fingerprint** under
   "App signing key certificate".
5. Send Claude two things: that fingerprint, and the contents of
   `assetlinks.json` from the zip (fingerprints are not secret). Claude puts
   both into `public/.well-known/assetlinks.json`; after it is merged, the app
   opens without a browser address bar.

## Step 4 — Store listing (Grow users → Store presence → Main store listing)
Copy the text below. Graphics: the two PNG files in this folder, plus at
least 2 phone screenshots (take them on your phone inside the installed app:
home page, a test, the results page).

### English
**App name:** UKPSC Decoded

**Short description (max 80 characters):**
UKPSC & UKSSSC test series, crash course, mentorship and Uttarakhand GK.

**Full description:**
UKPSC Decoded helps you prepare for Uttarakhand state exams — UKPSC PCS,
Lower PCS, RO/ARO, UKSSSC and more — with the right method, so your hard work
goes in the right direction.

What you get:
• Test series: full-length mock tests in the real exam pattern, in Hindi and
  English, with detailed solutions and subject-wise analysis.
• Free Sample Mock: take a full test free and see your weak subjects.
• Crash course: video lectures, live sessions and PDF notes, including a
  complete Uttarakhand GK course.
• 1-on-1 mentorship: weekly guidance based on your test performance.
• Free resources: PYQ tracker, 60-day study plans and daily current affairs.
• Books: the UKPSC Decoded print book and e-books.
• XP and streaks to keep you consistent.

Log in with your email and a one-time code — no password needed. Your
purchases and progress are the same on the app and on www.ukpscdecoded.in.

No shortcuts and no guaranteed results — just the right direction.

### Hindi (हिंदी)
**Short description:**
UKPSC व UKSSSC टेस्ट सीरीज़, क्रैश कोर्स, मेंटरशिप और उत्तराखंड GK।

**Full description:**
UKPSC Decoded उत्तराखंड की राज्य परीक्षाओं — UKPSC PCS, Lower PCS, RO/ARO,
UKSSSC आदि — की तैयारी सही तरीके से कराता है, ताकि आपकी मेहनत सही दिशा में
लगे।

आपको क्या मिलेगा:
• टेस्ट सीरीज़: असली परीक्षा पैटर्न पर फुल-लेंथ मॉक टेस्ट, हिंदी और अंग्रेज़ी में,
  विस्तृत समाधान और विषयवार विश्लेषण के साथ।
• फ्री सैंपल मॉक: एक पूरा टेस्ट मुफ़्त दें और अपने कमज़ोर विषय जानें।
• क्रैश कोर्स: वीडियो लेक्चर, लाइव सेशन और PDF नोट्स, पूरे उत्तराखंड GK कोर्स
  सहित।
• 1-on-1 मेंटरशिप: आपके टेस्ट प्रदर्शन के आधार पर साप्ताहिक मार्गदर्शन।
• मुफ़्त संसाधन: PYQ ट्रैकर, 60-दिन की स्टडी प्लान और रोज़ का करंट अफेयर्स।
• किताबें: UKPSC Decoded प्रिंट बुक और ई-बुक।
• नियमित रहने के लिए XP और स्ट्रीक।

ईमेल और वन-टाइम कोड से लॉग इन करें — पासवर्ड की ज़रूरत नहीं। आपकी खरीदारी और
प्रगति ऐप और www.ukpscdecoded.in दोनों पर एक जैसी रहती है।

कोई शॉर्टकट नहीं, कोई गारंटीड रिज़ल्ट नहीं — बस सही दिशा।

## Step 5 — App content forms (Policy → App content)
- **Privacy policy:** `https://www.ukpscdecoded.in/privacy`
- **Account deletion URL:** `https://www.ukpscdecoded.in/delete-account`
- **Ads:** No ads.
- **App access:** "All or some functionality is restricted" → give a
  reviewer test login. Logins use an email code, so create a test account
  email you can read and explain in the instructions, or ask Claude to add a
  reviewer login.
- **Target audience:** 18 and over.
- **Content rating:** category "Education / Reference"; answer No to violence,
  sexual content, gambling etc.
- **Category:** Education. Contact email: ukpscdecoded@gmail.com.
- **Data safety** (all data encrypted in transit: Yes; users can request
  deletion: Yes; data sold/shared for ads: No):
  - Personal info → Name, Email address, Phone number: collected, used for
    Account management and App functionality.
  - Financial info → Purchase history: collected, App functionality.
  - App activity → Other user-generated content (test answers, notes), App
    interactions: collected, App functionality and Analytics.
  - Device or other IDs: collected (2-device login limit), Fraud prevention /
    security.

## Payments — decide before sending the app for review
Google Play normally requires Play Billing for digital content (tests,
courses, e-books) bought inside an app. Options are in `APP_PLAN.md`
(A: India alternative / user-choice billing with Razorpay; B: Play Billing;
C: buy on the website only). The rules change often: check Play Console →
Policy → "Payments" for India on the day you submit, and tell Claude which
option you pick. The print book (a physical product) can always use Razorpay.

## Step 6 — Closed test, then production
A personal developer account needs a **closed test with at least 12 testers
for 14 days** before production. Create a Closed testing track, add the
testers' Gmail addresses (Telegram students), share the opt-in link, and ask
them to keep the app installed and open it a few times. After 14 days, apply
for production access in Play Console.
