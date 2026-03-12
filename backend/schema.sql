-- ══════════════════════════════════════════════════════════
--  TaskFlow — Full Schema  (fresh install)
--  Usage:  mysql -u root -p < schema.sql
--
--  WARNING: drops and recreates taskflow_db entirely.
--  For existing databases, run migrate.sql instead.
-- ══════════════════════════════════════════════════════════

DROP DATABASE IF EXISTS taskflow_db;
CREATE DATABASE taskflow_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE taskflow_db;

-- ── users ─────────────────────────────────────────────────
CREATE TABLE users (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(255) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email)
);

-- ── categories ────────────────────────────────────────────
CREATE TABLE categories (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id    INT UNSIGNED NOT NULL,
  name       VARCHAR(100) NOT NULL,
  color      VARCHAR(7)   NOT NULL DEFAULT '#f59e0b',
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (user_id)
);

-- ── todos ─────────────────────────────────────────────────
CREATE TABLE todos (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     INT UNSIGNED NOT NULL,
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  completed   TINYINT(1)   NOT NULL DEFAULT 0,
  priority    ENUM('low','medium','high') NOT NULL DEFAULT 'medium',
  due_date    DATE,
  category_id INT UNSIGNED,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)     REFERENCES users(id)      ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  INDEX idx_user      (user_id),
  INDEX idx_completed (completed),
  INDEX idx_priority  (priority),
  INDEX idx_category  (category_id),
  INDEX idx_due_date  (due_date)
);