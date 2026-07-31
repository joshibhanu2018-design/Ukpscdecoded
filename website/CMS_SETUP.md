# Content Manager (Decap CMS) — Setup Guide

You can now edit your website's text through a form-based dashboard instead of
editing code. This guide covers the one-time setup.

**Dashboard URL:** `https://your-site.vercel.app/admin`

---

## What you can edit

| Section | What's editable |
|---|---|
| **🏠 Home Page** | Hero heading & buttons, stats bar, feature cards, book preview, testimonials, final CTA |
| **📕 Book Details** | Title, price, "What's Included", all 28 chapters across 5 parts, WhatsApp number, trust badges |
| **🎓 Courses** | Course names, prices, descriptions, features, "Launching Soon" toggle per course |
| **👤 About & Contact** | Mission statement, impact stats, journey timeline, email & all social links |
| **⚙️ Site Settings** | Brand name, navbar button, footer text, exams list, social URLs |

Pages driven by live data — **Free Content** (YouTube API), **Current Affairs**
(Google Sheet), and **PYQ Tracker** — are not in the CMS by design. Those update
themselves.

---

## One-time setup (about 5 minutes)

### Step 1 — Create a GitHub OAuth App

1. Go to **https://github.com/settings/developers**
2. Click **OAuth Apps** → **New OAuth App**
3. Fill in the form:

   | Field | Value |
   |---|---|
   | Application name | `UKPSC Decoded CMS` |
   | Homepage URL | `https://your-site.vercel.app` |
   | Authorization callback URL | `https://your-site.vercel.app/api/callback` |

   > Replace `your-site.vercel.app` with your actual Vercel domain.
   > The callback URL must match **exactly**, including `/api/callback`.

4. Click **Register application**
5. Copy the **Client ID**
6. Click **Generate a new client secret** and copy the secret
   (GitHub shows it only once — copy it now)

### Step 2 — Add the credentials to Vercel

1. Open your project in Vercel → **Settings** → **Environment Variables**
2. Add these two variables:

   | Key | Value |
   |---|---|
   | `GITHUB_OAUTH_ID` | the Client ID from Step 1 |
   | `GITHUB_OAUTH_SECRET` | the Client Secret from Step 1 |

3. Apply them to **Production**, **Preview**, and **Development**
4. Go to **Deployments** → click the latest → **Redeploy**

   > Environment variables only take effect after a redeploy.

### Step 3 — Sign in

1. Visit `https://your-site.vercel.app/admin`
2. Click **Login with GitHub**
3. Approve the authorization popup

Done. You'll land on the dashboard.

---

## How editing works

1. Pick a section in the left sidebar (e.g. **🏠 Home Page**)
2. Change the fields in the form
3. Click **Publish**

Behind the scenes, Decap commits your change to the `main` branch of this repo.
Vercel sees the commit and rebuilds the site automatically — your change is live
in roughly **1–2 minutes**.

Because every edit is a git commit, you get full version history for free. If
something goes wrong, the change can be reverted from the repo's commit list.

### Adding and removing items

Repeating sections — stats, feature cards, testimonials, chapters, courses,
exams — are lists. Each list has:

- **Add** button at the bottom to append a new item
- **drag handle** to reorder items
- **⋮ menu** on each item to delete it

### Icons

Some items have an **Icon** dropdown. Only the options in that dropdown will
render. To add a new icon choice, both files need updating:

1. `website/public/admin/config.yml` — add the option to the `options:` list
2. `website/src/lib/icons.tsx` — register the name in `iconMap`

---

## Who can log in

Anyone with **write access to this GitHub repository**. To give a teammate
access, add them as a collaborator on the repo — they can then sign in at
`/admin` with their own GitHub account.

To revoke access, remove them as a collaborator.

---

## Editing locally (optional)

To preview content edits on your own machine without touching production:

```bash
cd website

# Terminal 1 — local CMS backend
npx decap-server

# Terminal 2 — the site
npm run dev
```

Then uncomment this line in `website/public/admin/config.yml`:

```yaml
local_backend: true
```

Open `http://localhost:3000/admin` — no GitHub login required, and edits write
straight to your local files. Remember to re-comment `local_backend: true`
before pushing, otherwise the live dashboard will try to reach a local server.

---

## Troubleshooting

**"Error loading the CMS configuration — Failed to load config.yml (404)"**
Decap looks for `config.yml` relative to the page URL. This site is served at
`/admin` with no trailing slash, so a relative lookup resolves to `/config.yml`
(404) instead of `/admin/config.yml`. The absolute `<link rel="cms-config-url">`
tag in `website/public/admin/index.html` pins the correct path — don't remove it.

**"GitHub OAuth is not configured"**
The environment variables are missing or the site hasn't been redeployed since
you added them. Re-check Step 2, then redeploy.

**Popup opens then closes with nothing happening**
The Authorization callback URL in your GitHub OAuth App doesn't match your site.
It must be exactly `https://your-site.vercel.app/api/callback`.

**"Invalid or expired sign-in request"**
The sign-in took longer than 10 minutes, or cookies are blocked. Close the
popup and click Login again.

**Changes published but the site looks unchanged**
Wait 1–2 minutes for Vercel to finish rebuilding, then hard-refresh
(`Ctrl+Shift+R` / `Cmd+Shift+R`). Check the Deployments tab in Vercel to confirm
the build succeeded.

**A field shows as blank in the dashboard**
The field name in `config.yml` no longer matches the key in the JSON file under
`website/content/`. They must match exactly.

---

## Files involved

| Path | Purpose |
|---|---|
| `website/public/admin/index.html` | Loads the CMS dashboard |
| `website/public/admin/config.yml` | Defines which fields appear in the forms |
| `website/content/*.json` | The actual content the CMS reads and writes |
| `website/src/app/api/auth/route.ts` | Starts GitHub sign-in |
| `website/src/app/api/callback/route.ts` | Completes GitHub sign-in |
| `website/src/lib/icons.tsx` | Maps icon names in JSON to real icons |
