-- UKPSC Test Platform — Phase 30: National Crash Course (₹1899)
-- Safe to re-run: one guarded INSERT and UPDATEs. No DROP / DELETE / TRUNCATE.
--
-- The national part of the Crash Course: 27 videos (no Uttarakhand GK, no
-- Uttarakhand current affairs) and 4 of the 6 live sessions, same schedule.
-- It has no lessons of its own: the website shows the matching "Video N"
-- lessons of the Crash Course (src/lib/course-subsets.ts), so each video is
-- uploaded once.

insert into packages (id, package_name, price, package_type, is_active, slug, created_at, updated_at)
select gen_random_uuid(), 'National Crash Course', 1899, 'video_course', true, 'national-crash-course', now(), now()
where not exists (select 1 from packages where slug = 'national-crash-course');

update packages nc set
  package_name = 'National Crash Course',
  package_type = 'video_course',
  price = 1899,
  founding_price = null,
  regular_price = null,
  founding_ends_at = null,
  discount_percentage = null,
  original_price = null,
  access_valid_till = '2026-12-31',
  validity_days = null,
  total_tests = null,
  total_questions = null,
  seats_total = null,
  is_active = true,
  sort_order = cc.sort_order + 2,
  description = '27 video lectures: national GS for UKPSC Prelims (History, Polity, Geography, Economy, Science & Tech, Environment, CSAT, national current affairs)
4 live sessions on Google Meet
Same schedule as the Crash Course, without the Uttarakhand topics
PDF notes included · Recordings till 31 December 2026',
  highlights = '["27 video lectures on national GS topics", "4 live sessions on Google Meet", "Same schedule as the Crash Course, without Uttarakhand topics", "PDF notes in English & Hindi", "Recordings till 31 December 2026"]'::jsonb,
  curriculum = '[]'::jsonb,
  faq = coalesce(cc.faq, '[]'::jsonb),
  metadata = jsonb_build_object(
    'card_title', 'National Crash Course',
    'card_tagline', '27 national GS video lectures + 4 live sessions + PDF notes',
    'class_start', cc.metadata->>'class_start',
    'class_end', cc.metadata->>'class_end'),
  updated_at = now()
from packages cc
where nc.slug = 'national-crash-course' and cc.slug = 'crash-course';

-- Check:
-- select slug, package_name, package_type, price, access_valid_till, sort_order, is_active
-- from packages where slug in ('crash-course', 'uttarakhand-crash-course', 'national-crash-course');
