-- UKPSC Decoded — Phase 25: crash course text matches the 5 Oct launch
-- Safe to re-run: plain UPDATEs with replace(), no DELETE/DROP.
--
-- The plan (content/crashCoursePlan.json): 50 videos released 5 Oct – 18 Nov
-- 2026, 6 weekly live sessions on Wednesdays (14 Oct – 18 Nov), revision +
-- mocks 19–29 Nov, exam 29 Nov. Fixes the old "2 October – 15 November",
-- "5 October – 5 November", "8-10 live sessions", "Sunday", "16-29 November"
-- and "TRI Exam" wording on the store.

update packages set
  description = '50 video lectures + 6 live sessions + PDF notes
Videos: 5 October - 18 November 2026 (tentative plan, see below)
Recordings available till 31 December 2026',
  highlights = '["50 video lectures, released 5 October - 18 November", "6 weekly live sessions (Wednesdays): doubt clearing + extra content", "Revision + full mocks 19-29 November, before the 29 November exam", "PDF notes included · Recordings till 31 December 2026"]'::jsonb,
  metadata = coalesce(metadata, '{}'::jsonb) || '{"class_start": "2026-10-05", "class_end": "2026-11-18", "card_tagline": "50 video lectures + 6 live sessions + PDF notes"}'::jsonb,
  updated_at = now()
where slug = 'crash-course';

-- Drop the unconfirmed "TRI Exam" from any package name or description.
update packages set
  package_name = replace(package_name, ' and TRI Exam', ''),
  description = replace(description, ' and TRI Exam', ''),
  updated_at = now()
where package_name like '% and TRI Exam%' or description like '% and TRI Exam%';

-- Bundles / mentorship that describe the crash course.
update packages set
  description = replace(description, '8-10 live sessions', '6 live sessions'),
  highlights = replace(highlights::text, '8-10 live sessions', '6 live sessions')::jsonb,
  updated_at = now()
where description like '%8-10 live sessions%' or highlights::text like '%8-10 live sessions%';

-- Check: nothing below should mention 2 October, 15 November, 16-29, Sunday, 8-10 or TRI.
select slug, package_name, description, highlights, metadata->>'class_start' as class_start
from packages
where is_active and (slug = 'crash-course' or description ilike '%crash%' or highlights::text ilike '%crash%' or package_name ilike '%crash%')
order by sort_order;
