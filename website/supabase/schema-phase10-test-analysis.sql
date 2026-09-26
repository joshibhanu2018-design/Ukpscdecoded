-- UKPSC Test Platform — Phase 10: test performance analysis
-- Not run yet. Safe: ADD COLUMN IF NOT EXISTS with defaults; existing rows
-- get '{}' instantly. REQUIRED before deploying the matching code — the
-- app reads these columns on every attempt.

-- How sure the student was per answered question, tagged during the test:
-- { "<question uuid>": "sure" | "elim2" | "elim1" | "guess" }
alter table attempts add column if not exists confidence jsonb not null default '{}'::jsonb;

-- Why each wrong/skipped question went wrong, tagged on the result page:
-- { "<question uuid>": "concept" | "recall" | "misread" | "silly" | "time" }
alter table attempts add column if not exists error_tags jsonb not null default '{}'::jsonb;
