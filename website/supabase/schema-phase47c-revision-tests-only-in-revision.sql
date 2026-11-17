-- UKPSC Decoded — Phase 47c: fixes to phase 47 asked for on 17 Nov 2026
-- Safe to re-run. No DROP / TRUNCATE. The one DELETE below removes only
-- package_tests link rows (which course lists a test); no test, question,
-- attempt or enrollment is deleted.
--
-- 1. Uttarakhand Revision 1-8 and CA Revision 1-6 were made from the Premium
--    Test Series questions, so they stay ONLY in the Revision Test Series.
--    Phase 47 had also put them in the Lower PCS Test Series, Uttarakhand
--    Intensive and Current Affairs Intensive: those links are removed.
-- 2. Basic Test Series: taken off the store (its buyers keep access).
-- 3. Revision Test Series and All Uttarakhand Rank Challenge (Mock Mahasangram):
--    no "2026" in their names and no "Upper PCS · 29 Nov" label on their cards.
-- 4. Test counts in the Lower PCS products, Uttarakhand GK Pack and Current
--    Affairs 2026 updated (Lower PCS Test Series: 67 tests, 44 live from day one).

-- ========== 1. Revision tests only in the Revision Test Series ==========
delete from package_tests pt
using packages p, tests t
where pt.package_id = p.id
  and pt.test_id = t.id
  and p.slug <> 'revision-test-series'
  and t.test_name ~* '^(uttarakhand|ca) revision \d+$';

-- ========== 2. Basic Test Series off the store ==========
update packages set metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object('listed', false), updated_at = now()
where slug = 'basic-test-series';

-- ========== 3. Revision + Rank Challenge: no 2026, no label ==========
update packages set
  package_name = btrim(regexp_replace(regexp_replace(package_name, '\m2026\M', '', 'g'), '\s{2,}', ' ', 'g')),
  metadata = (coalesce(metadata, '{}'::jsonb) - 'card_label')
    || case when metadata ? 'card_title'
            then jsonb_build_object('card_title', btrim(regexp_replace(regexp_replace(metadata->>'card_title', '\m2026\M', '', 'g'), '\s{2,}', ' ', 'g')))
            else '{}'::jsonb end,
  updated_at = now()
where slug in ('revision-test-series', 'mock-mahasangram');

-- ========== 4. Test counts ==========
update packages set
  description = 'UKPSC Lower PCS (27 Dec 2026) + RO/ARO Prelims (April 2027, same syllabus)
Lower PCS Crash Course: 65+ video lectures with PDF notes, incl. General Aptitude (CSAT) classes
Lower PCS & RO/ARO Test Series: 67 tests, 44 live from day one
Valid till 30 April 2027',
  highlights = '["65+ video lectures with PDF notes (English + Hindi)", "67 tests: 44 live from day one, 23 being added", "10 Full Length Tests on the Lower PCS pattern (100 GS + 50 Aptitude)", "12 CSAT (General Aptitude) sectional tests", "Lower PCS 2025 actual paper as a timed test", "Valid till 30 April 2027: Lower PCS + RO/ARO Prelims"]'::jsonb,
  faq = '[{"question":"Is RO/ARO Prelims really covered?","answer":"Yes. The UKPSC RO/ARO Prelims has the same pattern and syllabus as Lower PCS Prelims: 150 questions in 2 hours, 100 General Studies + 50 General Aptitude. The course stays valid till 30 April 2027."},{"question":"I bought the Upper PCS Crash Course or Premium Test Series. Do I need this?","answer":"No. You already have the GS videos and most of the tests. Add only the CSAT for Lower PCS / RO-ARO (₹499 for you) and, for TRI, the TRI Add-on."},{"question":"Are all videos and tests available now?","answer":"All existing videos and 44 tests open the day you buy. The new videos (orientation, land revenue, computer, CSAT classes) and the Lower PCS full length tests are added before the exam; you can see each one marked Coming soon."}]'::jsonb,
  metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
    'card_tagline', 'Crash Course (65+ videos + notes) + Test Series (67 tests). One course, two exams.'),
  updated_at = now()
where slug = 'lower-pcs-complete';

update packages set
  total_tests = 67,
  description = '67 tests for UKPSC Lower PCS (27 Dec 2026) and RO/ARO Prelims
44 tests live from day one: 20 Uttarakhand, 12 subject sectionals, 12 current affairs
Being added: Lower PCS 2025 actual paper, 10 Full Length Tests (100 GS + 50 Aptitude), 12 CSAT sectionals
Valid till 30 April 2027',
  highlights = '["44 tests live from day one", "10 Full Length Tests on the Lower PCS pattern", "12 CSAT (General Aptitude) sectional tests", "Lower PCS 2025 actual paper (timed)", "Analysis after every test", "Valid till 30 April 2027"]'::jsonb,
  metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
    'card_tagline', '67 tests: 44 live today + 10 Lower PCS Full Length Tests + 12 CSAT sectionals'),
  updated_at = now()
where slug = 'lower-pcs-test-series';

update packages set
  highlights = '["Uttarakhand Crash Course videos + PDF notes", "20 Uttarakhand GK tests", "Valid till 30 April 2027"]'::jsonb,
  metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object('card_tagline', 'Uttarakhand videos + notes + 20 Uttarakhand tests'),
  updated_at = now()
where slug = 'uttarakhand-gk-pack';

update packages set
  highlights = '["Current affairs videos, new ones added", "12 current affairs tests", "Valid till 30 April 2027"]'::jsonb,
  metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object('card_tagline', 'CA videos + 12 current affairs tests'),
  updated_at = now()
where slug = 'current-affairs-2026';

-- Check: revision tests should now be linked only to revision-test-series.
-- select p.slug, count(*) from package_tests pt join packages p on p.id = pt.package_id
--   join tests t on t.id = pt.test_id where t.test_name ~* '^(uttarakhand|ca) revision \d+$' group by 1;
select 'phase 47c ready' as status;
