-- UKPSC Test Platform — Phase 20: crash course tentative plan
-- Safe to re-run: plain UPDATEs with replace(), no DELETE/DROP.
--
-- Matches the video calendar: 50 videos released 2 Oct – 15 Nov 2026,
-- 6 Sunday live sessions, revision + mocks till the 29 Nov exam. The full
-- day-by-day plan is on the course page (content/crashCoursePlan.json).

-- Crash course: description, highlights, card tagline, class end date.
update packages set
  description = '50 video lectures + 6 live sessions + PDF notes
Videos: 2 October - 15 November 2026 (tentative plan, see below)
Recordings available till 31 December 2026',
  highlights = '["50 video lectures, released 2 October - 15 November", "6 Sunday live sessions: doubt clearing + extra content", "Revision + full mocks 16-29 November, before the 29 November exam", "PDF notes included · Recordings till 31 December 2026"]'::jsonb,
  metadata = coalesce(metadata, '{}'::jsonb) || '{"class_start": "2026-10-02", "class_end": "2026-11-15", "card_tagline": "50 video lectures + 6 live sessions + PDF notes"}'::jsonb,
  updated_at = now()
where slug = 'crash-course';

-- Combos / mentorship that include the crash course: old "8-10 live sessions" wording.
update packages set
  description = replace(description, '8-10 live sessions', '6 live sessions'),
  highlights = replace(highlights::text, '8-10 live sessions', '6 live sessions')::jsonb,
  updated_at = now()
where description like '%8-10 live sessions%' or highlights::text like '%8-10 live sessions%';

update packages set
  metadata = jsonb_set(metadata, '{card_tagline}', to_jsonb(replace(metadata->>'card_tagline', '8-10 live sessions', '6 live sessions'))),
  updated_at = now()
where metadata->>'card_tagline' like '%8-10 live sessions%';

-- Check: nothing should still say "8-10" or "2 November".
select slug, description, highlights, metadata->>'card_tagline' as tagline
from packages
where is_active and (description ilike '%crash%' or slug = 'crash-course' or highlights::text ilike '%crash%')
order by sort_order;
