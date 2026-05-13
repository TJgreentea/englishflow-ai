USE englishflow_ai;

CREATE TABLE IF NOT EXISTS word_family_groups (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  family_key VARCHAR(100) NOT NULL,
  family_name VARCHAR(150) NOT NULL,
  core_word_id BIGINT UNSIGNED NULL,
  explanation TEXT NULL,
  difficulty VARCHAR(50) NOT NULL DEFAULT 'CET4',
  source VARCHAR(50) NOT NULL DEFAULT 'manual_reviewed',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_word_family_groups_family_key (family_key),
  KEY idx_word_family_groups_core_word_id (core_word_id),
  CONSTRAINT fk_word_family_groups_core_word_id
    FOREIGN KEY (core_word_id) REFERENCES words(id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS word_family_members (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  family_group_id BIGINT UNSIGNED NOT NULL,
  word_id BIGINT UNSIGNED NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'related',
  relation_explanation TEXT NULL,
  display_order INT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_word_family_members_group_word (family_group_id, word_id),
  KEY idx_word_family_members_word_id (word_id),
  KEY idx_word_family_members_group_order (family_group_id, display_order),
  CONSTRAINT fk_word_family_members_family_group_id
    FOREIGN KEY (family_group_id) REFERENCES word_family_groups(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_word_family_members_word_id
    FOREIGN KEY (word_id) REFERENCES words(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
