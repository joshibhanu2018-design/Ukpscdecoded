-- Phase 26: new headings for four Uttarakhand topic tests (owner, Oct 2026).
-- Their topics had run out of good questions, so each test now covers a wider
-- (related) topic. Name only: same test ids, past results unaffected. Safe to re-run.
--   Uttarakhand (Post-Independence)          -> Uttarakhand: Freedom Struggle to Statehood (1900-2000)
--   Gorkha & British rule & Freedom Struggle -> Gorkha & British Rule (to 1900)
--   Demography & Census                      -> Demography, Society & Tribes
--   Economy Development & Budget             -> Economy, Budget & State Schemes

update tests set test_name = 'Uttarakhand: Freedom Struggle to Statehood (1900-2000)', updated_at = now()
where id = 'd5169d3e-b814-4696-9059-24eaf75227df';

update tests set test_name = 'Gorkha & British Rule (to 1900)', updated_at = now()
where id = '8a47502f-2bf2-4c4a-855b-d5f82ed3fc27';

update tests set test_name = 'Demography, Society & Tribes', updated_at = now()
where id = 'e53ec218-2462-4fbd-b306-98c3787dc0ac';

update tests set test_name = 'Economy, Budget & State Schemes', updated_at = now()
where id = 'fca7e5c8-393f-4b3d-a3c7-4ab2f5303ea6';

-- Course descriptions that list the old name.
update packages
set description = replace(description, 'Uttarakhand (Post-Independence)', 'Uttarakhand: Freedom Struggle to Statehood (1900-2000)'),
    updated_at = now()
where description like '%Uttarakhand (Post-Independence)%';

update packages
set description = replace(description, 'forests, demography, polity, economy & budget,', 'forests, demography & society, polity, economy, budget & state schemes,'),
    updated_at = now()
where description like '%forests, demography, polity, economy & budget,%';

-- Check: 4 rows with the new names.
select id, test_name from tests
where id in ('d5169d3e-b814-4696-9059-24eaf75227df', '8a47502f-2bf2-4c4a-855b-d5f82ed3fc27',
             'e53ec218-2462-4fbd-b306-98c3787dc0ac', 'fca7e5c8-393f-4b3d-a3c7-4ab2f5303ea6');
