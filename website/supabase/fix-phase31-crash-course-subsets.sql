-- UKPSC Test Platform — Phase 31: Uttarakhand + National Crash Course text
-- Safe to re-run: UPDATEs only. No DROP / DELETE / TRUNCATE.
--
-- Both courses now share the Crash Course's lessons (src/lib/course-subsets.ts):
--   National:    28 videos (national topics + Video 1 + Video 50), 4 live sessions
--   Uttarakhand: 26 videos (Uttarakhand topics + UK current affairs + Video 1 + CSAT + Video 50), 3 live sessions
-- The Uttarakhand course's own lessons are no longer shown; upload to the Crash Course only.

update packages set
  description = '28 video lectures: national GS for UKPSC Prelims (History, Polity, Geography, Economy, Science & Tech, Environment, CSAT, national current affairs) + the combined Uttarakhand & National current affairs lecture
4 live sessions on Google Meet
Same schedule as the Crash Course, without the Uttarakhand topics
PDF notes included · Recordings till 31 December 2026',
  highlights = '["28 video lectures on national GS topics", "4 live sessions on Google Meet", "Same schedule as the Crash Course, without Uttarakhand topics", "PDF notes in English & Hindi", "Recordings till 31 December 2026"]'::jsonb,
  metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
    'card_tagline', '28 national GS video lectures + 4 live sessions + PDF notes'),
  updated_at = now()
where slug = 'national-crash-course';

update packages set
  description = '26 video lectures: Uttarakhand static GK + Uttarakhand current affairs + 2 CSAT lectures + the combined Uttarakhand & National current affairs lecture (the Uttarakhand lectures of the Crash Course)
3 live sessions on Google Meet
PDF notes included · Recordings till 31 December 2026',
  highlights = '["26 video lectures: Uttarakhand static GK, Uttarakhand current affairs + CSAT", "3 live sessions on Google Meet", "PDF notes in English & Hindi", "Recordings till 31 December 2026"]'::jsonb,
  metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
    'card_tagline', '26 video lectures (Uttarakhand GK + CSAT) + 3 live sessions + PDF notes'),
  updated_at = now()
where slug = 'uttarakhand-crash-course';

-- Check:
-- select slug, price, description from packages where slug in ('national-crash-course', 'uttarakhand-crash-course');
