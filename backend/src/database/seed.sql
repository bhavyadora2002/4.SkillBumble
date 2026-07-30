-- SkillBumble sample data
-- Run after schema.sql: mysql -u root -p skillbumble < seed.sql
-- Uses fixed UUIDs (via session variables) so rows can reference each other.

USE skillbumble;

-- ---------------------------------------------------------------------------
-- users  (password_hash values are placeholder bcrypt-shaped strings, not real hashes)
-- ---------------------------------------------------------------------------
SET @priya  = 'a1000000-0000-4000-8000-000000000001';
SET @marcus = 'a1000000-0000-4000-8000-000000000002';
SET @chen   = 'a1000000-0000-4000-8000-000000000003';
SET @alex   = 'a1000000-0000-4000-8000-000000000004';
SET @sam    = 'a1000000-0000-4000-8000-000000000005';

INSERT INTO users (user_id, name, email, password_hash, bio, location, credit_balance, rating_overall, meeting_link) VALUES
(@priya,  'Priya Sharma',  'priya@example.com',  '$2b$12$placeholderhashpriya00000000000000000000000000000000', 'Freelance graphic designer. Figma & Photoshop expert, learning Python for side projects.', 'Bengaluru, IN', 0,    4.8, 'https://meet.jit.si/skillbumble-priya'),
(@marcus, 'Marcus Lee',    'marcus@example.com', '$2b$12$placeholderhashmarcus0000000000000000000000000000000', 'Software engineer. Happy to teach Python, want to pick up Spanish before a trip.', 'Austin, US',    12.5, 4.9, 'https://meet.jit.si/skillbumble-marcus'),
(@chen,   'Elena Chen',    'chen@example.com',   '$2b$12$placeholderhashchen000000000000000000000000000000000', 'High school teacher, decades of public speaking experience. Cautious online, keeping it simple.', 'Portland, US', 0, 5.0, 'https://meet.jit.si/skillbumble-chen'),
(@alex,   'Alex Rivera',   'alex@example.com',   '$2b$12$placeholderhashalex0000000000000000000000000000000000', 'Play guitar for 15 years, always wanted to get better at public speaking for work.', 'Madrid, ES', 0,    4.6, 'https://meet.jit.si/skillbumble-alex'),
(@sam,    'Sam Okafor',    'sam@example.com',    '$2b$12$placeholderhashsam00000000000000000000000000000000000', 'Learning to code, taking any group session I can find.', 'Lagos, NG', 0,       0.0, 'https://meet.jit.si/skillbumble-sam');

-- ---------------------------------------------------------------------------
-- skills  (global catalog — name + category only, no description column)
-- ---------------------------------------------------------------------------
SET @sk_python  = 'b2000000-0000-4000-8000-000000000001';
SET @sk_figma   = 'b2000000-0000-4000-8000-000000000002';
SET @sk_spanish = 'b2000000-0000-4000-8000-000000000003';
SET @sk_guitar  = 'b2000000-0000-4000-8000-000000000004';
SET @sk_speak   = 'b2000000-0000-4000-8000-000000000005';

INSERT INTO skills (skill_id, skill_name, category) VALUES
(@sk_python,  'Python Programming', 'Programming'),
(@sk_figma,   'Figma Design',       'Design'),
(@sk_spanish, 'Spanish Language',   'Languages'),
(@sk_guitar,  'Guitar',             'Music'),
(@sk_speak,   'Public Speaking',    'Business');

-- ---------------------------------------------------------------------------
-- user_skills  (the personal description now lives here, per user, per skill)
-- ---------------------------------------------------------------------------
INSERT INTO user_skills (user_id, skill_id, type, proficiency_level, description) VALUES
-- Priya
(@priya,  @sk_figma,   'teach', 'expert',       'I design UI/UX for startups full time. I can walk you through components, auto-layout, and prototyping.'),
(@priya,  @sk_python,  'learn', 'beginner',     'Never written code before, want to automate small design tasks.'),
-- Marcus
(@marcus, @sk_python,  'teach', 'expert',       '10 years writing Python professionally, comfortable teaching from basics to backend APIs.'),
(@marcus, @sk_spanish, 'learn', 'beginner',     'Trip to Mexico in 3 months, want conversational basics.'),
(@marcus, @sk_figma,   'learn', 'beginner',     'Want to mock up my own side projects instead of hiring a designer.'),
-- Elena Chen
(@chen,   @sk_speak,   'teach', 'expert',       '25 years teaching + public speaking coaching, glad to help with nerves and structure.'),
(@chen,   @sk_guitar,  'learn', 'beginner',     'Always wanted to learn as an adult, own an acoustic guitar already.'),
-- Alex
(@alex,   @sk_guitar,  'teach', 'advanced',     'Play in a weekend band, can teach chords, strumming patterns, and basic music theory.'),
(@alex,   @sk_speak,   'learn', 'beginner',     'Need to present more confidently at work.'),
(@alex,   @sk_spanish, 'teach', 'expert',       'Native speaker, happy to do conversational practice.'),
-- Sam
(@sam,    @sk_python,  'learn', 'beginner',     'Self-taught so far from videos, want structured group sessions.');

-- ---------------------------------------------------------------------------
-- matches  (GiveAndTake mode)
-- ---------------------------------------------------------------------------
SET @match_marcus_priya = 'c3000000-0000-4000-8000-000000000001';
SET @match_chen_alex    = 'c3000000-0000-4000-8000-000000000002';

INSERT INTO matches (match_id, user1_id, user2_id, skill_from_user1_id, skill_from_user2_id, match_status, confirmed_at) VALUES
(@match_marcus_priya, @marcus, @priya, @sk_python, @sk_figma, 'confirmed', NOW()),
(@match_chen_alex,    @chen,   @alex,  @sk_speak,  @sk_guitar, 'pending',  NULL);

-- ---------------------------------------------------------------------------
-- posts  (EarnCredits mode)
-- ---------------------------------------------------------------------------
SET @post_python = 'd4000000-0000-4000-8000-000000000001';

INSERT INTO posts (post_id, user_id, skill_id, title, description, status) VALUES
(@post_python, @marcus, @sk_python, 'Python Basics Group Session', 'Weekly group session covering Python fundamentals for beginners, bring your own project ideas.', 'active');

-- ---------------------------------------------------------------------------
-- sessions
-- ---------------------------------------------------------------------------
SET @sess_python_to_priya = 'e5000000-0000-4000-8000-000000000001';
SET @sess_figma_to_marcus = 'e5000000-0000-4000-8000-000000000002';
SET @sess_guitar_to_chen  = 'e5000000-0000-4000-8000-000000000003';
SET @sess_post_sam        = 'e5000000-0000-4000-8000-000000000004';

INSERT INTO sessions (session_id, match_id, post_id, teacher_id, learner_id, meeting_link, scheduled_time, duration, session_status) VALUES
(@sess_python_to_priya, @match_marcus_priya, NULL, @marcus, @priya, 'https://meet.jit.si/skillbumble-marcus', '2026-07-20 15:00:00', 60, 'completed'),
(@sess_figma_to_marcus, @match_marcus_priya, NULL, @priya,  @marcus, 'https://meet.jit.si/skillbumble-priya', '2026-07-22 15:00:00', 60, 'completed'),
(@sess_guitar_to_chen,  @match_chen_alex,    NULL, @alex,   @chen,   'https://meet.jit.si/skillbumble-alex',  '2026-08-05 18:00:00', 45, 'scheduled'),
(@sess_post_sam,        NULL, @post_python,       @marcus, @sam,    'https://meet.jit.si/skillbumble-marcus', '2026-07-25 17:00:00', 90, 'completed');

-- ---------------------------------------------------------------------------
-- ratings  (only for completed sessions, one row per direction)
-- ---------------------------------------------------------------------------
INSERT INTO ratings (session_id, rater_id, ratee_id, score, comment) VALUES
(@sess_python_to_priya, @priya,  @marcus, 5, 'Explained Python variables and loops really clearly.'),
(@sess_python_to_priya, @marcus, @priya,  5, 'Great questions, picked things up fast.'),
(@sess_figma_to_marcus, @marcus, @priya,  5, 'Figma auto-layout finally makes sense.'),
(@sess_figma_to_marcus, @priya,  @marcus, 4, 'Good session, ran a bit long.'),
(@sess_post_sam,        @sam,    @marcus, 5, 'Loved the group format, will join the next one.'),
(@sess_post_sam,        @marcus, @sam,    4, 'Engaged and asked good questions.');

-- ---------------------------------------------------------------------------
-- credit_transactions
-- ---------------------------------------------------------------------------
INSERT INTO credit_transactions (user_id, amount, reason, session_id) VALUES
(@marcus, 1.00, 'earned', @sess_post_sam),
(@marcus, 0.50, 'bonus',  NULL);
