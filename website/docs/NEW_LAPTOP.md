# Moving to a new laptop

**Your website does not live on your laptop.** It runs on Vercel (website),
Supabase (database), Razorpay (payments) and Resend (email). Giving away the
old laptop does not affect the live site at all. The laptop is only where you
*make changes*.

The code is safe on GitHub. The only things that exist **only** on your
laptop are a few private files (Part A, step 2). Copy those and you lose nothing.

---

## Part A: on the OLD laptop (before you give it away)

### 1. Make sure nothing is left unsaved
Open PowerShell and run these one at a time:
```
cd C:\Users\hp\Documents\Ukpscdecoded
```
```
git status
```
- If it says **"nothing to commit, working tree clean"**, go to step 2.
- If it lists changed files, open Claude Code (`claude.cmd`) and type:
  *"Commit and push my unsaved changes and give me the pull request link."*
  Then merge the pull request on GitHub.

Also check github.com/joshibhanu2018-design/Ukpscdecoded → **Pull requests**
and merge anything still open.

### 2. Copy your private files (NOT on GitHub, on purpose)
Copy these to a **pen drive** or a **private** Google Drive folder:

| What | Where it is |
|---|---|
| Your secret keys file | `C:\Users\hp\Documents\Ukpscdecoded\website\.env.local` |
| Question workbooks | `C:\Users\hp\Documents\Ukpscdecoded\test series questions\` (whole folder) |
| Any `.xlsx` / `.csv` backups you made | usually in the project folder or Downloads |
| Book / e-book PDFs, cover images, videos you made | wherever you keep them |

Tip: in File Explorer, turn on **View → Show → Hidden items** so you can see
`.env.local`. Never email it or post it anywhere public.

### 3. Wipe the laptop (this also logs you out of everything)
Your browser is logged in to GitHub, Vercel, Supabase, Razorpay, Google Play
Console, Gmail and Claude. Anyone using the laptop could reach them. The
simplest and safest way to remove all of it:

1. **Settings → System → Recovery → Reset this PC**
2. Choose **Remove everything**, then **Local reinstall**.
3. If asked, choose **Clean the drive** (takes longer, but it's safer).

Do this only **after** step 2 is done and you've checked the copied files
open on another device.

### 4. Afterwards, from your phone or new laptop
- Google account → Security → **Your devices** → sign out the old laptop.
- github.com → Settings → **Sessions** → revoke the old laptop if listed.

---

## Part B: on the NEW laptop

### 1. Install two programs (click Next through each installer)
- **Git**: https://git-scm.com/download/win
- **Node.js (LTS version)**: https://nodejs.org

Close and reopen PowerShell after installing.

### 2. Download the project from GitHub
```
cd C:\Users\hp\Documents
```
```
git clone https://github.com/joshibhanu2018-design/Ukpscdecoded.git
```
(If your Windows user name isn't `hp`, use your own path, for example
`C:\Users\<your name>\Documents`.)

### 3. Put your private files back
- `.env.local` goes into `Documents\Ukpscdecoded\website\`
- the `test series questions` folder goes into `Documents\Ukpscdecoded\`

### 4. Install and run the website on your laptop
```
cd C:\Users\hp\Documents\Ukpscdecoded\website
```
```
npm.cmd install
```
```
npm.cmd run dev
```
Open http://localhost:3000 in Chrome. If the site shows, everything works.
Press **Ctrl+C** in PowerShell to stop it.

### 5. Install Claude Code
```
npm.cmd install -g @anthropic-ai/claude-code
```
```
cd C:\Users\hp\Documents\Ukpscdecoded
```
```
claude.cmd
```
Log in with your Claude account. When you see the `>` prompt, you are
talking to Claude (not PowerShell). Paste this as your first message:

> Read CLAUDE.md, website/docs/HANDOFF.md and website/docs/APP_PLAN.md.
> I have moved to a new laptop. Check the project runs, then tell me the
> next step for the Android app (Phase 2). Explain in plain English.

The first time Claude pushes to GitHub, a browser window asks you to sign in
to GitHub. Sign in and click **Authorize**.

### 6. Check your usual websites
Log in on the new laptop's browser: GitHub, Vercel, Supabase, Razorpay,
Google Play Console, Resend. Nothing there needs changing; it's all online.

---

## Where the Android app stands
- **Phase 1 (done):** the website is app-ready (`public/manifest.json`, app
  shortcuts, `public/.well-known/assetlinks.json` placeholder).
- **Google Play Console account: created.**
- **Phase 2 (next):** build the app at pwabuilder.com, upload it to Play
  Console, add the fingerprint to `assetlinks.json`, fill in the store
  listing, and run the 12-tester / 14-day closed test. Full steps are in
  `APP_PLAN.md`.
- **Important for Phase 2:** PWABuilder gives you a **signing key file** and
  a password. Keep both on your pen drive **and** in private Google Drive,
  never on GitHub. If you lose them you can never update the app.

## If something goes wrong
- `npm.cmd` "not recognized": Node.js isn't installed. Reinstall it, then
  reopen PowerShell.
- `git` "not recognized": Git isn't installed. Reinstall it, then reopen
  PowerShell.
- The site runs but login or payments fail on your laptop: `.env.local` is
  missing or in the wrong folder. It must be inside the `website` folder.
- The live site (www.ukpscdecoded.in) is never affected by any of this.
