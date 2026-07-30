-- Migration: Add enrollments table for credit-based enrollment
-- Run: mysql -u root -p skillbumble < migration2.sql

USE skillbumble;

CREATE TABLE IF NOT EXISTS enrollments (
    enrollment_id   CHAR(36)      NOT NULL DEFAULT (UUID()) PRIMARY KEY,
    post_id         CHAR(36)      NOT NULL,
    learner_id      CHAR(36)      NOT NULL,
    credits_paid    DECIMAL(10,2) NOT NULL DEFAULT 1.00,
    status          ENUM('enrolled','completed','cancelled') NOT NULL DEFAULT 'enrolled',
    created_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_enrollments_post    FOREIGN KEY (post_id)    REFERENCES posts(post_id) ON DELETE CASCADE,
    CONSTRAINT fk_enrollments_learner FOREIGN KEY (learner_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;
