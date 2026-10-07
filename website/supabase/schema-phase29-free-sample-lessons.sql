-- UKPSC Test Platform — Phase 29: free sample lessons
-- Safe to re-run. No DROP / DELETE / TRUNCATE.
--
-- A lesson marked free (Admin → Lessons → "Make free") can be watched, with
-- its PDF notes, by any logged-in student, without buying the course.

alter table lessons add column if not exists is_free boolean not null default false;
