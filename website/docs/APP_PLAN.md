# Android app plan — UKPSC Decoded

Goal: a Play Store app with the test series, video courses, print book and
e-book, and free resources (PYQ tracker, study plan).

## Approach: wrap the website (Trusted Web Activity)
Everything the app needs already exists on www.ukpscdecoded.in and works on
phones. The app is the website opened full-screen inside an Android shell
(a Trusted Web Activity, TWA), so there's **one codebase**: every website
change reaches the app without an app update. The site is already an
installable web app (`public/manifest.json`, `public/sw.js`, install prompt
in `src/components/InstallPrompt.tsx`).

Not recommended now: a separate React Native / Flutter app (months of work,
two codebases) or iOS (US$99/year, Apple often rejects web wrappers, up to
30% commission). Revisit iOS once Android works.

## Phase 1 — make the web app app-ready (code, ~1 day)
Steps 1 and 2 done 27 Sep (see HANDOFF.md); step 3 still to check.
1. `public/manifest.json`:
   - `start_url` is `/test-platform` (logged-in students only). Change it
     to `/?source=app`, or a new app home page, so first-time users see
     courses, books and free resources.
   - Add `shortcuts` (long-press on the icon): Test Series (`/test-series`),
     My Courses (`/test-platform`), Free Resources (`/free-content`), Books
     (`/buy-book`).
   - Check the icons: 192 and 512 px, plus a real **maskable** icon with
     padding (currently the same files are used for both purposes).
2. Optional **app home** (`/app`): big tiles for Test Series, Video
   Courses, Books & E-book, Free Resources (PYQ Tracker, 60-Day Plan,
   Current Affairs), Free Sample Mock; "My Courses" when logged in.
3. Check every key flow at 375 px inside Chrome's installed-app mode:
   login code, test taking (timer, submit), video lessons (YouTube embed),
   checkout (Razorpay opens correctly), e-book download link, PDFs in
   Free Content.
4. `public/.well-known/assetlinks.json`: needed so the app opens without a
   browser address bar. Its SHA-256 fingerprint comes from Play Console in
   Phase 2, so add it then.

## Phase 2 — Play Store package (~half a day + owner's account setup)
1. **Owner:** create a Google Play developer account
   (play.google.com/console), a one-time US$25 fee plus ID verification. Use
   an organisation account if possible; a personal account must run a
   closed test with **12 testers for 14 days** before going public (use
   Telegram students).
2. **Build the package** with **PWABuilder** (pwabuilder.com → enter
   `https://www.ukpscdecoded.in` → Android → download). This is the easiest
   route, with no Android Studio. Alternative: Google's Bubblewrap CLI
   (`npx.cmd @bubblewrap/cli init --manifest https://www.ukpscdecoded.in/manifest.json`).
   - Package name, e.g. `in.ukpscdecoded.app`.
   - Keep the signing key file and its password **safe and private** (never
     in git). Losing it means you can never update the app.
3. Upload the `.aab` to Play Console (internal testing first). Copy Play's
   **App signing key SHA-256** into `public/.well-known/assetlinks.json`,
   deploy, and confirm the app opens without an address bar.
4. Store listing: name, short and full description (Hindi and English),
   icon, feature graphic 1024×500, at least 2 phone screenshots, privacy
   policy URL `https://www.ukpscdecoded.in/privacy`, Data safety form (email,
   name, purchase history, test results; no ads), content rating
   questionnaire, category Education.
5. Closed test (12 testers × 14 days if personal account), then production.

## Payments policy — decide before submitting
Google Play's rules say digital content sold inside an app (test series,
video courses, e-books) should use Google Play Billing (15% fee on the first
US$1M a year). In India, Google offers "user choice billing" / alternative
billing programmes, but they change often. **Check the current Play Console
payments policy for India at submission time.** Options:
- **A.** Enrol in the alternative or user-choice billing programme and keep
  Razorpay (declare it in Play Console).
- **B.** Use Play Billing in the app only (needs code for Google's billing
  API; more work).
- **C.** Make the app a "reader" app (courses usable, purchases on the website
  only). Google restricts linking out to buy, so this is risky.
The **print book** is a physical good, so Razorpay is allowed for it in any case.

## Phase 3 — after launch
- Push notifications (new test released, class reminder): Web Push via the
  service worker works inside a TWA.
- Offline: cache the PYQ tracker / study plan for offline reading.
- Ratings prompt after a completed test.
- Track installs: `?source=app` in analytics.

## Owner checklist
- [ ] Decide on the payments option (A/B/C) after checking Play's policy.
- [ ] Play developer account + verification.
- [ ] 12 testers (Telegram) for 14 days, if a personal account.
- [ ] Screenshots, feature graphic and descriptions (Claude can draft the text).
