-- UKPSC Test Platform — Phase 19: recorded video lessons (crash course)
-- Safe: no DROP TABLE/DELETE/TRUNCATE; CREATE ... IF NOT EXISTS only.
--
-- Lessons are unlisted YouTube videos shown inside the course page to
-- enrolled students. lesson_views records the first time each student
-- opened each lesson — this is the "videos watched" count the refund
-- rule uses (refund only if fewer than 3 watched).

create table if not exists lessons (
  id uuid primary key default extensions.uuid_generate_v4(),
  package_id uuid not null references packages(id) on delete cascade,
  title text not null,
  description text,
  youtube_id text not null,
  sort_order int not null default 0,
  release_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists lessons_package_idx on lessons (package_id, sort_order);

alter table lessons enable row level security;
revoke all on lessons from anon, authenticated;

create table if not exists lesson_views (
  user_id uuid not null references users(id) on delete cascade,
  lesson_id uuid not null references lessons(id) on delete cascade,
  first_viewed_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

alter table lesson_views enable row level security;
revoke all on lesson_views from anon, authenticated;

select 'lessons ready' as status;
