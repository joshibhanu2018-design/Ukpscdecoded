-- UKPSC Test Platform — Phase 40: Mock Mahasangram Mock 5 and 6 move to 22 and 25 Nov
-- Safe to re-run: two UPDATEs. No DROP / DELETE / TRUNCATE. Needs phase 37.
-- Mock 5 (Full Mock 11): Sun 22 Nov (was 24 Nov). Mock 6 (Full Mock 12): Wed 25 Nov (was 27 Nov).
-- Same times: opens 12 noon, last ranked start 6 pm, result + rank list 8 pm (IST; written in UTC).
-- The rest of the Revision Series timetable lives in website/content/finalMonthSchedule.json.

update tests t set
  release_at = v.opens::timestamptz,
  rank_until = v.last_start::timestamptz,
  result_at  = v.result::timestamptz,
  updated_at = now()
from (values
  ('2c34dcc0-1ff2-42bc-94d4-78f286ad91f1', '2026-11-22 06:30:00+00', '2026-11-22 12:30:00+00', '2026-11-22 14:30:00+00'),
  ('3865e0d9-7d4b-44ef-a2ec-0df07aad22d8', '2026-11-25 06:30:00+00', '2026-11-25 12:30:00+00', '2026-11-25 14:30:00+00')
) as v(id, opens, last_start, result)
where t.id = v.id::uuid;

update packages set
  description = replace(description, 'Mocks on 12, 15, 18, 21, 24 and 27 November', 'Mocks on 12, 15, 18, 21, 22 and 25 November'),
  updated_at = now()
where slug = 'mock-mahasangram';

-- Check (times show in UTC; add 5:30 for IST):
select test_name, release_at, rank_until, result_at from tests where live_series = 'mahasangram' order by release_at;
