-- UKPSC — Phase 21: private storage for paid e-books
-- Safe to re-run. Creates a PRIVATE bucket (no public URLs); the site
-- hands buyers short-lived signed links (src/lib/ebooks.ts).
--
-- After running: Storage → ebooks → Upload file → upload the Polity e-book
-- PDF and name it exactly  polity-decoded.pdf

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('ebooks', 'ebooks', false, 52428800, array['application/pdf'])
on conflict (id) do update set public = false;

select id, public from storage.buckets where id = 'ebooks';
