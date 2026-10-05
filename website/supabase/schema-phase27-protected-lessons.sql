-- UKPSC Decoded — Phase 27: protected lesson videos + English/Hindi lesson PDFs
-- Safe to run more than once. No DROP TABLE / DELETE / TRUNCATE.
--
-- bunny_video_id: a Bunny Stream video (played through an expiring, signed
--   link). A lesson has either a YouTube id or a Bunny id, so youtube_id may
--   now be empty.
-- pdf_en_path / pdf_hi_path: lesson notes in the private storage bucket
--   "lesson-notes". Students download a copy stamped with their email/phone.

alter table lessons add column if not exists bunny_video_id text;
alter table lessons add column if not exists pdf_en_path text;
alter table lessons add column if not exists pdf_hi_path text;
alter table lessons alter column youtube_id drop not null;

insert into storage.buckets (id, name, public)
values ('lesson-notes', 'lesson-notes', false)
on conflict (id) do nothing;

select 'protected lessons ready' as status;
