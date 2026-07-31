# How to update your website yourself

Everything below is done in your browser. You never need code, a laptop setup, or any
paid tool.

**Your admin panel:** https://ukpscdecoded.vercel.app/admin
**Login:** click "Login with GitHub" and approve.

**The golden rule:** make your change → click **Publish** → wait 1–2 minutes → refresh
the live site. Every Publish saves a version, so nothing can be permanently broken.

---

## 1. Weekly Current Affairs — just paste it

This is the fastest one. You do **not** fill in a field for every headline.

1. Open **🗞️ Weekly Current Affairs**
2. Under **Weeks**, click **Add Weeks**
3. Set **Publish Date** = the Sunday it goes live
4. In **⚡ Quick Publish — paste raw content here**, paste your content
5. Set **Category for pasted lines** (Uttarakhand / National / International)
6. Click **Publish**

The week label ("August 2026 — Week 1") is created automatically from the date.
Leave **Week Label**, **ID** and **Headlines** empty — they are optional.

### What you can paste

One headline per line. Bullets and numbers are removed automatically, so all of these
work:

```
- Uttarakhand declared a fully literate state
1. Cabinet clears Rs 1.11 lakh crore budget
• Kumbh Mela 2027 preparations begin
```

**To add context**, put a dash after the headline:

```
- Uttarakhand declared a fully literate state — rolled out under the ULLAS programme
```

**To add a source**, put it in brackets at the end:

```
- Cabinet clears the annual budget (Source: State Cabinet, August 2026)
```

**To mix categories in one paste**, put the category on its own line:

```
Uttarakhand
- UCC Amendment Bill sanctioned
- Char Dham Yatra disrupted by landslides

National
- RBI keeps the repo rate unchanged
```

Or write it in front of a single headline: `National: RBI keeps the repo rate unchanged`

**Things that are ignored automatically:** page numbers, web links on their own line,
blank lines, headings like "Current Affairs", and duplicate headlines. So you can paste
messily from a PDF and it still comes out clean.

**Wrapped text is joined up.** If a line starts with a small letter, it gets attached to
the headline above it — which is what happens when you copy from a PDF.

---

## 2. Course payment links (for when you launch)

Open **🎓 Courses** → the course you want → **Payment Link**.

| Payment Link field | What the button on the site does |
|---|---|
| Empty | Shows **"Register Interest"** and collects name/phone as a lead |
| Paste your Instamojo link | Shows **"Enroll Now"** and sends people straight to payment |

That is the only change needed to start selling. Nothing else has to be touched.

Other fields on the same course:

- **Demo Video URL** — paste any YouTube link to show a red "Watch Demo Lecture" link.
  Leave it empty and it says "Demo video coming soon".
- **Badge Text** — the orange pill on the card. Type `Launching Soon`, or `New`, or
  **clear the field to remove the pill completely**.
- **Price** — shows as ₹2,399. **Price Label** overrides it with text like
  "On Request" (use that instead of a number when you don't want to show a price).

---

## 3. YouTube videos — these link themselves

**You do not need to touch the CMS when you upload a video.** The site reads your
channel automatically and new uploads appear on the Free Content page on their own.

Two things worth knowing:

- It refreshes about **once an hour**, so a brand-new video is not instant.
- Which **tab** a video lands in (PYQ / Current Affairs / Strategy / UK Special /
  Shorts) is decided by **words in your video title**. So if you want a video under
  PYQ, put "PYQ" in the title. Very short titles get treated as Shorts.

To add a **playlist** link, use **📂 Free Resources → Playlists**.

---

## 4. PDFs, trackers and other files

Open **📂 Free Resources** → **Add Resources**. You now have two ways to attach the file:

- **Upload a PDF / file** — click, choose the PDF from your device. Best for your own
  guides and trackers. This hosts the file on your own site.
- **Or paste a link** — a Google Drive / Docs / Sheets link, or an internal page like
  `/pyq-tracker`.

If you do both, the uploaded file wins. Also fill in:

- **Title** — must be different from every other resource
- **Description** — one line explaining what it is
- **Type Label** — the small green pill: `PDF`, `Sheet`, `Tracker`, `Plan`
- **Icon** — pick from the dropdown

---

## 5. Articles — the standard format

Open **📝 Articles** → **New Articles**. The Body box already opens with a ready-made
skeleton, so every article comes out looking the same. Just replace the placeholder text.

Fill in:

- **Title** — the headline
- **Slug** — the URL, lowercase with dashes, e.g. `ukpsc-2026-strategy`
- **Meta Description** — one or two lines for Google (about 150 characters)
- **Category** — pick from the dropdown
- **Date** — publish date
- **Featured Image** — optional; shows at the top of the article and as the
  WhatsApp/Twitter preview picture
- **Body** — your article

### Formatting rules (keep to these and it always looks right)

| You type | You get |
|---|---|
| `## Section name` | A big section heading with a line under it |
| `### Smaller point` | A sub-heading |
| `- item` | A bullet point |
| `1. item` | A numbered step |
| `**important**` | **Bold text** |
| `> note` | A highlighted quote box |
| `---` | A divider line |

**Do not start the body with `# Title`.** The page already prints your Title field at
the top, so a second one looks wrong. The template does this correctly already.

---

## 6. Everything else you can edit

| Section in the sidebar | What it controls |
|---|---|
| 🏠 Home Page | Hero text, buttons, feature cards, testimonials, final call-to-action |
| 📕 Book Details | Price, chapters, what's included, WhatsApp number, early-bird banner |
| 🎓 Courses | Course names, prices, payment links, demo videos |
| 👤 About & Contact | Mission, timeline, email, social links |
| ❓ Daily Quiz | The 5 questions on the home page |
| 🎁 Lead Popup | The free-download popup and where the PDF link points |
| 🗞️ Weekly Current Affairs | Quick Publish (section 1 above) |
| 📂 Free Resources | PDFs, trackers, playlists |
| ⚙️ Site Settings | Brand name, footer, exam list, social URLs |
| 📝 Articles | Blog posts |

---

## 7. Daily MCQs

The daily 5 questions come from **two** places and rotate automatically every morning
at 8 AM:

1. Your **Google Sheet** — add rows there and they join the rotation. No CMS work.
2. The built-in question bank in the repo.

To edit the 5 questions on the **home page** specifically, use **❓ Daily Quiz**.

---

## 8. If something looks wrong

- **My change hasn't appeared.** Wait 2 minutes, then hard-refresh
  (`Ctrl+Shift+R` or `Cmd+Shift+R`).
- **I want to undo something.** Every Publish is saved as a version in GitHub, so any
  change can be rolled back from the repository's commit history.
- **The Free Content page shows videos that aren't mine.** That means the YouTube key
  has expired or hit its daily limit — the page falls back to placeholders. The key is
  `NEXT_PUBLIC_YOUTUBE_API_KEY` in the Vercel project settings.
- **"Error loading the CMS configuration".** Do not remove the
  `<link rel="cms-config-url">` line from `website/public/admin/index.html` — it is what
  tells the panel where its settings file is.
