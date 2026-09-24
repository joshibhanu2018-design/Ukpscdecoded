-- UKPSC Test Platform — Phase 6b: course content + banners
-- Run SECOND of the phase 6 files (after schema-phase6-content.sql).
-- Not run yet. Idempotent — every UPDATE/INSERT can be re-run safely.

-- ========== Generic FAQ, applied to every active package ==========
-- Real policy content (matches /terms), not placeholder text — the
-- curriculum below is the part explicitly meant to be filled in later.
update packages set faq = '[
  {"question": "What is the refund policy?", "answer": "Digital access purchases are non-refundable once activated, except for a genuine technical failure on our end."},
  {"question": "How long is my access valid?", "answer": "The validity date is shown on this page. Access ends automatically on that date."},
  {"question": "Can I share my account with a friend?", "answer": "No — each purchase is for one student. Shared accounts are suspended without refund."}
]'::jsonb
where is_active = true;

-- ========== Slugs + highlights ==========

update packages set
  slug = 'complete-prelims-pack',
  highlights = '["62 tests across Premium Test Series + Crash Course", "50 video lectures including 8-10 live sessions", "PDF notes included", "Real saving vs buying separately"]'::jsonb
where id = '47519f69-eb7b-42cd-8e85-1b3f28e980f7';

update packages set
  slug = 'premium-test-series',
  highlights = '["62 tests: Full Mocks, Sectional, Uttarakhand Intensive, Current Affairs, CSAT", "Detailed solutions on every test", "Covers Prelims + Uttarakhand GK + CSAT", "Valid till 31 December 2026"]'::jsonb
where id = 'fa2c4a38-d430-42ce-905d-375bd8af5ca9';

update packages set
  slug = 'prelims-mentorship',
  highlights = '["Everything in the Complete Prelims Pack", "3 one-on-one calls with Bhanu Joshi", "Personal test review", "Only 25 seats"]'::jsonb
where id = 'd06e08a8-3a25-43a3-8e9d-3de0ecd6d2ae';

update packages set
  slug = 'crash-course',
  highlights = '["50 video lectures including 8-10 live sessions", "PDF notes included", "Classes: 2 October - 2 November 2026", "Recordings available till 31 December 2026"]'::jsonb
where id = 'aa67a65e-9e92-47ac-bdbd-ebef3c81d2f4';

update packages set
  slug = 'basic-test-series',
  highlights = '["6 Full Mock Tests (150 Q each)", "6 Sectional Tests (50 Q each)", "Detailed solutions", "Valid till 31 December 2026"]'::jsonb
where id = '6e868c4b-08a2-4bbe-a78a-2144a69a4288';

update packages set
  slug = 'uttarakhand-intensive',
  highlights = '["20 tests covering the full Uttarakhand GK syllabus", "History, Geography, Polity, Economy & more", "Mixed Mocks + Topper Test + Grand Mock", "Valid till 31 December 2026"]'::jsonb
where id = '368ea0df-d24c-4857-a3c3-66ba5858f1d2';

update packages set
  slug = 'current-affairs-intensive',
  highlights = '["12 Current Affairs tests", "8 month-wise + 2 theme-wise tests", "Uttarakhand CA + Budget special test", "Grand revision test"]'::jsonb
where id = 'c100e8b1-0929-429d-9e16-d2255f1bddad';

update packages set
  slug = 'csat-test-series',
  highlights = '["6 CSAT tests (100 Q each)", "Covers reasoning, comprehension & aptitude", "Detailed solutions", "Valid till 31 December 2026"]'::jsonb
where id = 'fb0bccf7-9649-4161-9e5c-c441c743f6a8';

-- ========== Crash course curriculum: 50 lecture placeholders ==========
-- Generated, not hand-typed, to avoid transcription errors. Edit later
-- directly via SQL (UPDATE packages SET curriculum = ...) once real
-- lecture titles exist — no code change needed either way.
update packages set curriculum = (
  select jsonb_agg(jsonb_build_object('title', 'Lecture ' || g) order by g)
  from generate_series(1, 50) g
)
where id = 'aa67a65e-9e92-47ac-bdbd-ebef3c81d2f4';

-- ========== Home page banners ==========
insert into banners (package_id, title, subtitle, gradient_from, gradient_to, sort_order, is_active) values
  ('47519f69-eb7b-42cd-8e85-1b3f28e980f7', 'Complete Prelims Pack',
   'टेस्ट सीरीज + क्रैश कोर्स — फाउंडिंग मूल्य पर / Test Series + Crash Course at founding price',
   '#f59307', '#78300d', 1, true),
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'Premium Test Series',
   '62 टेस्ट, पूरी तैयारी / 62 tests, complete preparation',
   '#d97706', '#451a03', 2, true),
  ('d06e08a8-3a25-43a3-8e9d-3de0ecd6d2ae', 'Prelims Mentorship with Bhanu Joshi',
   '1-on-1 मार्गदर्शन, सीमित सीटें / Personal guidance, limited seats',
   '#ca8a04', '#422006', 3, true),
  ('aa67a65e-9e92-47ac-bdbd-ebef3c81d2f4', 'Crash Course 2026',
   '50 वीडियो लेक्चर + लाइव सेशन / 50 video lectures + live sessions',
   '#ea580c', '#431407', 4, true)
on conflict (package_id) do update set
  title = excluded.title, subtitle = excluded.subtitle, gradient_from = excluded.gradient_from,
  gradient_to = excluded.gradient_to, sort_order = excluded.sort_order, is_active = excluded.is_active;
