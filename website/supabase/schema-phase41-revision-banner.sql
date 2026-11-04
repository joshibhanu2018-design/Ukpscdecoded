-- UKPSC Test Platform — Phase 41: final-month carousel banners + Rank Challenge name
-- Safe to re-run: guarded INSERTs and UPDATEs. No DROP / DELETE / TRUNCATE. Needs phases 35 and 37.
-- 1. Home carousel: Final Revision Test Series first (links to /revision), then
--    All Uttarakhand Rank Challenge (links to /mahasangram). The whole banner is the link.
--    Pictures are part of the website (public/banners/revision-*.webp, mahasangram-*.webp),
--    made by scripts/banners/make-final-month-banners.cjs.
-- 2. Mock Mahasangram is sold as the "All Uttarakhand Rank Challenge".
-- After 29 Nov, switch the banners off:
--   update banners set is_active = false where link_url in ('/revision', '/mahasangram');

insert into banners (package_id, title, subtitle, gradient_from, gradient_to, sort_order, is_active, image_url, image_url_mobile, link_url)
select null, 'Final Revision Test Series', '6 live-ranked mocks + 800 Uttarakhand GK + 600 Current Affairs questions',
  '#2a1205', '#120804', -2, true, '/banners/revision-desktop.webp', '/banners/revision-mobile.webp', '/revision'
where not exists (select 1 from banners where link_url = '/revision');

insert into banners (package_id, title, subtitle, gradient_from, gradient_to, sort_order, is_active, image_url, image_url_mobile, link_url)
select null, 'All Uttarakhand Rank Challenge', 'Are you the next topper? Free Warm-up Mock open now',
  '#2a1205', '#120804', -1, true, '/banners/mahasangram-desktop.webp', '/banners/mahasangram-mobile.webp', '/mahasangram'
where not exists (select 1 from banners where link_url = '/mahasangram');

update banners set sort_order = -2, is_active = true,
  image_url = '/banners/revision-desktop.webp', image_url_mobile = '/banners/revision-mobile.webp'
where link_url = '/revision';

update banners set sort_order = -1, is_active = true,
  image_url = '/banners/mahasangram-desktop.webp', image_url_mobile = '/banners/mahasangram-mobile.webp'
where link_url = '/mahasangram';

update packages set
  package_name = 'Mock Mahasangram - All Uttarakhand Rank Challenge',
  metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
    'card_title', 'All Uttarakhand Rank Challenge',
    'card_tagline', 'Are you the next topper? 6 live-ranked full mocks'),
  updated_at = now()
where slug = 'mock-mahasangram';

-- Check (Revision first, Rank Challenge second):
select b.sort_order, b.title, b.link_url, b.is_active from banners b order by b.sort_order;
