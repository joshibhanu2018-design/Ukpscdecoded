-- UKPSC Test Platform — Phase 6c: 62 tests for Premium Test Series
-- Run THIRD (last) of the phase 6 files. Not run yet. Idempotent — every
-- INSERT uses a fixed id with ON CONFLICT ... DO UPDATE, safe to re-run.
--
-- Structure exactly as specified: 12 Full-Length Mocks (150Q, 2h), 12
-- Sectional (50Q; 6 subjects x2), 20 Uttarakhand Intensive (50Q, named
-- individually), 12 Current Affairs (50Q), 6 CSAT (100Q) = 62 tests,
-- matching Premium Test Series' existing total_tests = 62.
--
-- Duration for everything except the full mock (given as 150Q/2h) is
-- derived at that same rate (0.8 min/question) — a documented default,
-- not data presented as given. release_at is left null (unlocked
-- immediately) for all 62; set individual dates later via SQL/admin if
-- you want a staggered release schedule.

insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes, negative_marking_enabled, negative_marking_value, marks_per_question)
values ('059f628c-4507-4a9b-8982-2534a0d8730b', 'Full Mock 1', 'fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'Full Mock', 150, 120, true, 0.33, 1.0)
on conflict (id) do update set
  test_name = excluded.test_name, package_id = excluded.package_id, subject = excluded.subject,
  total_questions = excluded.total_questions, duration_minutes = excluded.duration_minutes, updated_at = now();

insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes, negative_marking_enabled, negative_marking_value, marks_per_question)
values ('dec69639-4eda-49f6-a32f-19511c9b4ba4', 'Full Mock 2', 'fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'Full Mock', 150, 120, true, 0.33, 1.0)
on conflict (id) do update set
  test_name = excluded.test_name, package_id = excluded.package_id, subject = excluded.subject,
  total_questions = excluded.total_questions, duration_minutes = excluded.duration_minutes, updated_at = now();

insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes, negative_marking_enabled, negative_marking_value, marks_per_question)
values ('eba11ee4-7602-412e-b61a-758daa43d122', 'Full Mock 3', 'fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'Full Mock', 150, 120, true, 0.33, 1.0)
on conflict (id) do update set
  test_name = excluded.test_name, package_id = excluded.package_id, subject = excluded.subject,
  total_questions = excluded.total_questions, duration_minutes = excluded.duration_minutes, updated_at = now();

insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes, negative_marking_enabled, negative_marking_value, marks_per_question)
values ('2f4fdf1a-90a2-424d-aece-e828f9854dda', 'Full Mock 4', 'fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'Full Mock', 150, 120, true, 0.33, 1.0)
on conflict (id) do update set
  test_name = excluded.test_name, package_id = excluded.package_id, subject = excluded.subject,
  total_questions = excluded.total_questions, duration_minutes = excluded.duration_minutes, updated_at = now();

insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes, negative_marking_enabled, negative_marking_value, marks_per_question)
values ('13ee29fd-b35d-4a96-bc1e-ce289cfba6bf', 'Full Mock 5', 'fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'Full Mock', 150, 120, true, 0.33, 1.0)
on conflict (id) do update set
  test_name = excluded.test_name, package_id = excluded.package_id, subject = excluded.subject,
  total_questions = excluded.total_questions, duration_minutes = excluded.duration_minutes, updated_at = now();

insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes, negative_marking_enabled, negative_marking_value, marks_per_question)
values ('8a975a03-4438-4633-bc11-8b31366821da', 'Full Mock 6', 'fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'Full Mock', 150, 120, true, 0.33, 1.0)
on conflict (id) do update set
  test_name = excluded.test_name, package_id = excluded.package_id, subject = excluded.subject,
  total_questions = excluded.total_questions, duration_minutes = excluded.duration_minutes, updated_at = now();

insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes, negative_marking_enabled, negative_marking_value, marks_per_question)
values ('7a976496-51a7-48b2-8142-2a559a734982', 'Full Mock 7', 'fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'Full Mock', 150, 120, true, 0.33, 1.0)
on conflict (id) do update set
  test_name = excluded.test_name, package_id = excluded.package_id, subject = excluded.subject,
  total_questions = excluded.total_questions, duration_minutes = excluded.duration_minutes, updated_at = now();

insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes, negative_marking_enabled, negative_marking_value, marks_per_question)
values ('aa6a23d2-3297-4452-8434-5cf1bd00e648', 'Full Mock 8', 'fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'Full Mock', 150, 120, true, 0.33, 1.0)
on conflict (id) do update set
  test_name = excluded.test_name, package_id = excluded.package_id, subject = excluded.subject,
  total_questions = excluded.total_questions, duration_minutes = excluded.duration_minutes, updated_at = now();

insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes, negative_marking_enabled, negative_marking_value, marks_per_question)
values ('46c5492d-4368-44d7-b235-e1d88eeafae5', 'Full Mock 9', 'fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'Full Mock', 150, 120, true, 0.33, 1.0)
on conflict (id) do update set
  test_name = excluded.test_name, package_id = excluded.package_id, subject = excluded.subject,
  total_questions = excluded.total_questions, duration_minutes = excluded.duration_minutes, updated_at = now();

insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes, negative_marking_enabled, negative_marking_value, marks_per_question)
values ('68d91fd0-caeb-4e29-adb4-f2ac38639aa9', 'Full Mock 10', 'fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'Full Mock', 150, 120, true, 0.33, 1.0)
on conflict (id) do update set
  test_name = excluded.test_name, package_id = excluded.package_id, subject = excluded.subject,
  total_questions = excluded.total_questions, duration_minutes = excluded.duration_minutes, updated_at = now();

insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes, negative_marking_enabled, negative_marking_value, marks_per_question)
values ('2c34dcc0-1ff2-42bc-94d4-78f286ad91f1', 'Full Mock 11', 'fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'Full Mock', 150, 120, true, 0.33, 1.0)
on conflict (id) do update set
  test_name = excluded.test_name, package_id = excluded.package_id, subject = excluded.subject,
  total_questions = excluded.total_questions, duration_minutes = excluded.duration_minutes, updated_at = now();

insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes, negative_marking_enabled, negative_marking_value, marks_per_question)
values ('3865e0d9-7d4b-44ef-a2ec-0df07aad22d8', 'Full Mock 12', 'fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'Full Mock', 150, 120, true, 0.33, 1.0)
on conflict (id) do update set
  test_name = excluded.test_name, package_id = excluded.package_id, subject = excluded.subject,
  total_questions = excluded.total_questions, duration_minutes = excluded.duration_minutes, updated_at = now();

insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes, negative_marking_enabled, negative_marking_value, marks_per_question)
values ('ba174699-9711-493c-ab04-88cd565d5ae2', 'Polity Sectional I', 'fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'Polity', 50, 40, true, 0.33, 1.0)
on conflict (id) do update set
  test_name = excluded.test_name, package_id = excluded.package_id, subject = excluded.subject,
  total_questions = excluded.total_questions, duration_minutes = excluded.duration_minutes, updated_at = now();

insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes, negative_marking_enabled, negative_marking_value, marks_per_question)
values ('9b329e6c-bf47-47b3-9d18-73e9482596e3', 'Polity Sectional II', 'fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'Polity', 50, 40, true, 0.33, 1.0)
on conflict (id) do update set
  test_name = excluded.test_name, package_id = excluded.package_id, subject = excluded.subject,
  total_questions = excluded.total_questions, duration_minutes = excluded.duration_minutes, updated_at = now();

insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes, negative_marking_enabled, negative_marking_value, marks_per_question)
values ('5192fd21-6358-476b-964a-a87aa23262b7', 'History Sectional I', 'fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'History', 50, 40, true, 0.33, 1.0)
on conflict (id) do update set
  test_name = excluded.test_name, package_id = excluded.package_id, subject = excluded.subject,
  total_questions = excluded.total_questions, duration_minutes = excluded.duration_minutes, updated_at = now();

insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes, negative_marking_enabled, negative_marking_value, marks_per_question)
values ('598e4a9d-2668-4d67-9b8d-e3ea28a00caf', 'History Sectional II', 'fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'History', 50, 40, true, 0.33, 1.0)
on conflict (id) do update set
  test_name = excluded.test_name, package_id = excluded.package_id, subject = excluded.subject,
  total_questions = excluded.total_questions, duration_minutes = excluded.duration_minutes, updated_at = now();

insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes, negative_marking_enabled, negative_marking_value, marks_per_question)
values ('0b3990b5-5844-41c2-9b92-40c5b3050933', 'Geography Sectional I', 'fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'Geography', 50, 40, true, 0.33, 1.0)
on conflict (id) do update set
  test_name = excluded.test_name, package_id = excluded.package_id, subject = excluded.subject,
  total_questions = excluded.total_questions, duration_minutes = excluded.duration_minutes, updated_at = now();

insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes, negative_marking_enabled, negative_marking_value, marks_per_question)
values ('e546da45-2281-4516-b832-ceb149b0a993', 'Geography Sectional II', 'fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'Geography', 50, 40, true, 0.33, 1.0)
on conflict (id) do update set
  test_name = excluded.test_name, package_id = excluded.package_id, subject = excluded.subject,
  total_questions = excluded.total_questions, duration_minutes = excluded.duration_minutes, updated_at = now();

insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes, negative_marking_enabled, negative_marking_value, marks_per_question)
values ('75ee1480-1991-4b3b-9477-da37c37bdabb', 'Science & Tech Sectional I', 'fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'Science & Tech', 50, 40, true, 0.33, 1.0)
on conflict (id) do update set
  test_name = excluded.test_name, package_id = excluded.package_id, subject = excluded.subject,
  total_questions = excluded.total_questions, duration_minutes = excluded.duration_minutes, updated_at = now();

insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes, negative_marking_enabled, negative_marking_value, marks_per_question)
values ('e7e4da3a-3f97-4c96-ac57-a399b1778423', 'Science & Tech Sectional II', 'fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'Science & Tech', 50, 40, true, 0.33, 1.0)
on conflict (id) do update set
  test_name = excluded.test_name, package_id = excluded.package_id, subject = excluded.subject,
  total_questions = excluded.total_questions, duration_minutes = excluded.duration_minutes, updated_at = now();

insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes, negative_marking_enabled, negative_marking_value, marks_per_question)
values ('e02dbd12-c099-4922-bbef-d1f205653114', 'Economy & Environment Sectional I', 'fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'Economy & Environment', 50, 40, true, 0.33, 1.0)
on conflict (id) do update set
  test_name = excluded.test_name, package_id = excluded.package_id, subject = excluded.subject,
  total_questions = excluded.total_questions, duration_minutes = excluded.duration_minutes, updated_at = now();

insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes, negative_marking_enabled, negative_marking_value, marks_per_question)
values ('733be6f7-47c2-49a2-92d5-e01714c194e8', 'Economy & Environment Sectional II', 'fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'Economy & Environment', 50, 40, true, 0.33, 1.0)
on conflict (id) do update set
  test_name = excluded.test_name, package_id = excluded.package_id, subject = excluded.subject,
  total_questions = excluded.total_questions, duration_minutes = excluded.duration_minutes, updated_at = now();

insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes, negative_marking_enabled, negative_marking_value, marks_per_question)
values ('e4a133e3-89d3-48bc-9e46-06eefe5beb1e', 'Uttarakhand GK Sectional I', 'fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'Uttarakhand GK', 50, 40, true, 0.33, 1.0)
on conflict (id) do update set
  test_name = excluded.test_name, package_id = excluded.package_id, subject = excluded.subject,
  total_questions = excluded.total_questions, duration_minutes = excluded.duration_minutes, updated_at = now();

insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes, negative_marking_enabled, negative_marking_value, marks_per_question)
values ('28356aa4-afc3-4c98-8aaf-0096d3bcac18', 'Uttarakhand GK Sectional II', 'fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'Uttarakhand GK', 50, 40, true, 0.33, 1.0)
on conflict (id) do update set
  test_name = excluded.test_name, package_id = excluded.package_id, subject = excluded.subject,
  total_questions = excluded.total_questions, duration_minutes = excluded.duration_minutes, updated_at = now();

insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes, negative_marking_enabled, negative_marking_value, marks_per_question)
values ('d5169d3e-b814-4696-9059-24eaf75227df', 'Statehood Movement I', 'fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'Uttarakhand GK', 50, 40, true, 0.33, 1.0)
on conflict (id) do update set
  test_name = excluded.test_name, package_id = excluded.package_id, subject = excluded.subject,
  total_questions = excluded.total_questions, duration_minutes = excluded.duration_minutes, updated_at = now();

insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes, negative_marking_enabled, negative_marking_value, marks_per_question)
values ('43202535-bb0f-4bd7-9700-5c80a7fcaf76', 'Statehood Movement II', 'fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'Uttarakhand GK', 50, 40, true, 0.33, 1.0)
on conflict (id) do update set
  test_name = excluded.test_name, package_id = excluded.package_id, subject = excluded.subject,
  total_questions = excluded.total_questions, duration_minutes = excluded.duration_minutes, updated_at = now();

insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes, negative_marking_enabled, negative_marking_value, marks_per_question)
values ('f7fceb55-d58c-4b0a-93e0-74fcbff1b92a', 'Ancient & Medieval History', 'fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'Uttarakhand GK', 50, 40, true, 0.33, 1.0)
on conflict (id) do update set
  test_name = excluded.test_name, package_id = excluded.package_id, subject = excluded.subject,
  total_questions = excluded.total_questions, duration_minutes = excluded.duration_minutes, updated_at = now();

insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes, negative_marking_enabled, negative_marking_value, marks_per_question)
values ('8a47502f-2bf2-4c4a-855b-d5f82ed3fc27', 'Gorkha & British rule & Freedom Struggle', 'fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'Uttarakhand GK', 50, 40, true, 0.33, 1.0)
on conflict (id) do update set
  test_name = excluded.test_name, package_id = excluded.package_id, subject = excluded.subject,
  total_questions = excluded.total_questions, duration_minutes = excluded.duration_minutes, updated_at = now();

insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes, negative_marking_enabled, negative_marking_value, marks_per_question)
values ('eb15cc0f-44ce-4afd-a52c-2bc9905ecd23', 'Physical Geography', 'fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'Uttarakhand GK', 50, 40, true, 0.33, 1.0)
on conflict (id) do update set
  test_name = excluded.test_name, package_id = excluded.package_id, subject = excluded.subject,
  total_questions = excluded.total_questions, duration_minutes = excluded.duration_minutes, updated_at = now();

insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes, negative_marking_enabled, negative_marking_value, marks_per_question)
values ('a2976a54-a581-492c-be8a-5d1dadc132c4', 'Forests Flora-Fauna & National Parks', 'fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'Uttarakhand GK', 50, 40, true, 0.33, 1.0)
on conflict (id) do update set
  test_name = excluded.test_name, package_id = excluded.package_id, subject = excluded.subject,
  total_questions = excluded.total_questions, duration_minutes = excluded.duration_minutes, updated_at = now();

insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes, negative_marking_enabled, negative_marking_value, marks_per_question)
values ('e53ec218-2462-4fbd-b306-98c3787dc0ac', 'Demography & Census', 'fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'Uttarakhand GK', 50, 40, true, 0.33, 1.0)
on conflict (id) do update set
  test_name = excluded.test_name, package_id = excluded.package_id, subject = excluded.subject,
  total_questions = excluded.total_questions, duration_minutes = excluded.duration_minutes, updated_at = now();

insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes, negative_marking_enabled, negative_marking_value, marks_per_question)
values ('ce93a96b-4f18-4945-9b9d-98845afbbe6a', 'Polity & Administration', 'fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'Uttarakhand GK', 50, 40, true, 0.33, 1.0)
on conflict (id) do update set
  test_name = excluded.test_name, package_id = excluded.package_id, subject = excluded.subject,
  total_questions = excluded.total_questions, duration_minutes = excluded.duration_minutes, updated_at = now();

insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes, negative_marking_enabled, negative_marking_value, marks_per_question)
values ('fca7e5c8-393f-4b3d-a3c7-4ab2f5303ea6', 'Economy Development & Budget', 'fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'Uttarakhand GK', 50, 40, true, 0.33, 1.0)
on conflict (id) do update set
  test_name = excluded.test_name, package_id = excluded.package_id, subject = excluded.subject,
  total_questions = excluded.total_questions, duration_minutes = excluded.duration_minutes, updated_at = now();

insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes, negative_marking_enabled, negative_marking_value, marks_per_question)
values ('646ad52c-1abb-4cd7-9805-b92822ecfd2f', 'Agriculture Energy & Infrastructure', 'fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'Uttarakhand GK', 50, 40, true, 0.33, 1.0)
on conflict (id) do update set
  test_name = excluded.test_name, package_id = excluded.package_id, subject = excluded.subject,
  total_questions = excluded.total_questions, duration_minutes = excluded.duration_minutes, updated_at = now();

insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes, negative_marking_enabled, negative_marking_value, marks_per_question)
values ('d1c6fce4-44c4-4937-aa1a-3172000b2150', 'Festivals Fairs Folk Music & Dance', 'fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'Uttarakhand GK', 50, 40, true, 0.33, 1.0)
on conflict (id) do update set
  test_name = excluded.test_name, package_id = excluded.package_id, subject = excluded.subject,
  total_questions = excluded.total_questions, duration_minutes = excluded.duration_minutes, updated_at = now();

insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes, negative_marking_enabled, negative_marking_value, marks_per_question)
values ('9e6e2a6b-5d7c-4290-a418-bcff1892f0d7', 'Art Crafts Language & Literature', 'fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'Uttarakhand GK', 50, 40, true, 0.33, 1.0)
on conflict (id) do update set
  test_name = excluded.test_name, package_id = excluded.package_id, subject = excluded.subject,
  total_questions = excluded.total_questions, duration_minutes = excluded.duration_minutes, updated_at = now();

insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes, negative_marking_enabled, negative_marking_value, marks_per_question)
values ('88562346-3bf7-420e-95a8-82c79be52c1c', 'Tourism & Sacred Sites', 'fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'Uttarakhand GK', 50, 40, true, 0.33, 1.0)
on conflict (id) do update set
  test_name = excluded.test_name, package_id = excluded.package_id, subject = excluded.subject,
  total_questions = excluded.total_questions, duration_minutes = excluded.duration_minutes, updated_at = now();

insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes, negative_marking_enabled, negative_marking_value, marks_per_question)
values ('2342bcb5-3dba-487e-bbd4-fb84f601842a', 'Uttarakhand Current Affairs', 'fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'Uttarakhand GK', 50, 40, true, 0.33, 1.0)
on conflict (id) do update set
  test_name = excluded.test_name, package_id = excluded.package_id, subject = excluded.subject,
  total_questions = excluded.total_questions, duration_minutes = excluded.duration_minutes, updated_at = now();

insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes, negative_marking_enabled, negative_marking_value, marks_per_question)
values ('5cf89b44-575f-440f-9257-7cb3f8f9f571', 'Mixed Mock A', 'fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'Uttarakhand GK', 50, 40, true, 0.33, 1.0)
on conflict (id) do update set
  test_name = excluded.test_name, package_id = excluded.package_id, subject = excluded.subject,
  total_questions = excluded.total_questions, duration_minutes = excluded.duration_minutes, updated_at = now();

insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes, negative_marking_enabled, negative_marking_value, marks_per_question)
values ('fe07362d-77e2-4a1e-9ef4-f43f5589e63a', 'Mixed Mock B', 'fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'Uttarakhand GK', 50, 40, true, 0.33, 1.0)
on conflict (id) do update set
  test_name = excluded.test_name, package_id = excluded.package_id, subject = excluded.subject,
  total_questions = excluded.total_questions, duration_minutes = excluded.duration_minutes, updated_at = now();

insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes, negative_marking_enabled, negative_marking_value, marks_per_question)
values ('c967d2ac-3cf7-4e65-870c-cd90283aa95d', 'Mixed Mock C', 'fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'Uttarakhand GK', 50, 40, true, 0.33, 1.0)
on conflict (id) do update set
  test_name = excluded.test_name, package_id = excluded.package_id, subject = excluded.subject,
  total_questions = excluded.total_questions, duration_minutes = excluded.duration_minutes, updated_at = now();

insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes, negative_marking_enabled, negative_marking_value, marks_per_question)
values ('293c3b05-2a81-4c51-a42e-0e95106ee6e2', 'Mixed Mock D', 'fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'Uttarakhand GK', 50, 40, true, 0.33, 1.0)
on conflict (id) do update set
  test_name = excluded.test_name, package_id = excluded.package_id, subject = excluded.subject,
  total_questions = excluded.total_questions, duration_minutes = excluded.duration_minutes, updated_at = now();

insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes, negative_marking_enabled, negative_marking_value, marks_per_question)
values ('8229b988-c583-4f15-b849-43160f1e7829', 'Topper Test', 'fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'Uttarakhand GK', 50, 40, true, 0.33, 1.0)
on conflict (id) do update set
  test_name = excluded.test_name, package_id = excluded.package_id, subject = excluded.subject,
  total_questions = excluded.total_questions, duration_minutes = excluded.duration_minutes, updated_at = now();

insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes, negative_marking_enabled, negative_marking_value, marks_per_question)
values ('9c1b75ba-c62b-4573-92a6-c5142a3c10f9', 'Grand Uttarakhand Mock', 'fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'Uttarakhand GK', 50, 40, true, 0.33, 1.0)
on conflict (id) do update set
  test_name = excluded.test_name, package_id = excluded.package_id, subject = excluded.subject,
  total_questions = excluded.total_questions, duration_minutes = excluded.duration_minutes, updated_at = now();

insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes, negative_marking_enabled, negative_marking_value, marks_per_question)
values ('0f47eb90-1803-4455-9335-f1bdf17d5406', 'Current Affairs - Month 1', 'fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'Current Affairs', 50, 40, true, 0.33, 1.0)
on conflict (id) do update set
  test_name = excluded.test_name, package_id = excluded.package_id, subject = excluded.subject,
  total_questions = excluded.total_questions, duration_minutes = excluded.duration_minutes, updated_at = now();

insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes, negative_marking_enabled, negative_marking_value, marks_per_question)
values ('04432be0-262f-4843-a1f4-80e9ddd9d7f2', 'Current Affairs - Month 2', 'fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'Current Affairs', 50, 40, true, 0.33, 1.0)
on conflict (id) do update set
  test_name = excluded.test_name, package_id = excluded.package_id, subject = excluded.subject,
  total_questions = excluded.total_questions, duration_minutes = excluded.duration_minutes, updated_at = now();

insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes, negative_marking_enabled, negative_marking_value, marks_per_question)
values ('8e9bae11-40b1-4811-a7d5-4806b3bdef88', 'Current Affairs - Month 3', 'fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'Current Affairs', 50, 40, true, 0.33, 1.0)
on conflict (id) do update set
  test_name = excluded.test_name, package_id = excluded.package_id, subject = excluded.subject,
  total_questions = excluded.total_questions, duration_minutes = excluded.duration_minutes, updated_at = now();

insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes, negative_marking_enabled, negative_marking_value, marks_per_question)
values ('a0eabbb4-b423-40fd-b144-0ebfcb4d4411', 'Current Affairs - Month 4', 'fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'Current Affairs', 50, 40, true, 0.33, 1.0)
on conflict (id) do update set
  test_name = excluded.test_name, package_id = excluded.package_id, subject = excluded.subject,
  total_questions = excluded.total_questions, duration_minutes = excluded.duration_minutes, updated_at = now();

insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes, negative_marking_enabled, negative_marking_value, marks_per_question)
values ('5d7cb323-cf50-4f47-9503-e161e1e5087c', 'Current Affairs - Month 5', 'fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'Current Affairs', 50, 40, true, 0.33, 1.0)
on conflict (id) do update set
  test_name = excluded.test_name, package_id = excluded.package_id, subject = excluded.subject,
  total_questions = excluded.total_questions, duration_minutes = excluded.duration_minutes, updated_at = now();

insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes, negative_marking_enabled, negative_marking_value, marks_per_question)
values ('fc6903f3-f4dd-4e80-bd18-b10fddf6bcd4', 'Current Affairs - Month 6', 'fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'Current Affairs', 50, 40, true, 0.33, 1.0)
on conflict (id) do update set
  test_name = excluded.test_name, package_id = excluded.package_id, subject = excluded.subject,
  total_questions = excluded.total_questions, duration_minutes = excluded.duration_minutes, updated_at = now();

insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes, negative_marking_enabled, negative_marking_value, marks_per_question)
values ('afb8ef17-44aa-4aa5-bf8d-d075e02ce964', 'Current Affairs - Month 7', 'fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'Current Affairs', 50, 40, true, 0.33, 1.0)
on conflict (id) do update set
  test_name = excluded.test_name, package_id = excluded.package_id, subject = excluded.subject,
  total_questions = excluded.total_questions, duration_minutes = excluded.duration_minutes, updated_at = now();

insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes, negative_marking_enabled, negative_marking_value, marks_per_question)
values ('6b30e27e-8d1e-46e3-b8ac-89d435cb04bf', 'Current Affairs - Month 8', 'fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'Current Affairs', 50, 40, true, 0.33, 1.0)
on conflict (id) do update set
  test_name = excluded.test_name, package_id = excluded.package_id, subject = excluded.subject,
  total_questions = excluded.total_questions, duration_minutes = excluded.duration_minutes, updated_at = now();

insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes, negative_marking_enabled, negative_marking_value, marks_per_question)
values ('79ecc542-3814-4430-a202-4a8fcad724cb', 'Current Affairs - Theme 1', 'fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'Current Affairs', 50, 40, true, 0.33, 1.0)
on conflict (id) do update set
  test_name = excluded.test_name, package_id = excluded.package_id, subject = excluded.subject,
  total_questions = excluded.total_questions, duration_minutes = excluded.duration_minutes, updated_at = now();

insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes, negative_marking_enabled, negative_marking_value, marks_per_question)
values ('fa519d81-675a-4749-bff7-33f9074610ab', 'Current Affairs - Theme 2', 'fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'Current Affairs', 50, 40, true, 0.33, 1.0)
on conflict (id) do update set
  test_name = excluded.test_name, package_id = excluded.package_id, subject = excluded.subject,
  total_questions = excluded.total_questions, duration_minutes = excluded.duration_minutes, updated_at = now();

insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes, negative_marking_enabled, negative_marking_value, marks_per_question)
values ('c6894461-64db-418b-99cf-ebcffbb3c026', 'Uttarakhand CA + Budget', 'fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'Current Affairs', 50, 40, true, 0.33, 1.0)
on conflict (id) do update set
  test_name = excluded.test_name, package_id = excluded.package_id, subject = excluded.subject,
  total_questions = excluded.total_questions, duration_minutes = excluded.duration_minutes, updated_at = now();

insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes, negative_marking_enabled, negative_marking_value, marks_per_question)
values ('77a48edd-34d4-4f63-822e-2178a8f4e93e', 'Current Affairs Grand Revision', 'fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'Current Affairs', 50, 40, true, 0.33, 1.0)
on conflict (id) do update set
  test_name = excluded.test_name, package_id = excluded.package_id, subject = excluded.subject,
  total_questions = excluded.total_questions, duration_minutes = excluded.duration_minutes, updated_at = now();

insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes, negative_marking_enabled, negative_marking_value, marks_per_question)
values ('45dbca03-8184-46e1-a241-10e7c0983388', 'CSAT 1', 'fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'CSAT', 100, 80, true, 0.33, 1.0)
on conflict (id) do update set
  test_name = excluded.test_name, package_id = excluded.package_id, subject = excluded.subject,
  total_questions = excluded.total_questions, duration_minutes = excluded.duration_minutes, updated_at = now();

insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes, negative_marking_enabled, negative_marking_value, marks_per_question)
values ('04b45cb8-9a4d-409c-a6c1-48094d5d41ae', 'CSAT 2', 'fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'CSAT', 100, 80, true, 0.33, 1.0)
on conflict (id) do update set
  test_name = excluded.test_name, package_id = excluded.package_id, subject = excluded.subject,
  total_questions = excluded.total_questions, duration_minutes = excluded.duration_minutes, updated_at = now();

insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes, negative_marking_enabled, negative_marking_value, marks_per_question)
values ('827f78a8-5641-4490-b941-eb6b3c557263', 'CSAT 3', 'fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'CSAT', 100, 80, true, 0.33, 1.0)
on conflict (id) do update set
  test_name = excluded.test_name, package_id = excluded.package_id, subject = excluded.subject,
  total_questions = excluded.total_questions, duration_minutes = excluded.duration_minutes, updated_at = now();

insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes, negative_marking_enabled, negative_marking_value, marks_per_question)
values ('fa49bf3b-ebe2-4566-967e-57b1b7854085', 'CSAT 4', 'fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'CSAT', 100, 80, true, 0.33, 1.0)
on conflict (id) do update set
  test_name = excluded.test_name, package_id = excluded.package_id, subject = excluded.subject,
  total_questions = excluded.total_questions, duration_minutes = excluded.duration_minutes, updated_at = now();

insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes, negative_marking_enabled, negative_marking_value, marks_per_question)
values ('f49e0e05-f2cd-434b-94bb-aec89ff0597f', 'CSAT 5', 'fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'CSAT', 100, 80, true, 0.33, 1.0)
on conflict (id) do update set
  test_name = excluded.test_name, package_id = excluded.package_id, subject = excluded.subject,
  total_questions = excluded.total_questions, duration_minutes = excluded.duration_minutes, updated_at = now();

insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes, negative_marking_enabled, negative_marking_value, marks_per_question)
values ('bb8b9620-e13c-4854-a774-c584a6e41820', 'CSAT 6', 'fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'CSAT', 100, 80, true, 0.33, 1.0)
on conflict (id) do update set
  test_name = excluded.test_name, package_id = excluded.package_id, subject = excluded.subject,
  total_questions = excluded.total_questions, duration_minutes = excluded.duration_minutes, updated_at = now();

-- Link all 62 to Premium Test Series via package_tests.
insert into package_tests (package_id, test_id) values
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', '059f628c-4507-4a9b-8982-2534a0d8730b'),
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'dec69639-4eda-49f6-a32f-19511c9b4ba4'),
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'eba11ee4-7602-412e-b61a-758daa43d122'),
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', '2f4fdf1a-90a2-424d-aece-e828f9854dda'),
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', '13ee29fd-b35d-4a96-bc1e-ce289cfba6bf'),
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', '8a975a03-4438-4633-bc11-8b31366821da'),
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', '7a976496-51a7-48b2-8142-2a559a734982'),
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'aa6a23d2-3297-4452-8434-5cf1bd00e648'),
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', '46c5492d-4368-44d7-b235-e1d88eeafae5'),
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', '68d91fd0-caeb-4e29-adb4-f2ac38639aa9'),
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', '2c34dcc0-1ff2-42bc-94d4-78f286ad91f1'),
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', '3865e0d9-7d4b-44ef-a2ec-0df07aad22d8'),
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'ba174699-9711-493c-ab04-88cd565d5ae2'),
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', '9b329e6c-bf47-47b3-9d18-73e9482596e3'),
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', '5192fd21-6358-476b-964a-a87aa23262b7'),
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', '598e4a9d-2668-4d67-9b8d-e3ea28a00caf'),
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', '0b3990b5-5844-41c2-9b92-40c5b3050933'),
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'e546da45-2281-4516-b832-ceb149b0a993'),
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', '75ee1480-1991-4b3b-9477-da37c37bdabb'),
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'e7e4da3a-3f97-4c96-ac57-a399b1778423'),
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'e02dbd12-c099-4922-bbef-d1f205653114'),
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', '733be6f7-47c2-49a2-92d5-e01714c194e8'),
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'e4a133e3-89d3-48bc-9e46-06eefe5beb1e'),
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', '28356aa4-afc3-4c98-8aaf-0096d3bcac18'),
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'd5169d3e-b814-4696-9059-24eaf75227df'),
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', '43202535-bb0f-4bd7-9700-5c80a7fcaf76'),
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'f7fceb55-d58c-4b0a-93e0-74fcbff1b92a'),
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', '8a47502f-2bf2-4c4a-855b-d5f82ed3fc27'),
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'eb15cc0f-44ce-4afd-a52c-2bc9905ecd23'),
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'a2976a54-a581-492c-be8a-5d1dadc132c4'),
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'e53ec218-2462-4fbd-b306-98c3787dc0ac'),
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'ce93a96b-4f18-4945-9b9d-98845afbbe6a'),
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'fca7e5c8-393f-4b3d-a3c7-4ab2f5303ea6'),
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', '646ad52c-1abb-4cd7-9805-b92822ecfd2f'),
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'd1c6fce4-44c4-4937-aa1a-3172000b2150'),
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', '9e6e2a6b-5d7c-4290-a418-bcff1892f0d7'),
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', '88562346-3bf7-420e-95a8-82c79be52c1c'),
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', '2342bcb5-3dba-487e-bbd4-fb84f601842a'),
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', '5cf89b44-575f-440f-9257-7cb3f8f9f571'),
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'fe07362d-77e2-4a1e-9ef4-f43f5589e63a'),
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'c967d2ac-3cf7-4e65-870c-cd90283aa95d'),
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', '293c3b05-2a81-4c51-a42e-0e95106ee6e2'),
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', '8229b988-c583-4f15-b849-43160f1e7829'),
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', '9c1b75ba-c62b-4573-92a6-c5142a3c10f9'),
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', '0f47eb90-1803-4455-9335-f1bdf17d5406'),
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', '04432be0-262f-4843-a1f4-80e9ddd9d7f2'),
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', '8e9bae11-40b1-4811-a7d5-4806b3bdef88'),
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'a0eabbb4-b423-40fd-b144-0ebfcb4d4411'),
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', '5d7cb323-cf50-4f47-9503-e161e1e5087c'),
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'fc6903f3-f4dd-4e80-bd18-b10fddf6bcd4'),
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'afb8ef17-44aa-4aa5-bf8d-d075e02ce964'),
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', '6b30e27e-8d1e-46e3-b8ac-89d435cb04bf'),
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', '79ecc542-3814-4430-a202-4a8fcad724cb'),
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'fa519d81-675a-4749-bff7-33f9074610ab'),
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'c6894461-64db-418b-99cf-ebcffbb3c026'),
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', '77a48edd-34d4-4f63-822e-2178a8f4e93e'),
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', '45dbca03-8184-46e1-a241-10e7c0983388'),
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', '04b45cb8-9a4d-409c-a6c1-48094d5d41ae'),
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', '827f78a8-5641-4490-b941-eb6b3c557263'),
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'fa49bf3b-ebe2-4566-967e-57b1b7854085'),
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'f49e0e05-f2cd-434b-94bb-aec89ff0597f'),
  ('fa2c4a38-d430-42ce-905d-375bd8af5ca9', 'bb8b9620-e13c-4854-a774-c584a6e41820')
on conflict (package_id, test_id) do nothing;
