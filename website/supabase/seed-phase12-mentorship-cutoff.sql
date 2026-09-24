-- UKPSC Test Platform — Phase 12: mentorship 30 seats + weekly format, expected cutoff
-- Not run yet. Run AFTER seed-phase6-content.sql and schema-phase11 (needs
-- app_settings). Idempotent: plain UPDATEs and an upsert — safe to re-run.

-- ========== Mentorship: 30 seats, ₹8,999, weekly sessions ==========
-- Price unchanged (₹8,999). Buying it already unlocks the Complete Prelims
-- Pack, Premium Test Series and Crash Course (package_includes, phase 5d).
update packages set
  seats_total = 30,
  description = 'Everything included: Complete Prelims Pack = Premium Test Series (62 tests) + Crash Course (50 lectures)
Weekly 20-minute 1-on-1 session with Bhanu Joshi (book your own slot)
Personal test analysis: gap to cutoff, weak topics, error log, guess rule
Written plan after every session',
  highlights = '["Premium Test Series + Crash Course included", "Weekly 1-on-1 session with Bhanu Joshi", "Personal test analysis & gap-to-cutoff", "Only 30 seats"]'::jsonb,
  updated_at = now()
where id = 'd06e08a8-3a25-43a3-8e9d-3de0ecd6d2ae';

-- Home-page banner text for mentorship, if it mentions the old format.
update banners set subtitle = 'हर सप्ताह 1-on-1 सत्र, सिर्फ़ 30 सीटें / Weekly 1-on-1 sessions, only 30 seats'
where package_id = 'd06e08a8-3a25-43a3-8e9d-3de0ecd6d2ae';

-- ========== Expected cutoff (editable later in Admin → Mentees) ==========
insert into app_settings (key, value) values ('expected_cutoff', '110'), ('cutoff_total', '150')
on conflict (key) do nothing;
