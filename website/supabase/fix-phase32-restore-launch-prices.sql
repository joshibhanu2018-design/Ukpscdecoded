-- UKPSC Test Platform — Phase 32: launch (founding) prices back on
-- Safe to re-run: one UPDATE. No DROP / DELETE / TRUNCATE.
--
-- The founding price ended on 5 Oct 2026, so the store has shown regular
-- prices since then. This extends founding pricing to 29 Nov 2026 (Prelims
-- day) for every active package that has a lower founding price. Price cards
-- then read "Founding price ₹X till 29 November, then ₹Y". Flat-priced
-- packages (no founding tier) are unchanged.

-- 1. Preview (read-only): what each course costs now and after the change.
select slug, package_name, founding_price as launch_price, regular_price, founding_ends_at
from packages
where is_active and founding_price is not null and regular_price is not null and founding_price < regular_price
order by sort_order;

-- 2. Bring the launch prices back until 29 November 2026, 11:59 pm IST.
update packages set
  founding_ends_at = '2026-11-29 23:59:59+05:30',
  updated_at = now()
where is_active and founding_price is not null and regular_price is not null and founding_price < regular_price;
