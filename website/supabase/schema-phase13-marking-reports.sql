-- UKPSC Test Platform — Phase 13: 1/4 negative marking, question error reports
-- Not run yet. Safe to re-run: UPDATEs recompute the same values, ADD COLUMN /
-- CREATE ... IF NOT EXISTS, no DROP/DELETE/TRUNCATE.

-- ========== negative marking: one-quarter, not one-third ==========
-- negative_marking_value is a FRACTION of marks_per_question.
alter table tests alter column negative_marking_value set default 0.25;
update tests set negative_marking_value = 0.25, updated_at = now()
where negative_marking_value is distinct from 0.25;

-- Re-score attempts already submitted under 0.33, so stored scores (used for
-- percentile, My Performance, mentee dashboard) match what the result page
-- now shows. Correct/wrong counts come from results.question_performance.
with counts as (
  select r.attempt_id,
         count(*) filter (where (q->>'is_correct')::boolean) as correct,
         count(*) filter (where q->>'selected' is not null and not (q->>'is_correct')::boolean) as wrong
  from results r, jsonb_array_elements(r.question_performance) q
  group by r.attempt_id
),
rescored as (
  select a.id,
         round(c.correct * t.marks_per_question
               - c.wrong * case when t.negative_marking_enabled then t.marks_per_question * t.negative_marking_value else 0 end, 2) as score
  from attempts a
  join counts c on c.attempt_id = a.id
  join tests t on t.id = a.test_id
  where a.status = 'submitted'
)
update attempts a
set score = s.score,
    percentage = case when a.total_marks > 0 then round(s.score / a.total_marks * 100, 2) else 0 end
from rescored s
where s.id = a.id and a.score is distinct from s.score;

update results r
set overall_score = a.score
from attempts a
where a.id = r.attempt_id and a.status = 'submitted' and r.overall_score is distinct from a.score;

-- ========== withdrawing a question ==========
-- questions.status = 'inactive' removes a question from attempts started
-- after deactivated_at; attempts started before it keep it (so past results
-- render and score exactly as taken).
alter table questions add column if not exists deactivated_at timestamptz;

-- ========== "Report error / गलती बताएँ" ==========
create table if not exists question_reports (
  id uuid primary key default extensions.uuid_generate_v4(),
  question_id uuid not null references questions(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  attempt_id uuid references attempts(id) on delete set null,
  reason text not null check (reason in ('wrong_answer', 'wrong_question', 'translation', 'typo', 'other')),
  note text check (char_length(note) <= 1000),
  status text not null default 'open' check (status in ('open', 'resolved', 'deactivated')),
  resolved_by uuid references users(id),
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

-- One open report per student per question (re-reporting updates it).
create unique index if not exists question_reports_one_open
  on question_reports (user_id, question_id) where status = 'open';
create index if not exists question_reports_status_idx on question_reports (status, created_at desc);
create index if not exists question_reports_question_idx on question_reports (question_id);

alter table question_reports enable row level security;
revoke all on question_reports from anon, authenticated;
