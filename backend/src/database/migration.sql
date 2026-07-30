-- Migration: Give & Take posts + match linking
-- Run after schema.sql: mysql -u root -p skillbumble < migration.sql

USE skillbumble;

ALTER TABLE posts
  ADD COLUMN type ENUM('teach','learn') NOT NULL AFTER skill_id,
  ADD COLUMN proficiency_level ENUM('beginner','intermediate','advanced','expert') NOT NULL DEFAULT 'beginner' AFTER type;

ALTER TABLE posts
  MODIFY COLUMN status ENUM('open','matched','closed') NOT NULL DEFAULT 'open';

ALTER TABLE matches
  ADD COLUMN post_id CHAR(36) NULL AFTER match_id;

ALTER TABLE matches
  ADD CONSTRAINT fk_matches_post FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE SET NULL;
