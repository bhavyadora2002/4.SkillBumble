-- SkillBumble database schema (MySQL 8.0+)
-- Run: mysql -u root -p < schema.sql

CREATE DATABASE IF NOT EXISTS skillbumble
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE skillbumble;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS credit_transactions;
DROP TABLE IF EXISTS ratings;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS matches;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS user_skills;
DROP TABLE IF EXISTS skills;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

-- ---------------------------------------------------------------------------
-- users
-- ---------------------------------------------------------------------------
CREATE TABLE users (
  user_id                    CHAR(36)      NOT NULL DEFAULT (UUID()) PRIMARY KEY,
  name                       VARCHAR(255)  NOT NULL,
  email                      VARCHAR(255)  NOT NULL,
  password_hash              VARCHAR(255)  NOT NULL,
  bio                        TEXT          NULL,
  location                   VARCHAR(255)  NULL,
  profile_image              VARCHAR(500)  NULL,
  credit_balance             DECIMAL(10,2) NOT NULL DEFAULT 0,
  rating_overall             DECIMAL(3,2)  NOT NULL DEFAULT 0,
  meeting_link               VARCHAR(500)  NOT NULL,
  meeting_link_last_used     TIMESTAMP     NULL,
  meeting_link_active_flag   BOOLEAN       NOT NULL DEFAULT TRUE,
  created_at                 TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at                 TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_users_email (email),
  UNIQUE KEY uq_users_meeting_link (meeting_link),
  CHECK (credit_balance >= 0),
  CHECK (rating_overall BETWEEN 0 AND 5)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------------
-- skills  (global catalog — no per-user description, kept intentionally thin)
-- ---------------------------------------------------------------------------
CREATE TABLE skills (
  skill_id     CHAR(36)     NOT NULL DEFAULT (UUID()) PRIMARY KEY,
  skill_name   VARCHAR(255) NOT NULL,
  category     VARCHAR(100) NOT NULL,
  UNIQUE KEY uq_skills_name (skill_name)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------------
-- user_skills  (junction: what a user teaches/learns, IN THEIR OWN WORDS)
-- `description` here is the user's personal blurb about their experience
-- with this skill (e.g. "8 yrs freelance, Figma + Photoshop, happy to teach
-- beginners") — replaces the old catalog-level skills.description.
-- ---------------------------------------------------------------------------
CREATE TABLE user_skills (
  user_skill_id      CHAR(36) NOT NULL DEFAULT (UUID()) PRIMARY KEY,
  user_id            CHAR(36) NOT NULL,
  skill_id           CHAR(36) NOT NULL,
  type               ENUM('teach','learn') NOT NULL,
  proficiency_level  ENUM('beginner','intermediate','advanced','expert') NOT NULL DEFAULT 'beginner',
  description        TEXT NULL,
  visibility_flag    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_user_skill_type (user_id, skill_id, type),
  CONSTRAINT fk_user_skills_user  FOREIGN KEY (user_id)  REFERENCES users(user_id)   ON DELETE CASCADE,
  CONSTRAINT fk_user_skills_skill FOREIGN KEY (skill_id) REFERENCES skills(skill_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------------
-- posts  (EarnCredits mode: one teacher, many learners)
-- ---------------------------------------------------------------------------
CREATE TABLE posts (
  post_id            CHAR(36)     NOT NULL DEFAULT (UUID()) PRIMARY KEY,
  user_id            CHAR(36)     NOT NULL,
  skill_id           CHAR(36)     NOT NULL,
  type               ENUM('teach','learn') NOT NULL,
  proficiency_level  ENUM('beginner','intermediate','advanced','expert') NOT NULL DEFAULT 'beginner',
  title              VARCHAR(255) NOT NULL,
  description        TEXT NULL,
  status             ENUM('open','matched','closed') NOT NULL DEFAULT 'open',
  created_at         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_posts_user  FOREIGN KEY (user_id)  REFERENCES users(user_id)   ON DELETE CASCADE,
  CONSTRAINT fk_posts_skill FOREIGN KEY (skill_id) REFERENCES skills(skill_id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------------
-- matches  (GiveAndTake mode: complementary barter pairing)
-- ---------------------------------------------------------------------------
CREATE TABLE matches (
  match_id              CHAR(36) NOT NULL DEFAULT (UUID()) PRIMARY KEY,
  post_id               CHAR(36) NULL,
  user1_id              CHAR(36) NOT NULL,
  user2_id              CHAR(36) NOT NULL,
  skill_from_user1_id   CHAR(36) NOT NULL,
  skill_from_user2_id   CHAR(36) NOT NULL,
  match_status          ENUM('pending','confirmed','completed','cancelled') NOT NULL DEFAULT 'pending',
  created_at            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  confirmed_at          TIMESTAMP NULL,
  completed_at          TIMESTAMP NULL,
  CONSTRAINT fk_matches_user1  FOREIGN KEY (user1_id) REFERENCES users(user_id) ON DELETE CASCADE,
  CONSTRAINT fk_matches_user2  FOREIGN KEY (user2_id) REFERENCES users(user_id) ON DELETE CASCADE,
  CONSTRAINT fk_matches_post   FOREIGN KEY (post_id)            REFERENCES posts(post_id)      ON DELETE SET NULL,
  CONSTRAINT fk_matches_skill1 FOREIGN KEY (skill_from_user1_id) REFERENCES skills(skill_id)   ON DELETE RESTRICT,
  CONSTRAINT fk_matches_skill2 FOREIGN KEY (skill_from_user2_id) REFERENCES skills(skill_id)   ON DELETE RESTRICT,
  CHECK (user1_id <> user2_id)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------------
-- sessions  (scheduled meeting; comes from a match OR a post enrollment)
-- teacher_id/learner_id are nullable so that deleting a user preserves the
-- session record as an orphan instead of blocking the delete (per brief:
-- "Sessions they taught or learned are preserved but orphaned").
-- ---------------------------------------------------------------------------
CREATE TABLE sessions (
  session_id       CHAR(36) NOT NULL DEFAULT (UUID()) PRIMARY KEY,
  match_id         CHAR(36) NULL,
  post_id          CHAR(36) NULL,
  teacher_id       CHAR(36) NULL,
  learner_id       CHAR(36) NULL,
  meeting_link     VARCHAR(500) NOT NULL,
  scheduled_time   TIMESTAMP NOT NULL,
  duration         INT NOT NULL DEFAULT 60,
  session_status   ENUM('scheduled','in_progress','completed','cancelled') NOT NULL DEFAULT 'scheduled',
  created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_sessions_match   FOREIGN KEY (match_id)   REFERENCES matches(match_id) ON DELETE SET NULL,
  CONSTRAINT fk_sessions_post    FOREIGN KEY (post_id)    REFERENCES posts(post_id)    ON DELETE SET NULL,
  CONSTRAINT fk_sessions_teacher FOREIGN KEY (teacher_id) REFERENCES users(user_id)    ON DELETE SET NULL,
  CONSTRAINT fk_sessions_learner FOREIGN KEY (learner_id) REFERENCES users(user_id)    ON DELETE SET NULL
  -- No CHECK(match_id IS NOT NULL OR post_id IS NOT NULL) here: MySQL 8 (error 3823)
  -- forbids a CHECK constraint on any column that also has an ON DELETE SET NULL
  -- referential action. Enforce "at least one of match_id/post_id" in the app layer.
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------------
-- ratings  (each participant rates the other once per session)
-- ---------------------------------------------------------------------------
CREATE TABLE ratings (
  rating_id    CHAR(36) NOT NULL DEFAULT (UUID()) PRIMARY KEY,
  session_id   CHAR(36) NOT NULL,
  rater_id     CHAR(36) NOT NULL,
  ratee_id     CHAR(36) NOT NULL,
  score        TINYINT NOT NULL,
  comment      TEXT NULL,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_ratings_session_rater (session_id, rater_id),
  CONSTRAINT fk_ratings_session FOREIGN KEY (session_id) REFERENCES sessions(session_id) ON DELETE CASCADE,
  CONSTRAINT fk_ratings_rater   FOREIGN KEY (rater_id)   REFERENCES users(user_id)       ON DELETE CASCADE,
  CONSTRAINT fk_ratings_ratee   FOREIGN KEY (ratee_id)   REFERENCES users(user_id)       ON DELETE CASCADE,
  CHECK (score BETWEEN 1 AND 5),
  CHECK (rater_id <> ratee_id)
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------------
-- credit_transactions  (immutable audit log)
-- ---------------------------------------------------------------------------
CREATE TABLE credit_transactions (
  transaction_id  CHAR(36) NOT NULL DEFAULT (UUID()) PRIMARY KEY,
  user_id         CHAR(36) NOT NULL,
  amount          DECIMAL(10,2) NOT NULL,
  reason          ENUM('earned','spent','bonus','refund') NOT NULL,
  session_id      CHAR(36) NULL,
  timestamp       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_credit_tx_user    FOREIGN KEY (user_id)    REFERENCES users(user_id)       ON DELETE CASCADE,
  CONSTRAINT fk_credit_tx_session FOREIGN KEY (session_id) REFERENCES sessions(session_id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Helpful lookup indexes beyond the FK columns MySQL already indexes
CREATE INDEX idx_user_skills_type   ON user_skills(type);
CREATE INDEX idx_posts_status       ON posts(status);
CREATE INDEX idx_matches_status     ON matches(match_status);
CREATE INDEX idx_sessions_status    ON sessions(session_status);
CREATE INDEX idx_sessions_scheduled ON sessions(scheduled_time);
