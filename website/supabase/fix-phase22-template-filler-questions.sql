-- UKPSC — Phase 22: withdraw machine-generated filler questions
-- Safe to re-run. Marks questions whose English text carries generator
-- filler — an "(Item #57)" tag or a meaningless statement like "This
-- represents a core physical principle verified in competitive examination
-- syllabi." — as inactive. Inactive questions drop out of attempts started
-- from now on (past results are unchanged). Then run the loader with
-- --apply to put like-for-like replacements into the tests.

-- 1. See how many and which (run this first).
select question_id, left(question_text_english, 140) as question
from questions
where status is distinct from 'inactive'
  and (question_text_english ~* '\(\s*item\s*#\s*[0-9]+\s*\)'
    or question_text_english ~* 'represents a core [a-z -]*principle'
    or question_text_english ~* 'verified in competitive examination')
order by question_id;

-- 2. Withdraw them.
update questions
set status = 'inactive', deactivated_at = now()
where status is distinct from 'inactive'
  and (question_text_english ~* '\(\s*item\s*#\s*[0-9]+\s*\)'
    or question_text_english ~* 'represents a core [a-z -]*principle'
    or question_text_english ~* 'verified in competitive examination');

-- 3. Check: should return 0.
select count(*) as still_active_filler
from questions
where status is distinct from 'inactive'
  and (question_text_english ~* '\(\s*item\s*#\s*[0-9]+\s*\)'
    or question_text_english ~* 'represents a core [a-z -]*principle'
    or question_text_english ~* 'verified in competitive examination');
