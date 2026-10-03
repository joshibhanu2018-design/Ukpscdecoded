-- Phase 26: Rename 4 Uttarakhand topic tests after October 2026 quality review
-- Safer way: update test_name in both tests and packages tables with ON CONFLICT handling

-- Update tests table (4 test name changes)
UPDATE tests SET test_name = 'Uttarakhand: Freedom Struggle to Statehood (1900-2000)'
WHERE test_name = 'Uttarakhand (Post-Independence)'
ON CONFLICT (test_name) DO NOTHING;

UPDATE tests SET test_name = 'Gorkha & British Rule (to 1900)'
WHERE test_name = 'Gorkha & British rule & Freedom Struggle'
ON CONFLICT (test_name) DO NOTHING;

UPDATE tests SET test_name = 'Demography, Society & Tribes'
WHERE test_name = 'Demography & Census'
ON CONFLICT (test_name) DO NOTHING;

UPDATE tests SET test_name = 'Economy, Budget & State Schemes'
WHERE test_name = 'Economy Development & Budget'
ON CONFLICT (test_name) DO NOTHING;

-- Update packages table to match (both title and slug for consistency)
UPDATE packages SET title = 'Uttarakhand: Freedom Struggle to Statehood (1900-2000)'
WHERE title = 'Uttarakhand (Post-Independence)'
ON CONFLICT DO NOTHING;

UPDATE packages SET title = 'Gorkha & British Rule (to 1900)'
WHERE title = 'Gorkha & British rule & Freedom Struggle'
ON CONFLICT DO NOTHING;

UPDATE packages SET title = 'Demography, Society & Tribes'
WHERE title = 'Demography & Census'
ON CONFLICT DO NOTHING;

UPDATE packages SET title = 'Economy, Budget & State Schemes'
WHERE title = 'Economy Development & Budget'
ON CONFLICT DO NOTHING;

-- Verify the 4 tests now have their new names
SELECT test_name FROM tests
WHERE test_name IN (
  'Uttarakhand: Freedom Struggle to Statehood (1900-2000)',
  'Gorkha & British Rule (to 1900)',
  'Demography, Society & Tribes',
  'Economy, Budget & State Schemes'
)
ORDER BY test_name;
