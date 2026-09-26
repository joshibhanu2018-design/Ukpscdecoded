-- Phase 18: rename "Statehood Movement I" to "Uttarakhand (Post-Independence)".
-- Same test (same id, same questions, past results unaffected) — name only.
-- Safe to run more than once.

update tests
set test_name = 'Uttarakhand (Post-Independence)', updated_at = now()
where id = 'd5169d3e-b814-4696-9059-24eaf75227df';

-- Course descriptions that listed the old name.
update packages
set description = replace(description, 'Statehood Movement I & II', 'Uttarakhand (Post-Independence), Statehood Movement II'),
    updated_at = now()
where description like '%Statehood Movement I & II%';

-- Check: should return 1 row with the new name.
select id, test_name from tests where id = 'd5169d3e-b814-4696-9059-24eaf75227df';
