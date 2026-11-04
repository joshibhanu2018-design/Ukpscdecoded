-- UKPSC Test Platform — Phase 41: Final Revision Test Series as the FIRST home carousel banner
-- Safe to re-run: one guarded INSERT and one UPDATE. No DROP / DELETE / TRUNCATE. Needs phase 35.
-- Pictures are part of the website: public/banners/revision-desktop.webp (1920x600)
-- and revision-mobile.webp (1080x1080), made by scripts/banners/make-revision-banner.cjs.
-- After 29 Nov, switch it off: update banners set is_active = false where link_url = '/revision';

insert into banners (package_id, title, subtitle, gradient_from, gradient_to, sort_order, is_active, image_url, image_url_mobile, link_url)
select null, 'Final Revision Test Series', '6 live-ranked mocks + 800 Uttarakhand GK + 600 Current Affairs questions',
  '#2a1205', '#120804', 0, true,
  '/banners/revision-desktop.webp', '/banners/revision-mobile.webp', '/revision'
where not exists (select 1 from banners where link_url = '/revision');

update banners set sort_order = 0, is_active = true,
  image_url = '/banners/revision-desktop.webp', image_url_mobile = '/banners/revision-mobile.webp'
where link_url = '/revision';

-- Check (Revision first):
select b.sort_order, b.title, b.link_url, b.is_active from banners b order by b.sort_order;
