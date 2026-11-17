-- UKPSC Decoded — Phase 47: Lower PCS + RO/ARO relaunch (run NOW, 17 Nov 2026)
-- Safe to re-run: guarded INSERTs and UPDATEs only. No DROP / DELETE / TRUNCATE.
-- Run the whole file once in Supabase → SQL Editor, BEFORE merging the
-- "lower-pcs-relaunch" pull request (the new pages read what this creates).
-- On Mon 30 Nov run schema-phase47b-upper-2027.sql (Upper PCS renames).
--
-- What it does
--  1. lessons: new columns `section` (heading in a course) and
--     `source_lesson_id` (which Crash Course lesson a copy came from).
--  2. New products (all valid till 30 Apr 2027 = Lower PCS 27 Dec + TRI 15 Jan
--     + RO/ARO Prelims in April, same syllabus as Lower PCS):
--       lower-pcs-complete     ₹3,599, offer ₹3,299 till 6 Dec   (Course + Tests)
--       lower-pcs-crash-course ₹2,799                             (videos)
--       lower-pcs-test-series  ₹1,299                             (81 tests)
--       tri-addon              ₹599                               (TRI GS, no Hindi)
--       three-exam-complete    ₹3,899, offer ₹3,599 till 6 Dec   (Complete + TRI)
--       lower-pcs-csat         ₹799 (₹499 for Upper buyers)       (Individual)
--       uttarakhand-gk-pack    ₹1,499                             (Individual)
--       current-affairs-2026   ₹699                               (Individual)
--     plus 4 unlisted part-packages that hold the videos/tests of the bundles:
--       tri-addon-videos, tri-addon-tests, lower-pcs-csat-tests,
--       lower-pcs-csat-classes and ca-2026-videos (the last two show the
--       Part E / Part D lessons of the Lower PCS Crash Course: no copies).
--  3. Lessons of the Lower PCS Crash Course and the TRI videos: COPIES of the
--     Crash Course lessons (same YouTube / Bunny video, same English/Hindi
--     PDF notes, nothing re-uploaded) + "coming soon" placeholders.
--  4. Placeholder tests (0 questions = "Soon" for students) with fixed ids:
--     Lower PCS 2025 paper, Lower PCS FLT 1-10, CSAT Sectional 1-12, TRI Mock 1-3.
--  5. Test links: Lower PCS Test Series = Premium's tests except Full Mock 1-12
--     and CSAT 1-6, + Uttarakhand Revision 1-8 + CA Revision 1-6 + placeholders.
--  6. Store listing (packages.metadata):
--       exam_tab  = 'lower' | 'tri' | 'upper' | 'individual' (which page/menu)
--       listed    = false → not shown in any list (direct links + access still work)
--       sale_ends_at → hidden and not buyable after that moment
--       card_label → small label on the card, e.g. "Upper PCS · 29 Nov"
--     Nothing is deactivated, so every buyer keeps their access.

-- ===================================================================
-- 1. lessons: section + source
-- ===================================================================
alter table lessons add column if not exists section text;
alter table lessons add column if not exists source_lesson_id uuid;

-- ===================================================================
-- 2. Packages (create if missing, then set every field)
-- ===================================================================
insert into packages (id, package_name, price, package_type, is_active, slug, created_at, updated_at)
select gen_random_uuid(), v.name, v.price, v.ptype, true, v.slug, now(), now()
from (values
  ('lower-pcs-complete',     'Lower PCS + RO/ARO Complete',                          3599, 'combo_bundle'),
  ('lower-pcs-crash-course', 'Lower PCS Crash Course',                               2799, 'video_course'),
  ('lower-pcs-test-series',  'Lower PCS & RO/ARO Test Series',                       1299, 'test_series'),
  ('tri-addon',              'TRI Add-on (GS)',                                       599, 'combo_bundle'),
  ('tri-addon-videos',       'TRI Add-on: Videos',                                    599, 'video_course'),
  ('tri-addon-tests',        'TRI Add-on: Pattern Mocks',                             599, 'test_series'),
  ('three-exam-complete',    '3-Exam Complete: Lower PCS + RO/ARO + TRI (GS)',       3899, 'combo_bundle'),
  ('lower-pcs-csat',         'CSAT for Lower PCS / RO-ARO',                           799, 'combo_bundle'),
  ('lower-pcs-csat-classes', 'CSAT Classes (Lower PCS / RO-ARO)',                     799, 'video_course'),
  ('lower-pcs-csat-tests',   'CSAT Tests (Lower PCS / RO-ARO)',                       799, 'test_series'),
  ('uttarakhand-gk-pack',    'Uttarakhand GK Pack',                                  1499, 'combo_bundle'),
  ('current-affairs-2026',   'Current Affairs 2026',                                  699, 'combo_bundle'),
  ('ca-2026-videos',         'Current Affairs 2026: Videos',                          699, 'video_course')
) as v(slug, name, price, ptype)
where not exists (select 1 from packages p where p.slug = v.slug);

-- Common fields for all new packages.
update packages set
  is_active = true,
  access_valid_till = '2027-04-30',
  validity_days = null,
  seats_total = null,
  discount_percentage = null,
  original_price = null,
  curriculum = '[]'::jsonb,
  updated_at = now()
where slug in ('lower-pcs-complete','lower-pcs-crash-course','lower-pcs-test-series','tri-addon','tri-addon-videos',
               'tri-addon-tests','three-exam-complete','lower-pcs-csat','lower-pcs-csat-classes','lower-pcs-csat-tests',
               'uttarakhand-gk-pack','current-affairs-2026','ca-2026-videos');

-- Lower PCS + RO/ARO Complete
update packages set
  package_name = 'Lower PCS + RO/ARO Complete',
  package_type = 'combo_bundle',
  price = 3599, regular_price = 3599, founding_price = 3299,
  founding_ends_at = '2026-12-06 23:59:59+05:30',
  sort_order = 1,
  description = 'UKPSC Lower PCS (27 Dec 2026) + RO/ARO Prelims (April 2027, same syllabus)
Lower PCS Crash Course: 65+ video lectures with PDF notes, incl. General Aptitude (CSAT) classes
Lower PCS & RO/ARO Test Series: 81 tests, 58 live from day one
Valid till 30 April 2027',
  highlights = '["65+ video lectures with PDF notes (English + Hindi)", "81 tests: 58 live from day one, 23 being added", "10 Full Length Tests on the Lower PCS pattern (100 GS + 50 Aptitude)", "12 CSAT (General Aptitude) sectional tests", "Lower PCS 2025 actual paper as a timed test", "Valid till 30 April 2027: Lower PCS + RO/ARO Prelims"]'::jsonb,
  faq = '[{"question":"Is RO/ARO Prelims really covered?","answer":"Yes. The UKPSC RO/ARO Prelims has the same pattern and syllabus as Lower PCS Prelims: 150 questions in 2 hours, 100 General Studies + 50 General Aptitude. The course stays valid till 30 April 2027."},{"question":"I bought the Upper PCS Crash Course or Premium Test Series. Do I need this?","answer":"No. You already have the GS videos and most of the tests. Add only the CSAT for Lower PCS / RO-ARO (₹499 for you) and, for TRI, the TRI Add-on."},{"question":"Are all videos and tests available now?","answer":"All existing videos and 58 tests open the day you buy. The new videos (orientation, land revenue, computer, CSAT classes) and the Lower PCS full length tests are added before the exam; you can see each one marked Coming soon."}]'::jsonb,
  metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
    'exam_tab', 'lower', 'listed', true,
    'card_title', 'Lower PCS + RO/ARO Complete',
    'card_tagline', 'Crash Course (65+ videos + notes) + Test Series (81 tests). One course, two exams.',
    'separate_total', 4098)
where slug = 'lower-pcs-complete';

-- Lower PCS Crash Course
update packages set
  package_name = 'Lower PCS Crash Course',
  package_type = 'video_course',
  price = 2799, regular_price = null, founding_price = null, founding_ends_at = null,
  sort_order = 2,
  description = 'UKPSC Lower PCS 2026 (27 Dec) and RO/ARO Prelims (same syllabus)
Uttarakhand first, then Culture, India, Current Affairs and General Aptitude (CSAT)
65+ video lectures with PDF notes · no class dates: watch at your pace
Valid till 30 April 2027',
  highlights = '["Part A Uttarakhand: 17 videos", "Part B Uttarakhand Culture: 5 videos", "Part C India: 19 videos", "Part D Current Affairs: 5+ videos (growing)", "Part E General Aptitude (CSAT): 14 classes", "PDF notes in English and Hindi", "Valid till 30 April 2027"]'::jsonb,
  faq = '[{"question":"Is this the same as the Upper PCS Crash Course?","answer":"It uses the same recorded lessons for the common GS topics, re-ordered for Lower PCS (Uttarakhand first), plus new Lower PCS videos: orientation with the 2025 paper analysis, land revenue system, computer basics and 12 CSAT classes."},{"question":"Is environment included?","answer":"Environment is not a separate unit in the Lower PCS syllabus, so the two environment videos are kept as a free bonus."}]'::jsonb,
  metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
    'exam_tab', 'lower', 'listed', true, 'outline', true,
    'card_title', 'Lower PCS Crash Course',
    'card_tagline', '65+ video lectures + PDF notes: Uttarakhand → Culture → India → Current Affairs → CSAT')
where slug = 'lower-pcs-crash-course';

-- Lower PCS & RO/ARO Test Series
update packages set
  package_name = 'Lower PCS & RO/ARO Test Series',
  package_type = 'test_series',
  price = 1299, regular_price = null, founding_price = null, founding_ends_at = null,
  sort_order = 3,
  total_tests = 81,
  description = '81 tests for UKPSC Lower PCS (27 Dec 2026) and RO/ARO Prelims
58 tests live from day one: 20 Uttarakhand, 12 subject sectionals, 12 current affairs, 8 Uttarakhand revision, 6 CA revision
Being added: Lower PCS 2025 actual paper, 10 Full Length Tests (100 GS + 50 Aptitude), 12 CSAT sectionals
Valid till 30 April 2027',
  highlights = '["58 tests live from day one", "10 Full Length Tests on the Lower PCS pattern", "12 CSAT (General Aptitude) sectional tests", "Lower PCS 2025 actual paper (timed)", "Analysis after every test", "Valid till 30 April 2027"]'::jsonb,
  faq = '[]'::jsonb,
  metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
    'exam_tab', 'lower', 'listed', true,
    'card_title', 'Lower PCS & RO/ARO Test Series',
    'card_tagline', '81 tests: 58 live today + 10 Lower PCS Full Length Tests + 12 CSAT sectionals')
where slug = 'lower-pcs-test-series';

-- TRI Add-on (bundle of its videos + mocks)
update packages set
  package_name = 'TRI Add-on (GS)',
  package_type = 'combo_bundle',
  price = 599, regular_price = null, founding_price = null, founding_ends_at = null,
  sort_order = 10,
  description = 'For the UKPSC Tax & Revenue Inspector exam (15 Jan 2027), on top of the Lower PCS course
Urbanization, Indian Agriculture, Statistics & Graphs, Environment, Sports + 3 TRI pattern GS mocks (200 Q)
General Hindi is NOT included',
  highlights = '["Urbanization (2 new videos)", "Indian Agriculture", "Statistics, Graphs & Diagrams", "Environment (2 videos) + Sports", "3 TRI pattern GS mocks (200 Q, 3 h)", "General Hindi not included"]'::jsonb,
  faq = '[]'::jsonb,
  metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
    'exam_tab', 'tri', 'listed', true,
    'card_title', 'TRI Add-on (GS)',
    'card_tagline', 'The TRI-only GS topics + 3 TRI pattern mocks. TRI exam: 15 Jan 2027. General Hindi not included.')
where slug = 'tri-addon';

update packages set package_name = 'TRI Add-on: Videos', package_type = 'video_course', price = 599, sort_order = 90,
  metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object('exam_tab', 'tri', 'listed', false)
where slug = 'tri-addon-videos';
update packages set package_name = 'TRI Add-on: Pattern Mocks', package_type = 'test_series', price = 599, sort_order = 91, total_tests = 3,
  metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object('exam_tab', 'tri', 'listed', false)
where slug = 'tri-addon-tests';

-- 3-Exam Complete
update packages set
  package_name = '3-Exam Complete: Lower PCS + RO/ARO + TRI (GS)',
  package_type = 'combo_bundle',
  price = 3899, regular_price = 3899, founding_price = 3599,
  founding_ends_at = '2026-12-06 23:59:59+05:30',
  sort_order = 11,
  description = 'Lower PCS + RO/ARO Complete + TRI Add-on in one
Lower PCS 27 Dec 2026 · TRI 15 Jan 2027 · RO/ARO Prelims April 2027
General Hindi (TRI Paper I) is not included',
  highlights = '["Everything in Lower PCS + RO/ARO Complete", "TRI Add-on: Urbanization, Agriculture, Graphs, Environment, Sports", "3 TRI pattern GS mocks", "Valid till 30 April 2027"]'::jsonb,
  faq = '[]'::jsonb,
  metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
    'exam_tab', 'tri', 'listed', true,
    'card_title', '3-Exam Complete',
    'card_tagline', 'Lower PCS + RO/ARO + TRI (GS): videos, notes and every test',
    'separate_total', 4697)
where slug = 'three-exam-complete';

-- CSAT for Lower PCS / RO-ARO (Individual) — ₹499 for buyers of the Upper products
update packages set
  package_name = 'CSAT for Lower PCS / RO-ARO',
  package_type = 'combo_bundle',
  price = 799, regular_price = null, founding_price = null, founding_ends_at = null,
  sort_order = 20,
  description = 'General Aptitude for UKPSC Lower PCS and RO/ARO (50 of 150 marks)
14 classes (reasoning + arithmetic) and 12 CSAT sectional tests of 50 questions
Plus the 6 older CSAT tests as extra practice',
  highlights = '["14 classes: reasoning + arithmetic", "12 sectional tests (50 Q each)", "6 extra CSAT practice tests", "₹499 if you bought the Upper PCS Crash Course, Premium Test Series or Complete Prelims Pack"]'::jsonb,
  faq = '[]'::jsonb,
  metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
    'exam_tab', 'individual', 'listed', true,
    'card_title', 'CSAT for Lower PCS / RO-ARO',
    'card_tagline', '14 aptitude classes + 12 sectional tests. ₹499 for past Upper PCS buyers.',
    'upgrade_from', jsonb_build_object('crash-course', 499, 'premium-test-series', 499, 'complete-prelims-pack', 499))
where slug = 'lower-pcs-csat';

update packages set package_name = 'CSAT Classes (Lower PCS / RO-ARO)', package_type = 'video_course', price = 799, sort_order = 92,
  metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object('exam_tab', 'individual', 'listed', false)
where slug = 'lower-pcs-csat-classes';
update packages set package_name = 'CSAT Tests (Lower PCS / RO-ARO)', package_type = 'test_series', price = 799, sort_order = 93, total_tests = 18,
  metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object('exam_tab', 'individual', 'listed', false)
where slug = 'lower-pcs-csat-tests';

-- Uttarakhand GK Pack (Individual)
update packages set
  package_name = 'Uttarakhand GK Pack',
  package_type = 'combo_bundle',
  price = 1499, regular_price = null, founding_price = null, founding_ends_at = null,
  sort_order = 21,
  description = 'Uttarakhand Crash Course (Uttarakhand videos + PDF notes) + Uttarakhand tests
For every UKPSC exam: Lower PCS, RO/ARO, TRI and Upper PCS',
  highlights = '["Uttarakhand Crash Course videos + PDF notes", "20 Uttarakhand GK tests", "8 Uttarakhand revision tests", "Valid till 30 April 2027"]'::jsonb,
  faq = '[]'::jsonb,
  metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
    'exam_tab', 'individual', 'listed', true,
    'card_title', 'Uttarakhand GK Pack',
    'card_tagline', 'Uttarakhand videos + notes + 28 Uttarakhand tests')
where slug = 'uttarakhand-gk-pack';

-- Current Affairs 2026 (Individual)
update packages set
  package_name = 'Current Affairs 2026',
  package_type = 'combo_bundle',
  price = 699, regular_price = null, founding_price = null, founding_ends_at = null,
  sort_order = 22,
  description = 'Current affairs videos (national, international, sports, Uttarakhand) + current affairs tests',
  highlights = '["Current affairs videos, new ones added", "12 current affairs tests", "6 CA revision tests", "Valid till 30 April 2027"]'::jsonb,
  faq = '[]'::jsonb,
  metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
    'exam_tab', 'individual', 'listed', true,
    'card_title', 'Current Affairs 2026',
    'card_tagline', 'CA videos + 18 current affairs tests')
where slug = 'current-affairs-2026';

update packages set package_name = 'Current Affairs 2026: Videos', package_type = 'video_course', price = 699, sort_order = 94,
  metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object('exam_tab', 'individual', 'listed', false)
where slug = 'ca-2026-videos';

-- ===================================================================
-- 2b. What each bundle includes (access + "Purchased" on cards)
-- ===================================================================
insert into package_includes (combo_package_id, included_package_id)
select c.id, i.id
from (values
  ('lower-pcs-complete',  'lower-pcs-crash-course'),
  ('lower-pcs-complete',  'lower-pcs-test-series'),
  ('lower-pcs-complete',  'lower-pcs-csat'),
  ('tri-addon',           'tri-addon-videos'),
  ('tri-addon',           'tri-addon-tests'),
  ('three-exam-complete', 'lower-pcs-complete'),
  ('three-exam-complete', 'lower-pcs-crash-course'),
  ('three-exam-complete', 'lower-pcs-test-series'),
  ('three-exam-complete', 'lower-pcs-csat'),
  ('three-exam-complete', 'tri-addon'),
  ('three-exam-complete', 'tri-addon-videos'),
  ('three-exam-complete', 'tri-addon-tests'),
  ('lower-pcs-csat',      'lower-pcs-csat-classes'),
  ('lower-pcs-csat',      'lower-pcs-csat-tests'),
  ('uttarakhand-gk-pack', 'uttarakhand-crash-course'),
  ('uttarakhand-gk-pack', 'uttarakhand-intensive'),
  ('current-affairs-2026','ca-2026-videos'),
  ('current-affairs-2026','current-affairs-intensive')
) as v(combo, inc)
join packages c on c.slug = v.combo
join packages i on i.slug = v.inc
where not exists (
  select 1 from package_includes pi where pi.combo_package_id = c.id and pi.included_package_id = i.id
);

-- ===================================================================
-- 3. Lessons
-- ===================================================================
-- 3a. Lower PCS Crash Course. plan_no = the Crash Course video number to copy
--     (every lesson titled "Video N …" in the Crash Course); null = placeholder.
--     The copy drops "Video N" from the title, so the lessons keep this order.
with plan(sort_order, section, plan_no, title) as (values
  (10,  'Start here', null::int, 'Lower PCS & RO/ARO 2026: Exam Pattern, 2025 Paper Analysis & How to Use This Course'),
  (100, 'Part A: Uttarakhand', 9,  'Prehistory, Ancient Sources & Tribes, Kunindas, Katyuri'),
  (110, 'Part A: Uttarakhand', 10, 'Parmar (Panwar) & Chand Dynasties, Garhwal Painting, Small Kingdoms'),
  (120, 'Part A: Uttarakhand', 11, 'Gorkha Rule & British Period (1790-1900), Tehri State to 1913'),
  (130, 'Part A: Uttarakhand', 14, 'Freedom Struggle & Tehri State (1900-1949)'),
  (140, 'Part A: Uttarakhand', 15, 'People''s Movements (Chipko etc.) & the Statehood Movement (1950-2000)'),
  (150, 'Part A: Uttarakhand', 2,  'Physical Geography: Glaciers, Rivers, Prayags'),
  (160, 'Part A: Uttarakhand', 3,  'Passes, Valleys, Bugyals, Doons/Tarai/Bhabar, Physiographic Divisions'),
  (170, 'Part A: Uttarakhand', 4,  'Protected Areas, Forests & Tourism Geography'),
  (180, 'Part A: Uttarakhand', 6,  'Population, Census, Migration & Urbanisation'),
  (190, 'Part A: Uttarakhand', 18, 'UK Polity I: Statehood, Governors, CMs, Reservations & State Laws'),
  (200, 'Part A: Uttarakhand', 19, 'UK Polity II: Symbols, Legislature, Office-Holders, Commissions, Districts & Local Bodies'),
  (210, 'Part A: Uttarakhand', null, 'Uttarakhand Land Revenue & Management: British Settlements, Barah Aana Bisi, Revenue Police, Land Records & Laws'),
  (220, 'Part A: Uttarakhand', 29, 'Agriculture, Minerals & Sports'),
  (230, 'Part A: Uttarakhand', 30, 'Energy, Industry & Transport'),
  (240, 'Part A: Uttarakhand', 41, 'State Budget Highlights + Economic Survey'),
  (250, 'Part A: Uttarakhand', 23, 'Welfare Schemes, E-Governance, State Policies & Miscellaneous Uttarakhand'),
  (260, 'Part A: Uttarakhand', 33, 'Higher Education, Research Institutes & GI Products'),
  (300, 'Part B: Uttarakhand Culture', 5,  'Char Dham Temples & Pilgrimage Sites'),
  (310, 'Part B: Uttarakhand Culture', 22, 'Literature, Books & Authors, Newspapers, Languages, Folk Songs, Music, Jagar & Dress'),
  (320, 'Part B: Uttarakhand Culture', 24, 'Tribes, Fairs & Festivals'),
  (330, 'Part B: Uttarakhand Culture', 25, 'Folk Dances, Art & Crafts, Temples and Sacred Places'),
  (340, 'Part B: Uttarakhand Culture', 26, 'Personalities, Firsts, Freedom Fighters, Social Reformers, Cultural Institutions'),
  (400, 'Part C: India', 7,  'Ancient India: Indus Valley, Vedic, Mauryan, Gupta'),
  (410, 'Part C: India', 8,  'Medieval India: Delhi Sultanate, Mughal, Bhakti-Sufi, Vijayanagara, Maratha'),
  (420, 'Part C: India', 16, 'Modern India I: 1857 Revolt, INC & Gandhi''s Movements'),
  (430, 'Part C: India', 17, 'Modern India II: Constitutional Acts, Reform Movements, Partition & Tribal Movements'),
  (440, 'Part C: India', 12, 'Fundamental Rights, DPSP & Fundamental Duties'),
  (450, 'Part C: India', 13, 'Preamble, Constitutional Amendments & Schedules'),
  (460, 'Part C: India', 20, 'President, Parliament, Governor & Judiciary'),
  (470, 'Part C: India', 21, 'Panchayati Raj, Election Commission, Emergency & Centre-State Relations'),
  (480, 'Part C: India', 36, 'Planning/NITI Aayog, Banking (RBI Tools: Repo/CRR/SLR)'),
  (490, 'Part C: India', 37, 'Fiscal Policy/Budget/Deficits, Money & Inflation, Poverty & Unemployment'),
  (500, 'Part C: India', 38, 'International Trade, Agri Economy (MSP/FCI), Tax Structure, HDI & Indices'),
  (510, 'Part C: India', 27, 'Plate Tectonics & Earthquakes, Himalayan Seismic Zones'),
  (520, 'Part C: India', 28, 'Indian Monsoon, Climate Zones & Vegetation'),
  (530, 'Part C: India', 31, 'Rivers of India, Himalayan Physiography'),
  (540, 'Part C: India', 32, 'Census 2011 (National), World Geography Basics'),
  (550, 'Part C: India', 34, 'Agriculture Revolutions, Mineral/Energy Resources, Transport, Industrial Regions'),
  (560, 'Part C: India', 39, 'Physics/Chemistry + Biology/Human Body/Diseases'),
  (570, 'Part C: India', 42, 'ISRO Missions, Defence Tech, IT/Digital India, Biotech, Nanotech'),
  (580, 'Part C: India', null, 'Computer Operation Basics: Hardware, Software, Memory, MS Office, Internet, E-mail & Shortcuts'),
  (600, 'Part D: Current Affairs', 35, 'National CA: Flagship Schemes, Awards, Summits'),
  (610, 'Part D: Current Affairs', 46, 'Flagship Schemes, Awards (Padma/Sports), Reports & Indices'),
  (620, 'Part D: Current Affairs', 49, 'National CA Update: Science/Defence Developments, Sports'),
  (630, 'Part D: Current Affairs', 40, 'Uttarakhand CA: State Schemes, Disaster Management, UK Awards'),
  (640, 'Part D: Current Affairs', 50, 'Final Integrated CA: Uttarakhand + National Combined'),
  (700, 'Part E: General Aptitude (CSAT)', 47, 'Reading Comprehension + Logical Reasoning'),
  (710, 'Part E: General Aptitude (CSAT)', 48, 'Quantitative Aptitude + Data Interpretation + Decision Making'),
  (720, 'Part E: General Aptitude (CSAT)', null, 'C1 Number & Letter Series'),
  (730, 'Part E: General Aptitude (CSAT)', null, 'C2 Analogy & Classification (Verbal and Figure)'),
  (740, 'Part E: General Aptitude (CSAT)', null, 'C3 Coding-Decoding (Letter, Number, Language)'),
  (750, 'Part E: General Aptitude (CSAT)', null, 'C4 Blood Relations & Direction Sense'),
  (760, 'Part E: General Aptitude (CSAT)', null, 'C5 Order, Ranking & Seating Arrangement'),
  (770, 'Part E: General Aptitude (CSAT)', null, 'C6 Clock, Calendar & Mirror Time'),
  (780, 'Part E: General Aptitude (CSAT)', null, 'C7 Mathematical Operations, Symbols & Missing Number'),
  (790, 'Part E: General Aptitude (CSAT)', null, 'C8 Venn Diagrams & Syllogism'),
  (800, 'Part E: General Aptitude (CSAT)', null, 'C9 Non-Verbal Reasoning: Mirror/Water Image, Figure Counting, Dice, Paper Folding'),
  (810, 'Part E: General Aptitude (CSAT)', null, 'C10 Arithmetic I: Number System, Simplification, Percentage, Average'),
  (820, 'Part E: General Aptitude (CSAT)', null, 'C11 Arithmetic II: Ratio, Ages, Speed-Time-Distance, Time & Work, Profit & Loss'),
  (830, 'Part E: General Aptitude (CSAT)', null, 'C12 Puzzles, Decision Making & Full Aptitude Practice'),
  (900, 'Bonus (not in the Lower PCS syllabus)', 43, 'Environment I: National Parks/Sanctuaries, Climate Change Protocols'),
  (910, 'Bonus (not in the Lower PCS syllabus)', 44, 'Environment II: Pollution & Legislation, Biodiversity Hotspots, Wetlands/Ramsar, SDGs'),
  (920, 'Bonus (not in the Lower PCS syllabus)', 45, 'International Relations: G20/BRICS/SCO/QUAD, India''s Role in Global Summits')
),
src as (
  -- one lesson per Crash Course video number (the first, if a number was uploaded twice)
  select distinct on (plan_no) * from (
    select l.*, (substring(l.title from '(?i)video\s*(\d{1,3})'))::int as plan_no
    from lessons l join packages cc on cc.id = l.package_id
    where cc.slug = 'crash-course' and l.is_active = true
  ) n
  where plan_no is not null
  order by plan_no, sort_order, created_at
),
target as (select id from packages where slug = 'lower-pcs-crash-course')
insert into lessons (package_id, title, description, youtube_id, bunny_video_id, pdf_en_path, pdf_hi_path,
                     sort_order, release_at, is_active, section, source_lesson_id, created_at, updated_at)
select t.id,
       -- the copied lesson's own title without "Video N", else the plan title
       coalesce(nullif(btrim(regexp_replace(regexp_replace(s.title, '[\(\[]?\mvideo\s*\d{1,3}\M[\)\]]?\s*[:\-–—.|]?', ' ', 'gi'), '\s+', ' ', 'g')), ''), p.title),
       s.description, s.youtube_id, s.bunny_video_id, s.pdf_en_path, s.pdf_hi_path,
       p.sort_order, null, true, p.section, s.id, now(), now()
from plan p
cross join target t
left join src s on s.plan_no = p.plan_no
where not exists (
  select 1 from lessons x
  where x.package_id = t.id
    and (x.source_lesson_id = s.id or (s.id is null and x.source_lesson_id is null and x.title = p.title))
);

-- 3b. TRI Add-on videos: 5 copies + 4 placeholders.
with plan(sort_order, section, plan_no, title) as (values
  (10, 'TRI topics', null::int, 'Urbanization I: Urban Growth, Census Trends, Smart Cities & Housing'),
  (20, 'TRI topics', null, 'Urbanization II: Urban Local Bodies (74th Amendment), Municipal Governance, Sanitation & Civic Amenities'),
  (30, 'TRI topics', null, 'Indian Agriculture: Crops, Cropping Patterns, Irrigation, Soil Health, Green Revolution & Schemes'),
  (40, 'TRI topics', null, 'Statistics, Graphs & Diagrams: Bar, Pie, Line, Tables, Mean-Median-Mode'),
  (100, 'Also for TRI (from the course)', 34, 'Agriculture Revolutions, Mineral/Energy Resources, Transport, Industrial Regions'),
  (110, 'Also for TRI (from the course)', 48, 'Quantitative Aptitude + Data Interpretation + Decision Making'),
  (120, 'Also for TRI (from the course)', 43, 'Environment I: National Parks/Sanctuaries, Climate Change Protocols'),
  (130, 'Also for TRI (from the course)', 44, 'Environment II: Pollution & Legislation, Biodiversity Hotspots, Wetlands/Ramsar, SDGs'),
  (140, 'Also for TRI (from the course)', 49, 'National CA Update: Science/Defence Developments, Sports')
),
src as (
  -- one lesson per Crash Course video number (the first, if a number was uploaded twice)
  select distinct on (plan_no) * from (
    select l.*, (substring(l.title from '(?i)video\s*(\d{1,3})'))::int as plan_no
    from lessons l join packages cc on cc.id = l.package_id
    where cc.slug = 'crash-course' and l.is_active = true
  ) n
  where plan_no is not null
  order by plan_no, sort_order, created_at
),
target as (select id from packages where slug = 'tri-addon-videos')
insert into lessons (package_id, title, description, youtube_id, bunny_video_id, pdf_en_path, pdf_hi_path,
                     sort_order, release_at, is_active, section, source_lesson_id, created_at, updated_at)
select t.id,
       coalesce(nullif(btrim(regexp_replace(regexp_replace(s.title, '[\(\[]?\mvideo\s*\d{1,3}\M[\)\]]?\s*[:\-–—.|]?', ' ', 'gi'), '\s+', ' ', 'g')), ''), p.title),
       s.description, s.youtube_id, s.bunny_video_id, s.pdf_en_path, s.pdf_hi_path,
       p.sort_order, null, true, p.section, s.id, now(), now()
from plan p
cross join target t
left join src s on s.plan_no = p.plan_no
where not exists (
  select 1 from lessons x
  where x.package_id = t.id
    and (x.source_lesson_id = s.id or (s.id is null and x.source_lesson_id is null and x.title = p.title))
);

-- ===================================================================
-- 4. Placeholder tests (0 questions → students see "Soon"; fill later)
--    Marking copied from Full Mock 1 (1 mark, negative marking as set there).
-- ===================================================================
insert into tests (id, test_name, package_id, subject, total_questions, duration_minutes,
                   negative_marking_enabled, negative_marking_value, marks_per_question, question_ids, is_free_test)
select v.id::uuid, v.name, p.id, v.subject, v.q, v.mins,
       coalesce(fm.negative_marking_enabled, true), coalesce(fm.negative_marking_value, 0.25), coalesce(fm.marks_per_question, 1.0),
       '{}'::uuid[], v.free
from (values
  ('ee7a47b0-69d0-4e50-b611-9b343f6d5834', 'Lower PCS 2025 Actual Paper (Timed)', 'lower-pcs-test-series', 'Full Length', 150, 120, true),
  ('bc9f9ecf-ee76-49b3-82b7-4e115d2b6195', 'Lower PCS Full Length Test 1',  'lower-pcs-test-series', 'Full Length', 150, 120, false),
  ('9836e876-0146-41e3-8daf-def58646d656', 'Lower PCS Full Length Test 2',  'lower-pcs-test-series', 'Full Length', 150, 120, false),
  ('9fa0a76f-2d2f-4ae3-97a8-e8c0e6ef5416', 'Lower PCS Full Length Test 3',  'lower-pcs-test-series', 'Full Length', 150, 120, false),
  ('65fe6031-aee0-4214-b322-1d752b84a1f9', 'Lower PCS Full Length Test 4',  'lower-pcs-test-series', 'Full Length', 150, 120, false),
  ('dbc2257c-b004-4866-9724-a3991d60e2b8', 'Lower PCS Full Length Test 5',  'lower-pcs-test-series', 'Full Length', 150, 120, false),
  ('ae82fd97-946a-437a-a038-51704d018f05', 'Lower PCS Full Length Test 6',  'lower-pcs-test-series', 'Full Length', 150, 120, false),
  ('74647c1b-e657-49b5-9456-2268408f709a', 'Lower PCS Full Length Test 7',  'lower-pcs-test-series', 'Full Length', 150, 120, false),
  ('1db770c5-0b42-4cc5-b799-7f5f60f8226f', 'Lower PCS Full Length Test 8',  'lower-pcs-test-series', 'Full Length', 150, 120, false),
  ('c9b2591a-9a76-4c02-91a1-19bdae4c5d04', 'Lower PCS Full Length Test 9',  'lower-pcs-test-series', 'Full Length', 150, 120, false),
  ('8a07695b-c797-4e45-b501-9d31c0685661', 'Lower PCS Full Length Test 10', 'lower-pcs-test-series', 'Full Length', 150, 120, false),
  ('6f5c4c36-46bf-4d57-a9b7-8fbf42b8ac23', 'CSAT Sectional 1: Number & Letter Series',                  'lower-pcs-csat-tests', 'CSAT', 50, 45, false),
  ('d83d6efa-ecf0-424d-aba1-a15570213ba1', 'CSAT Sectional 2: Analogy & Classification',                'lower-pcs-csat-tests', 'CSAT', 50, 45, false),
  ('a7baa41e-59fb-4f1c-8987-81d78a60296c', 'CSAT Sectional 3: Coding-Decoding',                         'lower-pcs-csat-tests', 'CSAT', 50, 45, false),
  ('cf5ba8a6-2645-4a01-865f-26c3f76527ba', 'CSAT Sectional 4: Blood Relations & Direction Sense',       'lower-pcs-csat-tests', 'CSAT', 50, 45, false),
  ('a0af2705-c92b-47d9-ac84-284ab22332bb', 'CSAT Sectional 5: Order, Ranking & Seating Arrangement',    'lower-pcs-csat-tests', 'CSAT', 50, 45, false),
  ('5be1d1c9-6c58-4585-96d1-23e4ef8c198e', 'CSAT Sectional 6: Clock, Calendar & Mirror Time',          'lower-pcs-csat-tests', 'CSAT', 50, 45, false),
  ('71c99337-105a-4037-8ca8-7113161cf64e', 'CSAT Sectional 7: Mathematical Operations & Missing Number','lower-pcs-csat-tests', 'CSAT', 50, 45, false),
  ('aa8147fc-6f06-46f6-9834-16ac967cd247', 'CSAT Sectional 8: Venn Diagrams & Syllogism',               'lower-pcs-csat-tests', 'CSAT', 50, 45, false),
  ('62e6525d-eb05-48fe-b8ea-3c7e9689462a', 'CSAT Sectional 9: Non-Verbal Reasoning',                    'lower-pcs-csat-tests', 'CSAT', 50, 45, false),
  ('ccac550d-0f49-480b-9cfb-8155754f5b2a', 'CSAT Sectional 10: Arithmetic I',                           'lower-pcs-csat-tests', 'CSAT', 50, 45, false),
  ('4b59f09e-b835-46a2-b72b-44bae360d265', 'CSAT Sectional 11: Arithmetic II',                          'lower-pcs-csat-tests', 'CSAT', 50, 45, false),
  ('d64f8828-34ff-4532-ba6f-759a297fb953', 'CSAT Sectional 12: Full Aptitude (2025 level)',             'lower-pcs-csat-tests', 'CSAT', 50, 45, false),
  ('903e3e6e-df32-445e-b525-ed71e18838c7', 'TRI Pattern Mock 1', 'tri-addon-tests', 'Full Length', 200, 180, false),
  ('0b854d3a-1fc8-4b2e-a76b-49df86371950', 'TRI Pattern Mock 2', 'tri-addon-tests', 'Full Length', 200, 180, false),
  ('1259ccf8-aa16-4770-838f-1e28e3d782da', 'TRI Pattern Mock 3', 'tri-addon-tests', 'Full Length', 200, 180, false)
) as v(id, name, pkg, subject, q, mins, free)
join packages p on p.slug = v.pkg
left join lateral (select * from tests f where f.test_name = 'Full Mock 1' order by f.created_at limit 1) fm on true
where not exists (select 1 from tests t where t.id = v.id::uuid);

-- ===================================================================
-- 5. Test links (package_tests). test_order keeps a sensible order.
-- ===================================================================
-- 5a. Lower PCS & RO/ARO Test Series
with picks as (
  -- placeholders first in their tabs
  select id as test_id, 0 as grp, test_name from tests
  where id in ('ee7a47b0-69d0-4e50-b611-9b343f6d5834','bc9f9ecf-ee76-49b3-82b7-4e115d2b6195','9836e876-0146-41e3-8daf-def58646d656',
               '9fa0a76f-2d2f-4ae3-97a8-e8c0e6ef5416','65fe6031-aee0-4214-b322-1d752b84a1f9','dbc2257c-b004-4866-9724-a3991d60e2b8',
               'ae82fd97-946a-437a-a038-51704d018f05','74647c1b-e657-49b5-9456-2268408f709a','1db770c5-0b42-4cc5-b799-7f5f60f8226f',
               'c9b2591a-9a76-4c02-91a1-19bdae4c5d04','8a07695b-c797-4e45-b501-9d31c0685661')
  union all
  select id, 1, test_name from tests
  where id in ('6f5c4c36-46bf-4d57-a9b7-8fbf42b8ac23','d83d6efa-ecf0-424d-aba1-a15570213ba1','a7baa41e-59fb-4f1c-8987-81d78a60296c',
               'cf5ba8a6-2645-4a01-865f-26c3f76527ba','a0af2705-c92b-47d9-ac84-284ab22332bb','5be1d1c9-6c58-4585-96d1-23e4ef8c198e',
               '71c99337-105a-4037-8ca8-7113161cf64e','aa8147fc-6f06-46f6-9834-16ac967cd247','62e6525d-eb05-48fe-b8ea-3c7e9689462a',
               'ccac550d-0f49-480b-9cfb-8155754f5b2a','4b59f09e-b835-46a2-b72b-44bae360d265','d64f8828-34ff-4532-ba6f-759a297fb953')
  union all
  -- Premium's tests except its full mocks and CSAT 1-6
  select t.id, 2 + pt.test_order / 1000.0, t.test_name
  from package_tests pt
  join packages p on p.id = pt.package_id and p.slug = 'premium-test-series'
  join tests t on t.id = pt.test_id
  where coalesce(t.subject, '') not in ('Full Mock', 'CSAT') and t.test_name !~* '^(full mock|csat)\s*\d'
  union all
  -- Uttarakhand Revision 1-8 and CA Revision 1-6 (Revision Test Series)
  select t.id, 3, t.test_name from tests t where t.test_name ~* '^(uttarakhand|ca) revision \d+$'
),
target as (select id from packages where slug = 'lower-pcs-test-series'),
ordered as (
  select distinct on (test_id) test_id, grp, test_name from picks order by test_id, grp
)
insert into package_tests (package_id, test_id, test_order)
select t.id, o.test_id, row_number() over (order by o.grp, o.test_name)
from ordered o cross join target t
where not exists (select 1 from package_tests x where x.package_id = t.id and x.test_id = o.test_id);

-- 5b. CSAT tests (Individual CSAT product): 12 sectionals + the older CSAT 1-6
with picks as (
  select t.id as test_id, t.test_name, 0 as grp from tests t where t.subject = 'CSAT' and t.test_name like 'CSAT Sectional %'
  union all
  select t.id, t.test_name, 1 from package_tests pt
  join packages p on p.id = pt.package_id and p.slug = 'csat-test-series'
  join tests t on t.id = pt.test_id
),
target as (select id from packages where slug = 'lower-pcs-csat-tests')
insert into package_tests (package_id, test_id, test_order)
select t.id, pk.test_id, row_number() over (order by pk.grp, length(pk.test_name), pk.test_name)
from (select distinct on (test_id) * from picks order by test_id, grp) pk cross join target t
where not exists (select 1 from package_tests x where x.package_id = t.id and x.test_id = pk.test_id);

-- 5c. TRI pattern mocks
insert into package_tests (package_id, test_id, test_order)
select p.id, t.id, row_number() over (order by t.test_name)
from packages p join tests t on t.test_name like 'TRI Pattern Mock %'
where p.slug = 'tri-addon-tests'
  and not exists (select 1 from package_tests x where x.package_id = p.id and x.test_id = t.id);

-- 5d. Free bonus for existing packs that now sit inside the Individual products:
--     Uttarakhand Intensive gets Uttarakhand Revision 1-8; CA Intensive gets CA Revision 1-6.
insert into package_tests (package_id, test_id, test_order)
select p.id, t.id, 1000 + row_number() over (partition by p.id order by length(t.test_name), t.test_name)
from packages p
join tests t on (p.slug = 'uttarakhand-intensive' and t.test_name ~* '^uttarakhand revision \d+$')
             or (p.slug = 'current-affairs-intensive' and t.test_name ~* '^ca revision \d+$')
where not exists (select 1 from package_tests x where x.package_id = p.id and x.test_id = t.id);

-- ===================================================================
-- 6. Store listing for the old products
-- ===================================================================
-- Upper PCS 29 Nov products: Upper tab, label, automatic end of sale.
update packages set metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
  'exam_tab', 'upper', 'listed', true, 'card_label', 'Upper PCS · 29 Nov', 'sale_ends_at', '2026-11-29T23:59:59+05:30')
where slug in ('revision-test-series', 'basic-test-series');

update packages set metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
  'exam_tab', 'upper', 'listed', true, 'card_label', 'Upper PCS · 29 Nov', 'sale_ends_at', '2026-11-25T23:59:59+05:30')
where slug in ('mock-mahasangram', 'complete-prelims-pack');

-- Premium stays on sale (it becomes the Upper PCS 2027 Test Series on 30 Nov).
update packages set metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
  'exam_tab', 'upper', 'listed', true, 'card_label', 'Upper PCS · 29 Nov')
where slug = 'premium-test-series';

-- Hidden from every list now (pages + access keep working).
update packages set metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object('exam_tab', 'upper', 'listed', false)
where slug in ('crash-course', 'national-crash-course', 'current-affairs-intensive', 'prelims-mentorship', 'csat-test-series',
               'uttarakhand-crash-course', 'uttarakhand-intensive', 'complete-prelims-combo');

-- ===================================================================
-- Check (should list the new products with their prices and counts):
-- select slug, package_name, price, founding_price, metadata->>'exam_tab' tab, metadata->>'listed' listed,
--        (select count(*) from lessons l where l.package_id = p.id and l.is_active) lessons,
--        (select count(*) from package_tests pt where pt.package_id = p.id) tests
-- from packages p where metadata ? 'exam_tab' order by metadata->>'exam_tab', sort_order;
--
-- Lessons copied without a video (should be only the placeholders):
-- select sort_order, title from lessons where package_id = (select id from packages where slug = 'lower-pcs-crash-course')
--   and youtube_id is null and bunny_video_id is null order by sort_order;
-- ===================================================================
select 'phase 47 lower pcs relaunch ready' as status;
