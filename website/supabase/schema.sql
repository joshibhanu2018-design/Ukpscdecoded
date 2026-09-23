-- UKPSC Test Platform — schema reference
--
-- This file documents the schema that is ALREADY LIVE in the Supabase
-- project (reconstructed from the PostgREST introspection endpoint on
-- 2026-09-22). It is NOT meant to be run — every table below already
-- exists. Keep this in sync if you alter the schema in the dashboard, so
-- the app code and this reference don't drift apart again.
--
-- Auth in src/lib/auth-utils.ts is intentionally stateless (HMAC-signed
-- cookies), so there is no separate sessions table — logins are verified
-- straight from the `users` table on each request.

-- ===== users =====
-- id uuid pk default extensions.uuid_generate_v4()
-- email varchar(255) not null
-- password_hash varchar(255) not null
-- full_name varchar(255)
-- phone varchar(20)
-- role varchar(50) default 'student'
-- created_at timestamp default now()
-- updated_at timestamp default now()

-- ===== questions =====
-- id uuid pk default extensions.uuid_generate_v4()
-- question_id varchar(50) not null
-- question_text_hindi text not null
-- question_text_english text not null
-- option_a_hindi / option_a_english varchar(500)
-- option_b_hindi / option_b_english varchar(500)
-- option_c_hindi / option_c_english varchar(500)
-- option_d_hindi / option_d_english varchar(500)
-- correct_answer varchar(1) not null           -- 'A' | 'B' | 'C' | 'D'
-- explanation_hindi / explanation_english text
-- subject varchar(100), topic varchar(100), subtopic varchar(100)
-- difficulty varchar(20), year integer
-- status varchar(50) default 'active'
-- created_at / updated_at timestamp default now()

-- ===== packages =====
-- id uuid pk, package_name varchar(255) not null, description text
-- price numeric not null, package_type varchar(100)
-- total_tests integer, total_questions integer, sample_test_id uuid
-- validity_days integer default 365, is_active boolean default true
-- created_at / updated_at timestamp default now()

-- ===== tests =====
-- id uuid pk, test_name varchar(255) not null, package_id uuid fk -> packages.id
-- test_type varchar(100), total_questions integer not null, duration_minutes integer not null
-- negative_marking_enabled boolean default true, negative_marking_value numeric default 0.33
-- marks_per_question numeric default 1.0, is_free_test boolean default false
-- question_ids uuid[] not null
-- created_at / updated_at timestamp default now()

-- ===== package_tests =====
-- id uuid pk, package_id uuid fk -> packages.id, test_id uuid fk -> tests.id, test_order integer

-- ===== enrollments =====
-- id uuid pk, user_id uuid fk -> users.id not null, package_id uuid fk -> packages.id not null
-- purchase_date timestamp default now(), payment_id varchar(255)
-- payment_status varchar(50) default 'completed', status varchar(50) default 'active'
-- attempts_used jsonb, access_valid_till timestamp not null
-- created_at / updated_at timestamp default now()

-- ===== attempts =====
-- id uuid pk, user_id uuid fk -> users.id not null, test_id uuid fk -> tests.id not null
-- enrollment_id uuid fk -> enrollments.id
-- answers jsonb, marked_for_review uuid[]
-- score / total_marks / percentage numeric
-- start_time timestamp not null, end_time timestamp, submitted_at timestamp
-- time_taken_seconds integer, status varchar(50) default 'in_progress'
-- created_at / updated_at timestamp default now()

-- ===== results =====
-- id uuid pk, attempt_id uuid fk -> attempts.id not null, user_id uuid fk -> users.id not null
-- test_id uuid fk -> tests.id not null
-- overall_score / overall_accuracy / overall_percentile numeric
-- subject_accuracy / topic_accuracy / question_performance jsonb
-- time_per_question_avg numeric
-- created_at / updated_at timestamp default now()

-- ===== password_reset_tokens =====
-- id uuid pk, user_id uuid fk -> users.id not null, token varchar(255) not null
-- expires_at timestamp not null, created_at timestamp default now()
-- (Not wired up yet — the forgot-password page currently points to Telegram
-- support instead; needs an email delivery provider to actually send resets.)

-- ===== audit_logs =====
-- id uuid pk, user_id uuid fk -> users.id, action varchar(255)
-- resource_type varchar(100), resource_id uuid, details jsonb, ip_address varchar(45)
-- created_at timestamp default now()

-- ===== views =====
-- test_performance_summary(test_id, test_name, total_attempts, avg_score, highest_score, lowest_score)
-- active_enrollments(... enrollments columns ..., package_name, price, email, full_name)

-- Row Level Security: assume deny-by-default for the anon key on every
-- table above unless you've added policies in the dashboard. The app talks
-- to Supabase exclusively through supabaseAdmin() (service role key) from
-- server-side API routes — see src/lib/supabase.ts.
