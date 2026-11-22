-- Phase 47h (22 Nov 2026): Crash Course Video 40 and Video 41 become the
-- Uttarakhand Current Affairs 2026 videos (Part 1 and Part 2), in every course.
--
-- RUN THIS AFTER you have put the Part 2 YouTube video on "Video 41" in
-- Admin -> Lessons -> Crash Course (step 4 below copies it to the other courses).
--
-- What it does (safe to run more than once; nothing is deleted):
--   1. Crash Course: names the new Video 40 "UK CA Part 1 ..." and hides the old
--      "Video 40: UK CA - State Schemes, Disaster Management, UK Awards".
--   2. Crash Course: renames Video 41 to "UK CA Part 2 ...".
--   3. Copies in other courses (Lower PCS Crash Course, CA 2026 Videos): the copy
--      of the old Video 40 now points to the new Video 40; both copies get the new
--      names; the copy of Video 41 moves from "Part A" to "Part D: Current Affairs".
--   4. Copies get the same YouTube/Bunny video and PDFs as their Crash Course lesson.

-- 1a. Hide the old Video 40 ("UK CA - State Schemes, Disaster Management, UK Awards").
--     Matched on "Disaster Management", which only the old title has.
update lessons l
set is_active = false, updated_at = now()
from packages p
where p.id = l.package_id and p.slug = 'crash-course'
  and l.title ~* '^\s*video\s*40\M' and l.title ~* 'disaster management'
  and l.is_active;

-- 1a-fix (22 Nov): the first version also hid the NEW Video 40 when its title
-- contained "State Schemes". Show the newest Video 40 that is not the old one.
update lessons l
set is_active = true, updated_at = now()
where l.id = (
  select x.id from lessons x join packages p on p.id = x.package_id
  where p.slug = 'crash-course' and x.title ~* '^\s*video\s*40\M' and x.title !~* 'disaster management'
  order by x.created_at desc limit 1
) and not l.is_active;

-- 1b. Name the new Video 40.
update lessons l
set title = 'Video 40: UK CA Part 1 – Appointments, Laws, Budget, Rankings, Schemes', updated_at = now()
from packages p
where p.id = l.package_id and p.slug = 'crash-course'
  and l.title ~* '^\s*video\s*40\M' and l.title !~* 'disaster management'
  and l.title <> 'Video 40: UK CA Part 1 – Appointments, Laws, Budget, Rankings, Schemes';

-- 2. Rename Video 41.
update lessons l
set title = 'Video 41: UK CA Part 2 – Projects, Defence, Environment, Awards, Sports', updated_at = now()
from packages p
where p.id = l.package_id and p.slug = 'crash-course'
  and l.title ~* '^\s*video\s*41\M'
  and l.title <> 'Video 41: UK CA Part 2 – Projects, Defence, Environment, Awards, Sports';

-- 3a. Copies of the old Video 40 now follow the new Video 40.
with old40 as (
  select l.id from lessons l join packages p on p.id = l.package_id
  where p.slug = 'crash-course' and l.title ~* '^\s*video\s*40\M' and l.title ~* 'disaster management'
), new40 as (
  select l.id from lessons l join packages p on p.id = l.package_id
  where p.slug = 'crash-course' and l.title = 'Video 40: UK CA Part 1 – Appointments, Laws, Budget, Rankings, Schemes'
  order by l.created_at desc limit 1
)
update lessons c
set source_lesson_id = (select id from new40), updated_at = now()
where c.source_lesson_id in (select id from old40)
  and exists (select 1 from new40);

-- 3b. New names for the copies (no "Video N" in copied titles).
update lessons c
set title = 'UK CA Part 1 – Appointments, Laws, Budget, Rankings, Schemes', updated_at = now()
from lessons s
where s.id = c.source_lesson_id
  and s.title = 'Video 40: UK CA Part 1 – Appointments, Laws, Budget, Rankings, Schemes'
  and c.title <> 'UK CA Part 1 – Appointments, Laws, Budget, Rankings, Schemes';

update lessons c
set title = 'UK CA Part 2 – Projects, Defence, Environment, Awards, Sports',
    section = case when c.section ilike 'Part A%' then 'Part D: Current Affairs' else c.section end,
    sort_order = case when c.section ilike 'Part A%' then 635 else c.sort_order end,
    updated_at = now()
from lessons s
where s.id = c.source_lesson_id
  and s.title = 'Video 41: UK CA Part 2 – Projects, Defence, Environment, Awards, Sports'
  and (c.title <> 'UK CA Part 2 – Projects, Defence, Environment, Awards, Sports' or c.section ilike 'Part A%');

-- 4. Same video and PDFs as the Crash Course lesson.
update lessons c
set youtube_id = s.youtube_id, bunny_video_id = s.bunny_video_id,
    pdf_en_path = s.pdf_en_path, pdf_hi_path = s.pdf_hi_path, updated_at = now()
from lessons s
where s.id = c.source_lesson_id
  and s.title in ('Video 40: UK CA Part 1 – Appointments, Laws, Budget, Rankings, Schemes',
                  'Video 41: UK CA Part 2 – Projects, Defence, Environment, Awards, Sports')
  and (c.youtube_id is distinct from s.youtube_id or c.bunny_video_id is distinct from s.bunny_video_id
       or c.pdf_en_path is distinct from s.pdf_en_path or c.pdf_hi_path is distinct from s.pdf_hi_path);

-- Check: every Video 40/41 lesson and copy, with its course and whether it is shown.
select p.package_name, l.title, l.section, l.is_active, l.youtube_id
from lessons l join packages p on p.id = l.package_id
where l.title ilike '%UK CA Part 1 –%' or l.title ilike '%UK CA Part 2 –%' or l.title ~* 'disaster management'
order by p.package_name, l.sort_order;
