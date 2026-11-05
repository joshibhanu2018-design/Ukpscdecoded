-- UKPSC Test Platform — Phase 46: every course valid till 15 January 2027
-- Safe to re-run. No DROP / DELETE / TRUNCATE. Only ever extends access, never shortens it.
--
-- 1. Packages: new buyers get access till 15 Jan 2027 (was 31 Dec 2026).
-- 2. Enrollments: students who already bought, and whose access is still running,
--    get the same 15 Jan date. enrollments.access_valid_till is stored in UTC,
--    so 15 Jan 11:59:59 pm India time = 2027-01-15 18:29:59.

update packages
set access_valid_till = date '2027-01-15', updated_at = now()
where access_valid_till is not null
  and access_valid_till < date '2027-01-15';

update enrollments
set access_valid_till = timestamp '2027-01-15 18:29:59'
where access_valid_till is not null
  and access_valid_till >= (now() at time zone 'utc')
  and access_valid_till < timestamp '2027-01-15 18:29:59';

-- Checks: every row should show 2027-01-15.
select access_valid_till, count(*) as packages from packages where is_active group by 1 order by 1;
select access_valid_till::date as valid_till, count(*) as active_enrollments
from enrollments where access_valid_till >= (now() at time zone 'utc') group by 1 order by 1;
