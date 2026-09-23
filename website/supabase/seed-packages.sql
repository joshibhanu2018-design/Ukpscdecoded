-- UKPSC Test Platform — package store seed data
-- Not run yet — you'll run this. Run schema-phase2b.sql FIRST (this file
-- inserts package_includes rows for the two combo bundles, which needs
-- that table to exist).
--
-- Re-runnable: every insert is keyed on a fixed id with
-- ON CONFLICT ... DO UPDATE, so running this twice updates rows in place
-- rather than duplicating them.
--
-- No fake pricing: original_price/discount_percentage are left at their
-- defaults (null/0) everywhere — nothing here invents an "original price"
-- to fake a discount. Every saving shown on the store page is computed
-- from these real prices via package_includes, not stored as a number.
--
-- sort_order: display order within each package_type section on the
-- store page (ascending). Left in increments of 10 so packages can be
-- inserted between existing ones later without renumbering everything.
-- The store page and dashboard order by this column, not price — change
-- the values here (and re-run) to reorder, no code changes needed.
alter table packages add column if not exists sort_order integer not null default 0;

-- ========== Test series ==========

insert into packages (id, package_name, description, price, package_type, total_tests, total_questions, access_valid_till, sort_order, is_active)
values (
  'fa2c4a38-d430-42ce-905d-375bd8af5ca9',
  'Premium Bundle',
  '12 Full Mock Tests (150 Questions each)
12 Sectional Tests (50 Questions each)
20 Uttarakhand GK Tests (50 Questions each)
12 Current Affairs Tests (50 Questions each)
6 CSAT Tests (100 Questions each)',
  1599, 'test_series', 62, 4600, '2026-12-31', 10, true
)
on conflict (id) do update set
  package_name = excluded.package_name, description = excluded.description, price = excluded.price,
  package_type = excluded.package_type, total_tests = excluded.total_tests, total_questions = excluded.total_questions,
  access_valid_till = excluded.access_valid_till, sort_order = excluded.sort_order, is_active = excluded.is_active, updated_at = now();

insert into packages (id, package_name, description, price, package_type, total_tests, total_questions, access_valid_till, sort_order, is_active)
values (
  '4d7dff5c-641b-4f8a-b8ac-57766d5fa757',
  'Standard',
  '12 Full Mock Tests (150 Questions each)
12 Sectional Tests (50 Questions each)',
  799, 'test_series', 24, 2400, '2026-12-31', 20, true
)
on conflict (id) do update set
  package_name = excluded.package_name, description = excluded.description, price = excluded.price,
  package_type = excluded.package_type, total_tests = excluded.total_tests, total_questions = excluded.total_questions,
  access_valid_till = excluded.access_valid_till, sort_order = excluded.sort_order, is_active = excluded.is_active, updated_at = now();

insert into packages (id, package_name, description, price, package_type, total_tests, total_questions, access_valid_till, sort_order, is_active)
values (
  '6e868c4b-08a2-4bbe-a78a-2144a69a4288',
  'Basic',
  '6 Full Mock Tests (150 Questions each)
6 Sectional Tests (50 Questions each)',
  499, 'test_series', 12, 1200, '2026-12-31', 30, true
)
on conflict (id) do update set
  package_name = excluded.package_name, description = excluded.description, price = excluded.price,
  package_type = excluded.package_type, total_tests = excluded.total_tests, total_questions = excluded.total_questions,
  access_valid_till = excluded.access_valid_till, sort_order = excluded.sort_order, is_active = excluded.is_active, updated_at = now();

insert into packages (id, package_name, description, price, package_type, total_tests, total_questions, access_valid_till, sort_order, is_active)
values (
  '368ea0df-d24c-4857-a3c3-66ba5858f1d2',
  'Uttarakhand Intensive',
  '20 Uttarakhand GK Tests (50 Questions each)',
  599, 'test_series', 20, 1000, '2026-12-31', 40, true
)
on conflict (id) do update set
  package_name = excluded.package_name, description = excluded.description, price = excluded.price,
  package_type = excluded.package_type, total_tests = excluded.total_tests, total_questions = excluded.total_questions,
  access_valid_till = excluded.access_valid_till, sort_order = excluded.sort_order, is_active = excluded.is_active, updated_at = now();

insert into packages (id, package_name, description, price, package_type, total_tests, total_questions, access_valid_till, sort_order, is_active)
values (
  'c100e8b1-0929-429d-9e16-d2255f1bddad',
  'Current Affairs Intensive',
  '12 Current Affairs Tests (50 Questions each)',
  399, 'test_series', 12, 600, '2026-12-31', 50, true
)
on conflict (id) do update set
  package_name = excluded.package_name, description = excluded.description, price = excluded.price,
  package_type = excluded.package_type, total_tests = excluded.total_tests, total_questions = excluded.total_questions,
  access_valid_till = excluded.access_valid_till, sort_order = excluded.sort_order, is_active = excluded.is_active, updated_at = now();

insert into packages (id, package_name, description, price, package_type, total_tests, total_questions, access_valid_till, sort_order, is_active)
values (
  'fb0bccf7-9649-4161-9e5c-c441c743f6a8',
  'CSAT',
  '6 CSAT Tests (100 Questions each)',
  249, 'test_series', 6, 600, '2026-12-31', 60, true
)
on conflict (id) do update set
  package_name = excluded.package_name, description = excluded.description, price = excluded.price,
  package_type = excluded.package_type, total_tests = excluded.total_tests, total_questions = excluded.total_questions,
  access_valid_till = excluded.access_valid_till, sort_order = excluded.sort_order, is_active = excluded.is_active, updated_at = now();

-- ========== Crash course (video) ==========

insert into packages (id, package_name, description, price, package_type, total_tests, total_questions, access_valid_till, metadata, sort_order, is_active)
values (
  'aa67a65e-9e92-47ac-bdbd-ebef3c81d2f4',
  'Crash Course for UKPSC Upper & Lower PCS 2026 and TRI Exam',
  'Live crash course classes for UKPSC Upper & Lower PCS 2026 and TRI Exam
Classes: 2 October - 2 November 2026
Recordings available till 31 December 2026',
  2699, 'video_course', 0, 0, '2026-12-31',
  '{"class_start": "2026-10-02", "class_end": "2026-11-02"}'::jsonb,
  10,
  true
)
on conflict (id) do update set
  package_name = excluded.package_name, description = excluded.description, price = excluded.price,
  package_type = excluded.package_type, total_tests = excluded.total_tests, total_questions = excluded.total_questions,
  access_valid_till = excluded.access_valid_till, metadata = excluded.metadata, sort_order = excluded.sort_order,
  is_active = excluded.is_active, updated_at = now();

-- ========== Combo bundles ==========
-- Test/question counts mirror the included test-series package, since a
-- combo grants that same content plus the crash course.

insert into packages (id, package_name, description, price, package_type, total_tests, total_questions, access_valid_till, sort_order, is_active)
values (
  '91261f68-c543-406c-8c2c-485beac736cb',
  'Standard Test Series + Crash Course',
  'Everything in Standard (12 Full Mock + 12 Sectional Tests)
Plus the full Crash Course for UKPSC Upper & Lower PCS 2026 and TRI Exam',
  3249, 'combo_bundle', 24, 2400, '2026-12-31', 20, true
)
on conflict (id) do update set
  package_name = excluded.package_name, description = excluded.description, price = excluded.price,
  package_type = excluded.package_type, total_tests = excluded.total_tests, total_questions = excluded.total_questions,
  access_valid_till = excluded.access_valid_till, sort_order = excluded.sort_order, is_active = excluded.is_active, updated_at = now();

insert into packages (id, package_name, description, price, package_type, total_tests, total_questions, access_valid_till, sort_order, is_active)
values (
  '47519f69-eb7b-42cd-8e85-1b3f28e980f7',
  'Premium Test Series + Crash Course',
  'Everything in Premium Bundle (62 tests across Full Mock, Sectional, Uttarakhand GK, Current Affairs and CSAT)
Plus the full Crash Course for UKPSC Upper & Lower PCS 2026 and TRI Exam',
  3799, 'combo_bundle', 62, 4600, '2026-12-31', 10, true
)
on conflict (id) do update set
  package_name = excluded.package_name, description = excluded.description, price = excluded.price,
  package_type = excluded.package_type, total_tests = excluded.total_tests, total_questions = excluded.total_questions,
  access_valid_till = excluded.access_valid_till, sort_order = excluded.sort_order, is_active = excluded.is_active, updated_at = now();

-- ========== Package contents (package_includes) ==========
-- For combo_bundle packages, these rows drive BOTH dashboard unlocking
-- ("owning the combo unlocks both component packages") and the store
-- page's real-savings calculation (sum of included prices vs bundle
-- price). Application code should only treat a package_includes row as
-- entitlement-granting when the parent package's product_type is
-- 'combo_bundle' — see the Premium Bundle rows below, which use the same
-- table purely for the savings calculation (Premium is a monolithic
-- test_series package; owning it does not separately unlock Standard/
-- Uttarakhand Intensive/Current Affairs Intensive/CSAT as extra
-- enrollments).

insert into package_includes (combo_package_id, included_package_id) values
  ('91261f68-c543-406c-8c2c-485beac736cb', '4d7dff5c-641b-4f8a-b8ac-57766d5fa757'), -- Standard+Crash -> Standard
  ('91261f68-c543-406c-8c2c-485beac736cb', 'aa67a65e-9e92-47ac-bdbd-ebef3c81d2f4'), -- Standard+Crash -> Crash Course
  ('47519f69-eb7b-42cd-8e85-1b3f28e980f7', 'fa2c4a38-d430-42ce-905d-375bd8af5ca9'), -- Premium+Crash -> Premium Bundle
  ('47519f69-eb7b-42cd-8e85-1b3f28e980f7', 'aa67a65e-9e92-47ac-bdbd-ebef3c81d2f4'), -- Premium+Crash -> Crash Course
  -- Premium Bundle's contents exactly equal these 4 standalone packages
  -- (12 Full Mock + 12 Sectional + 20 Uttarakhand + 12 CA + 6 CSAT) —
  -- informational only, NOT entitlement-granting (see note above).
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', '4d7dff5c-641b-4f8a-b8ac-57766d5fa757'), -- Premium Bundle -> Standard
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', '368ea0df-d24c-4857-a3c3-66ba5858f1d2'), -- Premium Bundle -> Uttarakhand Intensive
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'c100e8b1-0929-429d-9e16-d2255f1bddad'), -- Premium Bundle -> Current Affairs Intensive
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'fb0bccf7-9649-4161-9e5c-c441c743f6a8')  -- Premium Bundle -> CSAT
on conflict (combo_package_id, included_package_id) do nothing;
