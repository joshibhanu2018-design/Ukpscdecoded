-- UKPSC Test Platform — Phase 35: designed home carousel banners
-- Safe to re-run: ADD COLUMN IF NOT EXISTS, UPDATEs and one guarded INSERT.
-- No DROP / DELETE / TRUNCATE.
--
-- Five designed banners (pictures in public/banners/, part of the website,
-- so nothing to upload): Complete Prelims Pack, Premium Test Series,
-- Crash Courses (Uttarakhand + National), Mentorship, the book.
-- link_url lets a banner lead somewhere other than its course page
-- (the book → /buy-book, the crash courses → /courses).

alter table banners add column if not exists link_url text;

update banners b set
  title = 'Complete Prelims Pack',
  subtitle = 'Test Series + Crash Course + PDF notes in one pack',
  image_url = '/banners/complete-pack-desktop.webp',
  image_url_mobile = '/banners/complete-pack-mobile.webp',
  link_url = null,
  sort_order = 1,
  is_active = true
from packages p
where p.id = b.package_id and p.slug = 'complete-prelims-pack';

update banners b set
  title = 'Premium Test Series',
  subtitle = '62 tests on the real UKPSC pattern, with detailed solutions',
  image_url = '/banners/test-series-desktop.webp',
  image_url_mobile = '/banners/test-series-mobile.webp',
  link_url = null,
  sort_order = 2,
  is_active = true
from packages p
where p.id = b.package_id and p.slug = 'premium-test-series';

update banners b set
  title = 'Crash Courses 2026',
  subtitle = 'Uttarakhand and National crash courses: videos, live sessions, PDF notes',
  image_url = '/banners/crash-courses-desktop.webp',
  image_url_mobile = '/banners/crash-courses-mobile.webp',
  link_url = '/courses',
  sort_order = 3,
  is_active = true
from packages p
where p.id = b.package_id and p.slug = 'crash-course';

update banners b set
  title = 'Prelims Mentorship',
  subtitle = 'Weekly 1-on-1 calls and a personal study plan',
  image_url = '/banners/mentorship-desktop.webp',
  image_url_mobile = '/banners/mentorship-mobile.webp',
  link_url = null,
  sort_order = 4,
  is_active = true
from packages p
where p.id = b.package_id and p.slug = 'prelims-mentorship';

-- The book has no course page: a banner without a package, leading to /buy-book.
insert into banners (package_id, title, subtitle, gradient_from, gradient_to, sort_order, is_active, image_url, image_url_mobile, link_url)
select null, 'Uttarakhand Decoded book', 'The only Uttarakhand GK book you need, in English and Hindi',
  '#0a2c5e', '#010d1f', 5, true,
  '/banners/book-desktop.webp', '/banners/book-mobile.webp', '/buy-book'
where not exists (select 1 from banners where link_url = '/buy-book');

-- Check (5 rows, each with a picture):
-- select b.sort_order, b.title, p.slug, b.link_url, b.image_url, b.is_active
-- from banners b left join packages p on p.id = b.package_id order by b.sort_order;
