-- UKPSC Decoded — Phase 48 (24 Nov 2026): Lower PCS upgrades for Upper PCS buyers
-- Safe to re-run: guarded INSERTs and UPDATEs only. No DROP / DELETE / TRUNCATE.
-- Run the whole file once in Supabase -> SQL Editor, BEFORE merging the pull request.
--
-- Students who bought the Premium Test Series, the Complete Prelims Pack or the
-- Prelims Mentorship see three offers at the top of "My Courses" after they log in:
--   1. Lower PCS & RO/ARO Test Series (Lower PCS FLT 1-10 + 2025 paper + the rest)  ₹499 (others ₹1,299)
--   2. CSAT for Lower PCS / RO-ARO (classes + CSAT Test Series)                    ₹499 (others ₹799)
--   3. NEW combo: both of the above                                                 ₹749 (others ₹2,098)
-- The lower price is applied automatically at checkout (metadata.upgrade_from),
-- only for logged-in owners of those packages. Nobody loses anything.

-- ========== 1. Lower PCS Test Series: ₹499 for Upper PCS buyers ==========
update packages set
  metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
    'upgrade_from', jsonb_build_object('premium-test-series', 499, 'complete-prelims-pack', 499, 'prelims-mentorship', 499)),
  updated_at = now()
where slug = 'lower-pcs-test-series';

-- ========== 2. CSAT for Lower PCS: keep ₹499, add Mentorship owners ==========
update packages set
  metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
    'upgrade_from', coalesce(metadata -> 'upgrade_from', '{}'::jsonb) || jsonb_build_object('prelims-mentorship', 499)),
  updated_at = now()
where slug = 'lower-pcs-csat';

-- ========== 3. New combo: Lower PCS Test Series + CSAT, ₹749 for Upper PCS buyers ==========
insert into packages (id, package_name, price, package_type, is_active, slug, created_at, updated_at)
select gen_random_uuid(), 'Lower PCS Tests + CSAT (Upper PCS students)', 2098, 'combo_bundle', true,
       'lower-pcs-tests-csat-upgrade', now(), now()
where not exists (select 1 from packages where slug = 'lower-pcs-tests-csat-upgrade');

update packages set
  package_name = 'Lower PCS Tests + CSAT (Upper PCS students)',
  package_type = 'combo_bundle',
  price = 2098, regular_price = null, founding_price = null, founding_ends_at = null,
  is_active = true,
  access_valid_till = '2027-04-30',
  validity_days = null,
  seats_total = null,
  discount_percentage = null,
  original_price = null,
  sort_order = 95,
  curriculum = '[]'::jsonb,
  faq = '[]'::jsonb,
  description = 'For students who already have the Premium Test Series or Complete Prelims Pack
Lower PCS & RO/ARO Test Series: Lower PCS full-length tests 1-10, the Lower PCS 2025 paper and all the Lower PCS tests
CSAT for Lower PCS / RO-ARO: 14 CSAT classes + CSAT Test Series
Valid till 30 April 2027',
  highlights = '["Lower PCS & RO/ARO Test Series (full-length tests 1-10 + 2025 paper)", "CSAT for Lower PCS / RO-ARO: 14 classes + CSAT Test Series", "₹749 for Premium / Complete Pack students", "Valid till 30 April 2027"]'::jsonb,
  metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
    'exam_tab', 'lower', 'listed', false,
    'card_title', 'Lower PCS Tests + CSAT',
    'card_tagline', 'Lower PCS full-length tests + CSAT classes and tests',
    'separate_total', false,
    'upgrade_from', jsonb_build_object('premium-test-series', 749, 'complete-prelims-pack', 749, 'prelims-mentorship', 749)),
  updated_at = now()
where slug = 'lower-pcs-tests-csat-upgrade';

insert into package_includes (combo_package_id, included_package_id)
select c.id, i.id
from (values
  ('lower-pcs-tests-csat-upgrade', 'lower-pcs-test-series'),
  ('lower-pcs-tests-csat-upgrade', 'lower-pcs-csat'),
  ('lower-pcs-tests-csat-upgrade', 'lower-pcs-csat-classes'),
  ('lower-pcs-tests-csat-upgrade', 'lower-pcs-csat-tests')
) as v(combo, inc)
join packages c on c.slug = v.combo
join packages i on i.slug = v.inc
where not exists (
  select 1 from package_includes pi where pi.combo_package_id = c.id and pi.included_package_id = i.id
);

-- Check (three rows; upgrade_from must list the Upper PCS packages):
select slug, package_name, price, metadata -> 'upgrade_from' as upgrade_from, metadata ->> 'listed' as listed
from packages
where slug in ('lower-pcs-test-series', 'lower-pcs-csat', 'lower-pcs-tests-csat-upgrade')
order by slug;
