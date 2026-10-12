-- UKPSC Test Platform — Phase 34: daily Telegram MCQ quizzes
-- Safe to re-run. No DROP / DELETE / TRUNCATE.
--
-- /api/cron/telegram-mcq posts 7 quiz polls a day to the Telegram channel
-- from active question-bank questions that are in no test and were never
-- posted before. This table remembers what was posted.

create table if not exists telegram_posted_questions (
  question_id uuid primary key references questions(id) on delete cascade,
  posted_at timestamptz not null default now()
);
create index if not exists telegram_posted_questions_posted_at on telegram_posted_questions (posted_at);
alter table telegram_posted_questions enable row level security;

-- Questions still available for Telegram: active, in no test, never posted.
create or replace view telegram_unused_questions as
select q.id, q.subject, q.topic,
       q.question_text_english, q.question_text_hindi,
       q.option_a_english, q.option_b_english, q.option_c_english, q.option_d_english,
       q.option_a_hindi, q.option_b_hindi, q.option_c_hindi, q.option_d_hindi,
       q.correct_answer, q.explanation_english, q.explanation_hindi
from questions q
where coalesce(q.status, 'active') = 'active'
  and not exists (select 1 from tests t where q.id = any(t.question_ids))
  and not exists (select 1 from telegram_posted_questions p where p.question_id = q.id);

-- Check how many are left (each day uses 7):
-- select count(*) from telegram_unused_questions;
