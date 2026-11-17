-- UKPSC Decoded — Phase 47f: free samples for students to check quality (17 Nov 2026)
-- Safe to re-run. No DROP / DELETE / TRUNCATE. Only two flags are switched on:
--   lessons.is_free     (phase 29)  any logged-in student can watch it + open its PDF notes
--   tests.is_free_test              any logged-in student can attempt it
-- No question, attempt or enrollment is touched.
--
-- 1. Video: "Prehistory, Ancient Sources & Tribes, Kunindas, Katyuri" (UK History),
--    in every course that has it (Lower PCS Crash Course, Uttarakhand Crash Course,
--    Upper PCS crash course ...). The course page shows "Free sample · Watch now + PDF notes".
-- 2. Tests: the first ready topic test of the Uttarakhand Intensive Test Series and
--    the first ready test of the Current Affairs Test Series. Never a Revision test
--    (those belong only to the Revision Test Series). The course page shows "Free · Try now".
-- (The free Lower PCS mock is set up by lower-pcs-free-mock.sql.)

-- ========== 1. Free sample video ==========
update lessons set is_free = true, updated_at = now()
where title ilike '%Prehistory, Ancient Sources%'
  and is_active
  and is_free is distinct from true;

-- ========== 2. One free Uttarakhand test + one free Current Affairs test ==========
with firsts as (
  select distinct on (p.slug) t.id
  from packages p
  join package_tests pt on pt.package_id = p.id
  join tests t on t.id = pt.test_id
  where p.slug in ('uttarakhand-intensive', 'current-affairs-intensive')
    and coalesce(cardinality(t.question_ids), 0) > 0
    and (t.release_at is null or t.release_at <= now())
    and t.test_name not ilike '%revision%'
    and t.test_name not ilike '%mock%'
    and t.test_name not ilike '%topper%'
  order by p.slug, pt.test_order, t.test_name
)
update tests t set is_free_test = true, updated_at = now()
from firsts f
where t.id = f.id
  and t.is_free_test is distinct from true;

-- Check: the video row(s) and the two free tests.
select 'video' as kind, p.slug as course, l.title as name
from lessons l join packages p on p.id = l.package_id
where l.is_free and l.title ilike '%Prehistory, Ancient Sources%'
union all
select 'test', p.slug, t.test_name
from tests t
join package_tests pt on pt.test_id = t.id
join packages p on p.id = pt.package_id
where t.is_free_test
  and p.slug in ('uttarakhand-intensive', 'current-affairs-intensive')
order by 1, 2;
