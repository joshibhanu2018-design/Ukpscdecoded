-- UKPSC Test Platform — reorder package store display order
-- Not run yet — you'll run this.
--
-- New order (Combo Bundles top, then Test Series, then Crash Course):
--   1  Premium Test Series + Crash Course   (combo_bundle)
--   2  Standard Test Series + Crash Course  (combo_bundle)
--   3  Premium Bundle                       (test_series)
--   4  Standard                             (test_series)
--   5  Basic                                (test_series)
--   6  Uttarakhand Intensive                (test_series)
--   7  Current Affairs Intensive            (test_series)
--   8  CSAT                                 (test_series)
--   9  Crash Course for UKPSC ... TRI Exam  (video_course)

update packages set sort_order = 1, updated_at = now()
  where id = '47519f69-eb7b-42cd-8e85-1b3f28e980f7'; -- Premium Test Series + Crash Course

update packages set sort_order = 2, updated_at = now()
  where id = '91261f68-c543-406c-8c2c-485beac736cb'; -- Standard Test Series + Crash Course

update packages set sort_order = 3, updated_at = now()
  where id = 'fa2c4a38-d430-42ce-905d-375bd8af5ca9'; -- Premium Bundle

update packages set sort_order = 4, updated_at = now()
  where id = '4d7dff5c-641b-4f8a-b8ac-57766d5fa757'; -- Standard

update packages set sort_order = 5, updated_at = now()
  where id = '6e868c4b-08a2-4bbe-a78a-2144a69a4288'; -- Basic

update packages set sort_order = 6, updated_at = now()
  where id = '368ea0df-d24c-4857-a3c3-66ba5858f1d2'; -- Uttarakhand Intensive

update packages set sort_order = 7, updated_at = now()
  where id = 'c100e8b1-0929-429d-9e16-d2255f1bddad'; -- Current Affairs Intensive

update packages set sort_order = 8, updated_at = now()
  where id = 'fb0bccf7-9649-4161-9e5c-c441c743f6a8'; -- CSAT

update packages set sort_order = 9, updated_at = now()
  where id = 'aa67a65e-9e92-47ac-bdbd-ebef3c81d2f4'; -- Crash Course for UKPSC Upper & Lower PCS 2026 and TRI Exam
