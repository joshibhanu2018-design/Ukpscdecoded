-- UKPSC Decoded — Phase 47b: Upper PCS 2027 products (run on Mon 30 Nov 2026)
-- Safe to re-run: UPDATEs only. No DROP / DELETE / TRUNCATE.
-- Run it in Supabase → SQL Editor on 30 Nov (the day after Upper PCS Prelims),
-- after phase 47 is live.
--
-- What it does
--  * crash-course          → "Upper PCS Video Revision Program", ₹2,499, back on the Upper PCS page
--  * complete-prelims-pack → "Upper PCS 2027 Complete", ₹3,599, on sale again (its 25 Nov stop is removed)
--  * premium-test-series   → "Upper PCS 2027 Test Series", ₹1,499
--  * New buyers of these three get access till 31 Dec 2027. Old buyers keep the
--    date they bought with (that lives on their enrollment row, not here).
--  * The "Upper PCS · 29 Nov" label goes. Revision Test Series, Basic Test Series
--    and Mock Mahasangram already stopped selling by themselves (sale_ends_at),
--    so they need nothing here; their buyers keep access.
--  * The 29 Nov offer prices from phase 38 are cleared on these three.

-- Upper PCS Video Revision Program (the old Crash Course)
update packages set
  package_name = 'Upper PCS Video Revision Program',
  price = 2499, founding_price = null, regular_price = null, founding_ends_at = null,
  access_valid_till = '2027-12-31',
  metadata = (coalesce(metadata, '{}'::jsonb) - 'card_label' - 'sale_ends_at') || jsonb_build_object(
    'exam_tab', 'upper', 'listed', true,
    'card_title', 'Upper PCS Video Revision Program',
    'card_tagline', 'Complete revision of Upper PCS GS on video, with PDF notes'),
  updated_at = now()
where slug = 'crash-course';

-- Upper PCS 2027 Complete (the old Complete Prelims Pack)
update packages set
  package_name = 'Upper PCS 2027 Complete',
  price = 3599, founding_price = null, regular_price = null, founding_ends_at = null,
  access_valid_till = '2027-12-31',
  metadata = (coalesce(metadata, '{}'::jsonb) - 'card_label' - 'sale_ends_at') || jsonb_build_object(
    'exam_tab', 'upper', 'listed', true,
    'card_title', 'Upper PCS 2027 Complete',
    'card_tagline', 'Video Revision Program + Upper PCS 2027 Test Series'),
  updated_at = now()
where slug = 'complete-prelims-pack';

-- Upper PCS 2027 Test Series (the old Premium Test Series)
update packages set
  package_name = 'Upper PCS 2027 Test Series',
  price = 1499, founding_price = null, regular_price = null, founding_ends_at = null,
  access_valid_till = '2027-12-31',
  metadata = (coalesce(metadata, '{}'::jsonb) - 'card_label' - 'sale_ends_at') || jsonb_build_object(
    'exam_tab', 'upper', 'listed', true,
    'card_title', 'Upper PCS 2027 Test Series',
    'card_tagline', 'The full Upper PCS test series, kept up to date for 2027'),
  updated_at = now()
where slug = 'premium-test-series';

-- Check:
-- select slug, package_name, price, founding_price, access_valid_till, metadata->>'listed' listed,
--        metadata->>'card_label' label, metadata->>'sale_ends_at' sale_ends
-- from packages where metadata->>'exam_tab' = 'upper' order by sort_order;
select 'phase 47b upper pcs 2027 ready' as status;
