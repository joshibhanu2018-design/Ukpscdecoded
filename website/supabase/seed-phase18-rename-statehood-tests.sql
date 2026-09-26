-- Phase 18: rename the two statehood tests (owner request). Name only:
-- same test ids and questions, past results unaffected. Safe to re-run.
--   Statehood Movement I  -> Uttarakhand (Post-Independence)
--   Statehood Movement II -> Uttarakhand Polity

update tests set test_name = 'Uttarakhand (Post-Independence)', updated_at = now()
where id = 'd5169d3e-b814-4696-9059-24eaf75227df';

update tests set test_name = 'Uttarakhand Polity', updated_at = now()
where id = '43202535-bb0f-4bd7-9700-5c80a7fcaf76';

-- Course descriptions that listed the old names (covers either earlier wording).
update packages
set description = replace(replace(description,
      'Statehood Movement I & II', 'Uttarakhand (Post-Independence), Uttarakhand Polity'),
      'Uttarakhand (Post-Independence), Statehood Movement II', 'Uttarakhand (Post-Independence), Uttarakhand Polity'),
    updated_at = now()
where description like '%Statehood Movement%';

-- Check: 2 rows with the new names.
select id, test_name from tests
where id in ('d5169d3e-b814-4696-9059-24eaf75227df', '43202535-bb0f-4bd7-9700-5c80a7fcaf76');
