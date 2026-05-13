USE englishflow_ai;

INSERT IGNORE INTO words (
  word,
  phonetic,
  part_of_speech,
  meaning_zh,
  meaning_en,
  example_sentence,
  example_translation,
  difficulty_level
) VALUES
  (
    'access',
    '/ˈækses/',
    'n./v.',
    '通道；使用权；访问',
    'the right or opportunity to use or enter something',
    'Students can access the online library for free.',
    '学生可以免费访问在线图书馆。',
    1
  ),
  (
    'accessible',
    '/əkˈsesəbl/',
    'adj.',
    '可进入的；可使用的；易懂的',
    'easy to enter, use, reach, or understand',
    'The website is accessible to all students.',
    '这个网站对所有学生都可以使用。',
    1
  ),
  (
    'accessibility',
    '/əkˌsesəˈbɪləti/',
    'n.',
    '可达性；易用性；无障碍性',
    'the quality of being easy to enter, use, reach, or understand',
    'The app was designed to improve accessibility.',
    '这个应用的设计是为了提高易用性。',
    1
  );

SET @access_id = (
  SELECT id
  FROM words
  WHERE word = 'access'
  LIMIT 1
);

SET @accessible_id = (
  SELECT id
  FROM words
  WHERE word = 'accessible'
  LIMIT 1
);

SET @accessibility_id = (
  SELECT id
  FROM words
  WHERE word = 'accessibility'
  LIMIT 1
);

INSERT INTO word_family_groups (
  family_key,
  family_name,
  core_word_id,
  explanation,
  difficulty,
  source
) VALUES (
  'access',
  'access family',
  @access_id,
  'access 表示进入、访问、使用；accessible 表示可以被进入/使用的；accessibility 表示可进入/可使用的性质。',
  'CET4',
  'manual_reviewed'
)
ON DUPLICATE KEY UPDATE
  family_name = VALUES(family_name),
  core_word_id = VALUES(core_word_id),
  explanation = VALUES(explanation),
  difficulty = VALUES(difficulty),
  source = VALUES(source);

SET @family_group_id = (
  SELECT id
  FROM word_family_groups
  WHERE family_key = 'access'
  LIMIT 1
);

DELETE FROM word_family_members
WHERE family_group_id = @family_group_id;

INSERT INTO word_family_members (
  family_group_id,
  word_id,
  role,
  relation_explanation,
  display_order
)
SELECT
  @family_group_id,
  @access_id,
  'core',
  'access 是核心词，表示进入、访问或使用某个地点、系统、信息或资源。',
  1
WHERE @family_group_id IS NOT NULL
  AND @access_id IS NOT NULL;

INSERT INTO word_family_members (
  family_group_id,
  word_id,
  role,
  relation_explanation,
  display_order
)
SELECT
  @family_group_id,
  @accessible_id,
  'derived',
  'accessible 是 access 的形容词形式，表示可以被进入、使用、到达或理解的。',
  2
WHERE @family_group_id IS NOT NULL
  AND @accessible_id IS NOT NULL;

INSERT INTO word_family_members (
  family_group_id,
  word_id,
  role,
  relation_explanation,
  display_order
)
SELECT
  @family_group_id,
  @accessibility_id,
  'derived',
  'accessibility 是 access 的名词派生形式，表示可进入、可使用或易理解的性质。',
  3
WHERE @family_group_id IS NOT NULL
  AND @accessibility_id IS NOT NULL;
