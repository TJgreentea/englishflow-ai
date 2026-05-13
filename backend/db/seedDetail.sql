USE englishflow_ai;

SET @column_exists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'word_families'
    AND COLUMN_NAME = 'family_word'
);
SET @sql = IF(
  @column_exists = 0,
  'ALTER TABLE word_families ADD COLUMN family_word VARCHAR(100) NULL AFTER root_word',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @column_exists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'word_families'
    AND COLUMN_NAME = 'family_meaning'
);
SET @sql = IF(
  @column_exists = 0,
  'ALTER TABLE word_families ADD COLUMN family_meaning VARCHAR(500) NULL AFTER family_word',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @column_exists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'word_families'
    AND COLUMN_NAME = 'relation_explanation'
);
SET @sql = IF(
  @column_exists = 0,
  'ALTER TABLE word_families ADD COLUMN relation_explanation TEXT NULL AFTER family_meaning',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @column_exists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'word_notes'
    AND COLUMN_NAME = 'memory_tip'
);
SET @sql = IF(
  @column_exists = 0,
  'ALTER TABLE word_notes ADD COLUMN memory_tip TEXT NULL AFTER word_id',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @column_exists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'word_notes'
    AND COLUMN_NAME = 'root_affix'
);
SET @sql = IF(
  @column_exists = 0,
  'ALTER TABLE word_notes ADD COLUMN root_affix TEXT NULL AFTER memory_tip',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @column_exists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'word_notes'
    AND COLUMN_NAME = 'synonym_comparison'
);
SET @sql = IF(
  @column_exists = 0,
  'ALTER TABLE word_notes ADD COLUMN synonym_comparison TEXT NULL AFTER etymology',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @column_exists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'word_notes'
    AND COLUMN_NAME = 'common_collocations'
);
SET @sql = IF(
  @column_exists = 0,
  'ALTER TABLE word_notes ADD COLUMN common_collocations TEXT NULL AFTER synonym_comparison',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @column_exists = (
  SELECT COUNT(*)
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'word_notes'
    AND COLUMN_NAME = 'difficulty_note'
);
SET @sql = IF(
  @column_exists = 0,
  'ALTER TABLE word_notes ADD COLUMN difficulty_note TEXT NULL AFTER common_collocations',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @word_id = (SELECT id FROM words WHERE word = 'abandon' LIMIT 1);
DELETE FROM word_families WHERE word_id = @word_id;
DELETE FROM word_notes WHERE word_id = @word_id;
INSERT INTO word_families (word_id, family_group, root_word, family_word, family_meaning, relation_explanation, is_in_cet4)
SELECT @word_id, 'abandon', 'abandon', 'abandon', '放弃；抛弃', '核心动词，表示主动放弃计划、责任，或遗弃某人某物。', TRUE WHERE @word_id IS NOT NULL
UNION ALL SELECT @word_id, 'abandoned', 'abandon', 'abandoned', '被遗弃的；废弃的', 'abandon 的过去分词/形容词形式，常形容地点、车辆或人被抛弃。', TRUE WHERE @word_id IS NOT NULL
UNION ALL SELECT @word_id, 'abandonment', 'abandon', 'abandonment', '放弃；遗弃', '名词形式，表示放弃行为或被遗弃的状态，四级阅读中可作为扩展词理解。', FALSE WHERE @word_id IS NOT NULL;
INSERT INTO word_notes (word_id, memory_tip, root_affix, etymology, synonym_comparison, common_collocations, difficulty_note)
SELECT @word_id, 'a + bandon 可联想为“把一件事扔到一边”，记住“放弃、抛弃”的方向感。', '可整体记忆为 abandon；学习时重点掌握 abandoned 和 abandonment 的派生关系。', 'abandon 的来源与“交给、置于控制之外”等含义有关，具体历史演变较复杂，四级阶段掌握现代义即可。', 'abandon 强调完全放弃；give up 更口语，范围更广；desert 常强调离开职责或岗位。', 'abandon a plan, abandon an idea, abandon hope, an abandoned building', '注意 abandon 后常接名词；abandoned 可直接作形容词，如 an abandoned car。' WHERE @word_id IS NOT NULL;

SET @word_id = (SELECT id FROM words WHERE word = 'ability' LIMIT 1);
DELETE FROM word_families WHERE word_id = @word_id;
DELETE FROM word_notes WHERE word_id = @word_id;
INSERT INTO word_families (word_id, family_group, root_word, family_word, family_meaning, relation_explanation, is_in_cet4)
SELECT @word_id, 'ability', 'able', 'ability', '能力；才能', 'able 的名词形式，表示做某事的能力。', TRUE WHERE @word_id IS NOT NULL
UNION ALL SELECT @word_id, 'able', 'able', 'able', '能够的；有能力的', '形容词根词，常用于 be able to do sth.。', TRUE WHERE @word_id IS NOT NULL
UNION ALL SELECT @word_id, 'unable', 'able', 'unable', '不能的；无法的', 'un- 表示否定，unable 表示没有能力或条件做某事。', TRUE WHERE @word_id IS NOT NULL
UNION ALL SELECT @word_id, 'enable', 'able', 'enable', '使能够；使成为可能', 'en- 有“使……”的含义，enable 表示让某事变得可行。', TRUE WHERE @word_id IS NOT NULL;
INSERT INTO word_notes (word_id, memory_tip, root_affix, etymology, synonym_comparison, common_collocations, difficulty_note)
SELECT @word_id, 'ability 来自 able，加 -ity 变名词：有 able，就有 ability。', 'able 表示“能够”；un- 是否定；en- 常表示“使”；-ity 常构成抽象名词。', 'ability 与 able 属同一词族，来源可追溯到表示“适合、能够”的词根概念，四级中重在搭配。', 'ability 指能力；skill 更强调训练出的技能；talent 更强调天赋。', 'have the ability to, improve ability, language ability, reading ability', 'ability 后常接 to do：the ability to solve problems。' WHERE @word_id IS NOT NULL;

SET @word_id = (SELECT id FROM words WHERE word = 'abroad' LIMIT 1);
DELETE FROM word_families WHERE word_id = @word_id;
DELETE FROM word_notes WHERE word_id = @word_id;
INSERT INTO word_families (word_id, family_group, root_word, family_word, family_meaning, relation_explanation, is_in_cet4)
SELECT @word_id, 'abroad', 'broad', 'abroad', '在国外；到国外', '副词，表示去国外或在国外。', TRUE WHERE @word_id IS NOT NULL
UNION ALL SELECT @word_id, 'broad', 'broad', 'broad', '宽阔的；广泛的', 'abroad 和 broad 形式相关；broad 强调范围宽。', TRUE WHERE @word_id IS NOT NULL
UNION ALL SELECT @word_id, 'broaden', 'broad', 'broaden', '扩大；变宽', 'broad 加 -en 构成动词，表示使范围变宽或扩大。', FALSE WHERE @word_id IS NOT NULL;
INSERT INTO word_notes (word_id, memory_tip, root_affix, etymology, synonym_comparison, common_collocations, difficulty_note)
SELECT @word_id, 'abroad 可以记成 a + broad：走到更广阔的地方，也就是“国外”。', 'broad 表示“宽广”；-en 可构成动词，如 broaden。', 'abroad 和 broad 在历史上有关联，但现代学习中直接记作“在国外/到国外”更可靠。', 'abroad 是副词，不说 go to abroad；foreign 多作形容词，表示“外国的”。', 'go abroad, study abroad, travel abroad, live abroad', '常见错误是写 go to abroad；正确表达是 go abroad。' WHERE @word_id IS NOT NULL;

SET @word_id = (SELECT id FROM words WHERE word = 'absence' LIMIT 1);
DELETE FROM word_families WHERE word_id = @word_id;
DELETE FROM word_notes WHERE word_id = @word_id;
INSERT INTO word_families (word_id, family_group, root_word, family_word, family_meaning, relation_explanation, is_in_cet4)
SELECT @word_id, 'absence', 'absent', 'absence', '缺席；不存在', 'absent 的名词形式，表示人不在场或事物缺失。', TRUE WHERE @word_id IS NOT NULL
UNION ALL SELECT @word_id, 'absent', 'absent', 'absent', '缺席的；不在的', '形容词，常用于 be absent from。', TRUE WHERE @word_id IS NOT NULL
UNION ALL SELECT @word_id, 'absentee', 'absent', 'absentee', '缺席者', '派生名词，表示缺席的人，了解即可。', FALSE WHERE @word_id IS NOT NULL;
INSERT INTO word_notes (word_id, memory_tip, root_affix, etymology, synonym_comparison, common_collocations, difficulty_note)
SELECT @word_id, 'absence = absent 的名词，把 t 换成 ce，记“缺席这件事”。', 'absent 表示“不在场”；-ence 常构成抽象名词。', 'absence 与 absent 同源，和“不在、离开”的概念相关；具体词源不必过度展开。', 'absence 强调缺席或缺少；lack 强调不足；shortage 常指供应短缺。', 'absence from school, in the absence of, explain one''s absence', 'in the absence of 表示“在没有……的情况下”，阅读中很常见。' WHERE @word_id IS NOT NULL;

SET @word_id = (SELECT id FROM words WHERE word = 'absolute' LIMIT 1);
DELETE FROM word_families WHERE word_id = @word_id;
DELETE FROM word_notes WHERE word_id = @word_id;
INSERT INTO word_families (word_id, family_group, root_word, family_word, family_meaning, relation_explanation, is_in_cet4)
SELECT @word_id, 'absolute', 'absolute', 'absolute', '绝对的；完全的', '核心形容词，强调不受限制、完全确定。', TRUE WHERE @word_id IS NOT NULL
UNION ALL SELECT @word_id, 'absolutely', 'absolute', 'absolutely', '绝对地；完全地', '副词形式，常用于强调同意或程度。', TRUE WHERE @word_id IS NOT NULL
UNION ALL SELECT @word_id, 'absoluteness', 'absolute', 'absoluteness', '绝对性', '名词形式，较少见，了解词形变化即可。', FALSE WHERE @word_id IS NOT NULL;
INSERT INTO word_notes (word_id, memory_tip, root_affix, etymology, synonym_comparison, common_collocations, difficulty_note)
SELECT @word_id, 'absolute 可联想为“没有例外”，所以是“绝对的、完全的”。', '-ly 构成副词 absolutely；-ness 构成名词。', 'absolute 的历史含义与“分离、不受限制”有关，现代常表示完全或绝对。', 'absolute 强调绝对无条件；complete 强调整体完整；total 强调总量或程度。', 'absolute silence, absolute power, absolutely necessary, absolutely right', 'absolutely 常可单独回答表示强烈同意：Absolutely.。' WHERE @word_id IS NOT NULL;

SET @word_id = (SELECT id FROM words WHERE word = 'absorb' LIMIT 1);
DELETE FROM word_families WHERE word_id = @word_id;
DELETE FROM word_notes WHERE word_id = @word_id;
INSERT INTO word_families (word_id, family_group, root_word, family_word, family_meaning, relation_explanation, is_in_cet4)
SELECT @word_id, 'absorb', 'absorb', 'absorb', '吸收；理解；使全神贯注', '核心动词，可表示吸收液体、知识或注意力。', TRUE WHERE @word_id IS NOT NULL
UNION ALL SELECT @word_id, 'absorbed', 'absorb', 'absorbed', '全神贯注的；被吸收的', '过去分词/形容词，常用于 be absorbed in。', TRUE WHERE @word_id IS NOT NULL
UNION ALL SELECT @word_id, 'absorption', 'absorb', 'absorption', '吸收；专注', '名词形式，可指物理吸收或精神投入。', FALSE WHERE @word_id IS NOT NULL;
INSERT INTO word_notes (word_id, memory_tip, root_affix, etymology, synonym_comparison, common_collocations, difficulty_note)
SELECT @word_id, 'absorb 可以记成“把东西吸进去”，从水分到知识都能 absorb。', 'absorb 整体记忆；-ed 变形容词，-tion 变名词 absorption。', 'absorb 传统上与“吞入、吸入”的概念有关，现代义扩展到理解信息和吸引注意。', 'absorb 强调吸收进去；take in 可口语表示吸收或理解；attract 强调吸引注意。', 'absorb water, absorb information, be absorbed in, absorb heat', 'be absorbed in 表示“专心于”，介词用 in。' WHERE @word_id IS NOT NULL;

SET @word_id = (SELECT id FROM words WHERE word = 'abstract' LIMIT 1);
DELETE FROM word_families WHERE word_id = @word_id;
DELETE FROM word_notes WHERE word_id = @word_id;
INSERT INTO word_families (word_id, family_group, root_word, family_word, family_meaning, relation_explanation, is_in_cet4)
SELECT @word_id, 'abstract', 'abstract', 'abstract', '抽象的；摘要', '既可作形容词表示抽象的，也可作名词表示摘要。', TRUE WHERE @word_id IS NOT NULL
UNION ALL SELECT @word_id, 'abstraction', 'abstract', 'abstraction', '抽象；抽象概念', '名词形式，表示抽象化过程或抽象概念。', FALSE WHERE @word_id IS NOT NULL
UNION ALL SELECT @word_id, 'abstractly', 'abstract', 'abstractly', '抽象地', '副词形式，表示以抽象方式思考或表达。', FALSE WHERE @word_id IS NOT NULL;
INSERT INTO word_notes (word_id, memory_tip, root_affix, etymology, synonym_comparison, common_collocations, difficulty_note)
SELECT @word_id, 'abstract 可以联想为“从具体事物中抽出来的概念”，所以是抽象。', 'abstract 可整体记忆；-ion 构成 abstraction；-ly 构成副词。', 'abstract 的历史含义与“抽离、拉出”有关，后来发展出“抽象”和“摘要”的含义。', 'abstract 强调非具体；general 强调一般性的；summary 强调摘要内容。', 'abstract idea, abstract concept, write an abstract, highly abstract', '注意 abstract 作名词时常指论文摘要；作形容词时指抽象的。' WHERE @word_id IS NOT NULL;

SET @word_id = (SELECT id FROM words WHERE word = 'academic' LIMIT 1);
DELETE FROM word_families WHERE word_id = @word_id;
DELETE FROM word_notes WHERE word_id = @word_id;
INSERT INTO word_families (word_id, family_group, root_word, family_word, family_meaning, relation_explanation, is_in_cet4)
SELECT @word_id, 'academic', 'academy', 'academic', '学术的；学院的', '形容词，描述学习、研究、大学相关内容。', TRUE WHERE @word_id IS NOT NULL
UNION ALL SELECT @word_id, 'academy', 'academy', 'academy', '学院；研究院', '名词，表示学院或专门机构。', TRUE WHERE @word_id IS NOT NULL
UNION ALL SELECT @word_id, 'academically', 'academy', 'academically', '学业上；学术上', '副词形式，表示从学术或学习成绩角度看。', FALSE WHERE @word_id IS NOT NULL;
INSERT INTO word_notes (word_id, memory_tip, root_affix, etymology, synonym_comparison, common_collocations, difficulty_note)
SELECT @word_id, 'academic 和 academy 放在一起记：academy 是学院，academic 是学院/学术相关的。', 'academy 是相关名词；-ic 常构成形容词；-ally 构成副词。', 'academy 一词常被认为与古希腊学园传统有关，但四级阶段不需要细究来源。', 'academic 强调学术或学校环境；educational 更泛指教育的；scholarly 更偏严肃学术研究。', 'academic writing, academic performance, academic year, academic research', 'academic 既可指学术，也可指学习成绩，如 academic performance。' WHERE @word_id IS NOT NULL;

SET @word_id = (SELECT id FROM words WHERE word = 'access' LIMIT 1);
DELETE FROM word_families WHERE word_id = @word_id;
DELETE FROM word_notes WHERE word_id = @word_id;
INSERT INTO word_families (word_id, family_group, root_word, family_word, family_meaning, relation_explanation, is_in_cet4)
SELECT @word_id, 'access', 'access', 'access', '通道；进入权；使用权；访问', '核心词，表示进入某处、使用某物或访问系统的机会或权利。', TRUE WHERE @word_id IS NOT NULL
UNION ALL SELECT @word_id, 'accessible', 'access', 'accessible', '可进入的；可使用的；易懂的', '形容词形式，表示某物可以被进入、使用或理解。', TRUE WHERE @word_id IS NOT NULL
UNION ALL SELECT @word_id, 'accessibility', 'access', 'accessibility', '可达性；易用性；无障碍性', '名词派生形式，强调进入、使用或理解某物的便利程度。', FALSE WHERE @word_id IS NOT NULL;
INSERT INTO word_notes (word_id, memory_tip, root_affix, etymology, synonym_comparison, common_collocations, difficulty_note)
SELECT @word_id, '把 access 记成 ac + cess：走近并进入，所以引申为“进入权、使用权、访问”。', 'access 可和 accessible、accessibility 一起记；-ible 表示“可……的”，-ity 构成名词。', 'access 源自与“接近、进入”有关的表达，现代常用于地点、信息、系统和资源的访问权。', 'access 强调进入或使用的权利；entrance 更偏具体入口；approach 更强调接近的方法或态度。', 'have access to, gain access to, internet access, access information, access a website', 'access 既可以作名词，也可以作动词。常见搭配是 have access to，to 后面接资源、地点或信息。' WHERE @word_id IS NOT NULL;

SET @word_id = (SELECT id FROM words WHERE word = 'accommodation' LIMIT 1);
DELETE FROM word_families WHERE word_id = @word_id;
DELETE FROM word_notes WHERE word_id = @word_id;
INSERT INTO word_families (word_id, family_group, root_word, family_word, family_meaning, relation_explanation, is_in_cet4)
SELECT @word_id, 'accommodation', 'accommodate', 'accommodation', '住宿；住处；调节', '名词形式，四级中最常见含义是住宿。', TRUE WHERE @word_id IS NOT NULL
UNION ALL SELECT @word_id, 'accommodate', 'accommodate', 'accommodate', '容纳；为……提供住宿；适应', '动词形式，可表示容纳、安排住宿或适应需求。', TRUE WHERE @word_id IS NOT NULL
UNION ALL SELECT @word_id, 'accommodating', 'accommodate', 'accommodating', '乐于助人的；随和的', '形容词形式，表示愿意配合或帮助别人。', FALSE WHERE @word_id IS NOT NULL;
INSERT INTO word_notes (word_id, memory_tip, root_affix, etymology, synonym_comparison, common_collocations, difficulty_note)
SELECT @word_id, 'accommodation 很长，可以拆成 accommodate + -ion：提供住处这件事，就是住宿。', 'accommodate 是动词；-ion 构成名词 accommodation；-ing 可构成形容词 accommodating。', 'accommodation 与 accommodate 同族，历史上与“使适合、安排合适位置”有关，现代常用于住宿语境。', 'accommodation 强调住宿条件或住处；housing 更偏住房供给；hotel 是具体旅馆。', 'provide accommodation, student accommodation, hotel accommodation, find accommodation', '注意 accommodation 在英式英语中常不可数；拼写中有双 c、双 m。' WHERE @word_id IS NOT NULL;
