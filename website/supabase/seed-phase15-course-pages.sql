-- UKPSC Test Platform — Phase 15 (Batch 3): course card headers, free demo videos
-- Run any time after seed-phase6-content.sql. Idempotent: plain UPDATEs that
-- merge keys into packages.metadata (other metadata keys, e.g. the crash
-- course's class_start/class_end, are kept) — safe to re-run.
--
-- metadata.card_title   — big name in the coloured header of a course card and
--                         the course page (when image_url is empty)
-- metadata.card_tagline — one plain line of "what you get" under it
-- metadata.demo_videos  — [{"title": "...", "youtube_id": "11-char id"}], shown
--                         in "Watch free demo" (YouTube until Bunny is set up)

-- ========== Card headers ==========
update packages p set
  metadata = coalesce(p.metadata, '{}'::jsonb) || jsonb_build_object('card_title', v.title, 'card_tagline', v.tagline),
  updated_at = now()
from (values
  ('complete-prelims-pack',     'Complete Prelims Pack',     'Crash Course + Premium Test Series'),
  ('premium-test-series',       'Premium Test Series',       '12 Full Mocks + 12 Sectional + 20 Uttarakhand + 12 Current Affairs + 6 CSAT'),
  ('prelims-mentorship',        'Mentorship',                'Everything + weekly 1-on-1 with Bhanu Joshi'),
  ('crash-course',              'Crash Course',              '50 video lectures incl. 8-10 live sessions + PDF notes'),
  ('basic-test-series',         'Basic Test Series',         '6 Full Mocks + 6 Sectional'),
  ('uttarakhand-intensive',     'Uttarakhand Intensive',     '20 Uttarakhand GK tests'),
  ('current-affairs-intensive', 'Current Affairs Intensive', '12 tests: 7 themes + Uttarakhand CA & Budget + 4 revisions'),
  ('csat-test-series',          'CSAT Test Series',          '6 CSAT tests (100 Q each)')
) as v(slug, title, tagline)
where p.slug = v.slug;

-- The package everyone calls "Premium Test Series" (slug premium-test-series)
-- was still named "Premium Bundle" at checkout, in receipts and My Courses.
update packages set package_name = 'Premium Test Series', updated_at = now()
where slug = 'premium-test-series' and package_name = 'Premium Bundle';

-- ========== Free demo videos (fill in, then run) ==========
-- Two per course: an orientation & exam-strategy video and one content video.
-- Replace XXXXXXXXXXX with the YouTube video id (the part after watch?v=),
-- remove the leading "-- " and run. A combo / mentorship page also shows the
-- videos of the courses it includes, so set them on these two only.
--
-- update packages set metadata = metadata || '{"demo_videos": [
--   {"title": "Orientation & exam strategy", "youtube_id": "XXXXXXXXXXX"},
--   {"title": "Sample lecture", "youtube_id": "XXXXXXXXXXX"}
-- ]}'::jsonb, updated_at = now() where slug = 'crash-course';
--
-- update packages set metadata = metadata || '{"demo_videos": [
--   {"title": "How the test series works", "youtube_id": "XXXXXXXXXXX"},
--   {"title": "Solving a mock: strategy", "youtube_id": "XXXXXXXXXXX"}
-- ]}'::jsonb, updated_at = now() where slug = 'premium-test-series';

-- Check:
-- select slug, package_name, metadata from packages where is_active order by sort_order;
