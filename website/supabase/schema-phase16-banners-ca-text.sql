-- UKPSC Test Platform — Phase 16 (Batch 4): designed carousel banners,
-- English-only banner text, Current Affairs Intensive card text.
-- Idempotent (IF NOT EXISTS / ON CONFLICT / plain UPDATEs) — safe to re-run.
-- No DROP / DELETE / TRUNCATE.

-- ========== 1. Carousel banner images ==========
-- Optional designed banners. When image_url is empty the home carousel shows
-- the text banner (title + subtitle on gradient_from → gradient_to).
--   image_url         desktop, 1920×600, JPG/WebP under 200 KB
--   image_url_mobile  phones,  1080×1080, JPG/WebP under 200 KB
--                     (empty → image_url is used on phones too)
alter table banners add column if not exists image_url text;
alter table banners add column if not exists image_url_mobile text;

-- Public Storage bucket for the banner images. Upload in Supabase →
-- Storage → banners, then copy the file's public URL into
-- banners.image_url / image_url_mobile (Table Editor).
insert into storage.buckets (id, name, public)
values ('banners', 'banners', true)
on conflict (id) do nothing;

-- ========== 2. Banner text: English only, product colours ==========
-- Gradients match the course card headers (gold combo, garnet test series,
-- teal crash course, amethyst mentorship).
update banners set subtitle = 'Test Series + Crash Course at founding price',
  gradient_from = '#9a6a0c', gradient_to = '#1b1a19'
where id = 'f4370b6a-6cc9-4827-bc96-53bb035f1dc1'; -- Complete Prelims Pack

update banners set subtitle = '62 tests, complete preparation',
  gradient_from = '#9f1d3a', gradient_to = '#1b1a19'
where id = '6b005cec-3d46-44d7-83e7-c9fd912d54d0'; -- Premium Test Series

update banners set subtitle = 'Weekly 1-on-1 sessions, only 30 seats',
  gradient_from = '#6d28d9', gradient_to = '#1b1a19'
where id = '55ee1a67-bf80-423b-811f-b85ba136ece3'; -- Prelims Mentorship

update banners set subtitle = '50 video lectures + live sessions',
  gradient_from = '#0f766e', gradient_to = '#1b1a19'
where id = '504bc4c1-6f33-4836-a2b7-de2e4f5ed988'; -- Crash Course 2026

-- ========== 3. Current Affairs Intensive: text matches the theme tests ==========
-- Since Batch 2 the 12 CA tests are by theme (were "8 month-wise + 2
-- theme-wise"): 7 national themes, Uttarakhand CA + Budget, 3 year-wise
-- revisions and the Grand Revision.
update packages set
  description = '12 Current Affairs Tests (50 Questions each)' || chr(10) ||
    '7 theme tests: International Relations & Summits, Schemes, Reports & Indices, National Affairs & Governance, Economy & Budget, Science, Tech, Defence & Space, Environment & Awards, Sports & Persons in News' || chr(10) ||
    'Uttarakhand CA + Budget special test' || chr(10) ||
    'Year-wise revision (2023-24, 2025, 2026) + Grand Revision',
  highlights = '["7 theme-wise tests: summits, schemes & indices, governance, economy, science & defence, environment & awards, sports & persons", "Uttarakhand CA + Budget special test", "Year-wise revision (2023-24, 2025, 2026) + Grand Revision", "Valid till 31 December 2026"]'::jsonb,
  metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
    'card_title', 'Current Affairs Intensive',
    'card_tagline', '12 tests: 7 themes + Uttarakhand CA & Budget + 4 revisions'),
  updated_at = now()
where slug = 'current-affairs-intensive';

-- The standalone pack had no tests linked (buyers would get an empty
-- course). Link the same 12 CA tests the Premium Test Series has, in the
-- same order. Matches by subject, so it stays right if a CA test is renamed.
insert into package_tests (package_id, test_id, test_order)
select ca.id, pt.test_id, row_number() over (order by pt.test_order)
from packages ca
join packages premium on premium.slug = 'premium-test-series'
join package_tests pt on pt.package_id = premium.id
join tests t on t.id = pt.test_id
where ca.slug = 'current-affairs-intensive'
  and t.subject in ('Current Affairs', 'Current Affairs Revision')
on conflict (package_id, test_id) do nothing;

-- Check:
-- select title, subtitle, gradient_from, image_url, image_url_mobile from banners order by sort_order;
-- select p.slug, count(*) from package_tests pt join packages p on p.id = pt.package_id group by p.slug;  -- current-affairs-intensive → 12
