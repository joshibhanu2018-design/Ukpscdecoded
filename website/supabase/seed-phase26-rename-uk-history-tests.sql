-- Phase 26: widen the statehood test to the whole 20th century (owner, Oct 2026).
-- The statehood-movement pool had run out of good questions, so the test now
-- also covers the 1900-1947 freedom struggle, and the Gorkha test stops at 1900.
-- Name only: same test ids, past results unaffected. Safe to re-run.
--   Uttarakhand (Post-Independence)          -> Uttarakhand: Freedom Struggle to Statehood (1900-2000)
--   Gorkha & British rule & Freedom Struggle -> Gorkha & British Rule (to 1900)

update tests set test_name = 'Uttarakhand: Freedom Struggle to Statehood (1900-2000)', updated_at = now()
where id = 'd5169d3e-b814-4696-9059-24eaf75227df';

update tests set test_name = 'Gorkha & British Rule (to 1900)', updated_at = now()
where id = '8a47502f-2bf2-4c4a-855b-d5f82ed3fc27';

-- Course descriptions that list the old name.
update packages
set description = replace(description, 'Uttarakhand (Post-Independence)', 'Uttarakhand: Freedom Struggle to Statehood (1900-2000)'),
    updated_at = now()
where description like '%Uttarakhand (Post-Independence)%';

-- Check: 2 rows with the new names.
select id, test_name from tests
where id in ('d5169d3e-b814-4696-9059-24eaf75227df', '8a47502f-2bf2-4c4a-855b-d5f82ed3fc27');
