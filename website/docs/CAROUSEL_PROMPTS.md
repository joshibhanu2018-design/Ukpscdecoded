# Home carousel banners — AI prompts

The home page carousel takes **designed picture banners** for each product.
Make two images for each one:

| Use     | Size (pixels) | Shape      |
|---------|---------------|------------|
| Desktop | 1920 × 600    | wide strip |
| Phone   | 1080 × 1080   | square     |

## Which AI to use
Use **ChatGPT** (image generation) or **Google Gemini** (nano banana). Both
let you attach reference pictures. With each prompt, attach:
1. `website/public/logo-badge.png`, the round logo
2. the right book cover (English or Hindi), for the book and e-book banners
3. a clear photo of Bhanu Joshi, for the Mentorship and Crash Course banners
   (well lit, plain background, shoulders up)

AI often misspells text. Check every word before using a banner. If a word is
wrong, ask "fix the spelling of X", or put the text on in Canva instead. Keep
banner text in **English**: AI writes Hindi badly.

Don't put **prices or dates** on banners. They change, and an old price on a
banner looks wrong. The course page shows the current price.

## Brand block — paste this at the start of EVERY prompt

> Design a premium, modern advertising banner for "UKPSC Decoded", an exam
> preparation brand for Uttarakhand state exams (UKPSC Upper & Lower PCS,
> RO/ARO, UKSSSC). Use the attached round logo exactly as given, without
> redrawing or changing it, clearly visible at about 15% of the banner height.
> Colours: deep navy (#001A3A) and dark graphite, with saffron/golden-yellow
> (#F5A623) accents and white text. Subtle Uttarakhand Himalaya mountain
> silhouette in the background. Clean, bold sans-serif headline (Poppins
> style). High contrast, sharp, professional, like a top Indian edtech brand.
> No clutter, no stock-photo watermarks, no fake text, no prices, no dates.
> Keep the bottom 10% of the image free of text (the slider dots sit there).

Then add the **size line** for the version you are making:

- Desktop: *"Wide 1920×600 banner (16:5). Logo and headline on the left
  half, product image on the right half."*
- Phone: *"Square 1080×1080 banner. Logo at top centre, headline in the middle,
  product image in the lower half. Text large enough to read on a phone."*

## 1. The book (English edition / Hindi edition)
> Hero: the attached book cover shown as a realistic 3D hardcopy book,
> standing at a slight angle with a soft shadow, plus a second copy lying
> flat behind it. Headline: "The Only Uttarakhand GK Book You Need".
> Sub-line: "Complete GS-5 & GS-6 • UKPSC • RO/ARO • UKSSSC". Three small
> tick-mark points: "Table-driven chapters", "Current Affairs & Budget
> integrated", "Free delivery across India". Golden button: "Order Now".

For the Hindi edition: attach the Hindi cover and use the sub-line "Hindi
Edition now available" (in English; add any Hindi words in Canva).

## 2. Test Series
> Hero: a smartphone and a laptop showing an online MCQ test screen with
> options A–D, a timer and an all-India rank card ("Rank #12"). Floating
> icons: stopwatch, target, bar chart. Headline: "Premium Test Series".
> Sub-line: "62 tests on the real UKPSC pattern". Three points: "Detailed
> solutions", "All-India rank & analysis", "UK GK + Current Affairs".
> Golden button: "Start Practising".

## 3. Complete Prelims Pack
> Hero: a bundle shown as a premium gift box opening with golden light,
> showing the attached book cover, a laptop with video lessons, and a phone
> with a test screen, all coming out of the box. Gold ribbon label "BEST
> VALUE". Headline: "Complete Prelims Pack". Sub-line: "Everything you need
> for UKPSC Prelims in one place". Three points: "Book + Crash Course + Test
> Series", "Study plan included", "Save more together". Golden button: "Get
> the Pack".

## 4. Crash Course
> Hero: the attached photo of the teacher (keep his face exactly as in the
> photo, do not change it) in a confident teaching pose on the right, with a
> large video player frame beside him showing a "play" button, and a small
> "LIVE" red badge. Headline: "UKPSC Prelims Crash Course". Sub-line:
> "High-yield topics built from 10 years of PYQs". Three points: "Video
> lectures + live sessions", "Notes PDF in English & Hindi", "Tests included".
> Golden button: "Join the Crash Course".

## 5. Mentorship (with Bhanu Joshi)
> Hero: the attached photo of the mentor (keep his face exactly as in the
> photo) on the right, friendly and approachable, with a soft golden glow
> behind him. A small calendar and a video-call window floating near him.
> Headline: "1-on-1 Mentorship with Bhanu Joshi". Sub-line: "A personal plan,
> regular check-ins, answer-writing guidance". Ribbon: "Limited seats".
> Golden button: "Apply Now".

## 6. E-Books (GS)
> Hero: a tablet and a phone showing the attached book cover as an e-book,
> with three or four smaller digital book covers fanned behind them in navy and
> gold. A small "PDF" badge and a download arrow icon. Headline: "GS E-Books".
> Sub-line: "Read anywhere, on phone or laptop". Three points: "Instant
> access", "Exam-focused notes", "Updated for 2026". Golden button: "Get
> E-Books".

## After the AI makes the image
1. Check the spelling and that the logo is the real one, not a redrawn one.
2. If the size came out wrong, resize it in Canva ("Resize") to exactly
   1920×600 / 1080×1080.
3. Shrink each file to **under 200 KB**: open https://squoosh.app, drop the
   image in, choose **WebP** at quality about 75, and download it.
4. Upload it: Supabase → Storage → **banners** → Upload. Click the file →
   **Get URL** → copy.
5. Supabase → Table Editor → **banners** → the product's row: paste the
   desktop URL into `image_url` and the phone URL into `image_url_mobile` →
   Save.
6. Open the website on the laptop and the phone and check both.
