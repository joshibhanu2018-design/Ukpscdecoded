-- UKPSC Decoded — Phase 47d (17 Nov 2026). Safe to re-run. UPDATEs only.
--
-- 1. Revision Test Series and the All Uttarakhand Rank Challenge say "2026" in
--    their names (menu, cards, pages), so students see they are for the
--    Upper PCS Prelims 2026 (29 Nov). Their card label comes back too.
-- 2. "Save X%" on bundles: only where the parts are really sold on their own.
--    The TRI Add-on, CSAT, Uttarakhand GK Pack and Current Affairs 2026 are made
--    of parts that aren't sold separately, so no saving is shown for them.

update packages set
  package_name = 'Revision Test Series 2026',
  metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
    'card_title', 'Revision Test Series 2026', 'card_label', 'Upper PCS 2026 · 29 Nov'),
  updated_at = now()
where slug = 'revision-test-series';

update packages set
  package_name = 'Mock Mahasangram - All Uttarakhand Rank Challenge 2026',
  metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
    'card_title', 'All Uttarakhand Rank Challenge 2026', 'card_label', 'Upper PCS 2026 · 29 Nov'),
  updated_at = now()
where slug = 'mock-mahasangram';

update packages set metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object('separate_total', false), updated_at = now()
where slug in ('tri-addon', 'lower-pcs-csat', 'uttarakhand-gk-pack', 'current-affairs-2026');

-- Check:
-- select slug, package_name, metadata->>'card_title', metadata->>'card_label', metadata->'separate_total'
-- from packages where slug in ('revision-test-series','mock-mahasangram','tri-addon','lower-pcs-csat','uttarakhand-gk-pack','current-affairs-2026');
select 'phase 47d ready' as status;
