-- UKPSC Test Platform — Phase 6a: course-detail content + banners
-- Run FIRST of the phase 6 files. Not run yet. Safe: no DROP/DELETE/
-- TRUNCATE, ADD COLUMN IF NOT EXISTS, CREATE TABLE IF NOT EXISTS.

-- ========== packages: course detail page content ==========
alter table packages add column if not exists slug text unique;
alter table packages add column if not exists image_url text;
alter table packages add column if not exists highlights jsonb not null default '[]'::jsonb;
alter table packages add column if not exists curriculum jsonb not null default '[]'::jsonb;
alter table packages add column if not exists faq jsonb not null default '[]'::jsonb;

comment on column packages.slug is 'URL slug for /courses/[slug] and /checkout/[slug]. Unique.';
comment on column packages.image_url is 'Course card/detail image. Null = UI falls back to a styled placeholder.';
comment on column packages.highlights is 'Array of short strings shown as bullet highlights on the store card and detail page.';
comment on column packages.curriculum is 'Array of {title} — e.g. the crash course''s lecture list. Editable directly via SQL/admin, no code change needed to update it.';
comment on column packages.faq is 'Array of {question, answer} shown on the course detail page.';

create unique index if not exists packages_slug_idx on packages(slug);

-- ========== banners: home page carousel, DB-driven ==========
create table if not exists banners (
  id uuid primary key default extensions.uuid_generate_v4(),
  package_id uuid references packages(id) on delete cascade,
  title text not null,
  subtitle text,
  gradient_from text not null default '#f59307',
  gradient_to text not null default '#78300d',
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (package_id) -- one banner per course; also the ON CONFLICT target for the idempotent seed insert
);

create index if not exists banners_sort_order_idx on banners(sort_order) where is_active;

alter table banners enable row level security;
-- Same deny-all pattern as the rest of this schema — the home page is a
-- Next.js server component and always reads via the service role key
-- (src/lib/supabase.ts), regardless of whether the visitor is logged in,
-- so there's no need for a public anon-read exception here.
revoke all on banners from anon, authenticated;

-- ========== tests: subject, for the course detail test list ==========
alter table tests add column if not exists subject text;

comment on column tests.subject is 'e.g. "Polity", "Uttarakhand GK", "Current Affairs" — shown on the course detail page''s test list.';

-- ========== package_tests: idempotency target ==========
-- The pre-existing package_tests table has no unique constraint, so an
-- idempotent seed insert (ON CONFLICT ...) has nothing to target — this
-- adds one. Safe: the table is currently empty.
create unique index if not exists package_tests_package_test_idx on package_tests(package_id, test_id);
