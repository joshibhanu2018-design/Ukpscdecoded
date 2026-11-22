-- Phase 47i (22 Nov 2026): one row per video in the Crash Course.
--
-- Some videos show twice (e.g. Video 36, 37): an older "Notes ready · video
-- coming soon" row that holds the PDFs, plus a newer row that has the video.
-- This keeps the row WITH the video, gives it the PDFs if it has none, and
-- hides the notes-only row. Safe to run more than once; nothing is deleted.
--
-- Run it once. The Uttarakhand and National Crash Courses show the Crash Course
-- lessons, so they are fixed too.

-- See what will change first (optional):
-- select (substring(l.title from '(?i)video\s*(\d{1,3})'))::int as video_no, l.title, l.is_active,
--        (coalesce(nullif(l.youtube_id, ''), nullif(l.bunny_video_id, '')) is not null) as has_video,
--        l.pdf_en_path is not null as en_pdf, l.pdf_hi_path is not null as hi_pdf
-- from lessons l join packages p on p.id = l.package_id
-- where p.slug = 'crash-course' and l.is_active order by video_no, l.created_at;

with cc as (
  select l.*, (substring(l.title from '(?i)video\s*(\d{1,3})'))::int as video_no,
         (coalesce(nullif(l.youtube_id, ''), nullif(l.bunny_video_id, '')) is not null) as has_video
  from lessons l join packages p on p.id = l.package_id
  where p.slug = 'crash-course' and l.is_active
),
pairs as (
  -- the newest row with a video, and a notes-only row, for the same video number
  select distinct on (n.id) v.id as video_id, n.id as notes_id, n.pdf_en_path, n.pdf_hi_path
  from cc n
  join cc v on v.video_no = n.video_no and v.has_video and v.id <> n.id
  where n.video_no is not null and not n.has_video
  order by n.id, v.created_at desc
)
-- 1. Give the video row the PDFs it is missing.
update lessons l
set pdf_en_path = coalesce(l.pdf_en_path, pr.pdf_en_path),
    pdf_hi_path = coalesce(l.pdf_hi_path, pr.pdf_hi_path),
    updated_at = now()
from pairs pr
where l.id = pr.video_id
  and ((l.pdf_en_path is null and pr.pdf_en_path is not null) or (l.pdf_hi_path is null and pr.pdf_hi_path is not null));

-- 2. Hide the notes-only row when a row with the video exists for the same number.
with cc as (
  select l.*, (substring(l.title from '(?i)video\s*(\d{1,3})'))::int as video_no,
         (coalesce(nullif(l.youtube_id, ''), nullif(l.bunny_video_id, '')) is not null) as has_video
  from lessons l join packages p on p.id = l.package_id
  where p.slug = 'crash-course' and l.is_active
)
update lessons l
set is_active = false, updated_at = now()
from cc n
where l.id = n.id and n.video_no is not null and not n.has_video
  and exists (select 1 from cc v where v.video_no = n.video_no and v.has_video and v.id <> n.id);

-- 3. Copies in other courses (Lower PCS Crash Course etc.) that were made from a
--    hidden notes-only row now follow the row with the video.
with cc as (
  select l.*, (substring(l.title from '(?i)video\s*(\d{1,3})'))::int as video_no,
         (coalesce(nullif(l.youtube_id, ''), nullif(l.bunny_video_id, '')) is not null) as has_video
  from lessons l join packages p on p.id = l.package_id
  where p.slug = 'crash-course'
),
m as (
  select distinct on (n.id) n.id as notes_id, v.id as video_id
  from cc n
  join cc v on v.video_no = n.video_no and v.has_video and v.is_active and v.id <> n.id
  where n.video_no is not null and not n.has_video and not n.is_active
  order by n.id, v.created_at desc
)
update lessons c
set source_lesson_id = m.video_id, updated_at = now()
from m
where c.source_lesson_id = m.notes_id;

-- 4. Copies without a video get the video (and any missing PDFs) of their Crash Course lesson.
update lessons c
set youtube_id = s.youtube_id, bunny_video_id = s.bunny_video_id,
    pdf_en_path = coalesce(c.pdf_en_path, s.pdf_en_path),
    pdf_hi_path = coalesce(c.pdf_hi_path, s.pdf_hi_path),
    updated_at = now()
from lessons s join packages p on p.id = s.package_id
where p.slug = 'crash-course' and s.id = c.source_lesson_id
  and coalesce(nullif(c.youtube_id, ''), nullif(c.bunny_video_id, '')) is null
  and coalesce(nullif(s.youtube_id, ''), nullif(s.bunny_video_id, '')) is not null;

-- Check: video numbers that still have more than one visible row.
select (substring(l.title from '(?i)video\s*(\d{1,3})'))::int as video_no, count(*) as visible_rows,
       string_agg(l.title, ' | ') as titles
from lessons l join packages p on p.id = l.package_id
where p.slug = 'crash-course' and l.is_active
group by 1 having count(*) > 1 order by 1;
