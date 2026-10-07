-- UKPSC Test Platform — Phase 28: free access for the Google Play reviewer
-- Safe to re-run: INSERT only, skips packages the reviewer already has.
-- No DROP / DELETE / TRUNCATE.
--
-- Google's reviewers must see the paid content. Run this AFTER logging in
-- once as play.reviewer@ukpscdecoded.in (that first login creates the
-- account). Gives that one account every active package except mentorship
-- (which would list the reviewer as a mentee), valid till 31 Dec 2026.

insert into enrollments (user_id, package_id, payment_id, payment_status, status, product_type, access_valid_till)
select u.id, p.id, 'play-reviewer', 'completed', 'active', p.package_type, '2026-12-31 23:59:59'
from users u
join packages p on p.is_active = true and coalesce(p.package_type, '') <> 'mentorship'
where u.email = 'play.reviewer@ukpscdecoded.in'
  and not exists (
    select 1 from enrollments e
    where e.user_id = u.id and e.package_id = p.id and e.status = 'active'
  );

-- Check (should list every course / test series):
-- select p.package_name, e.status, e.access_valid_till
-- from enrollments e join packages p on p.id = e.package_id
-- join users u on u.id = e.user_id
-- where u.email = 'play.reviewer@ukpscdecoded.in' order by p.package_name;
