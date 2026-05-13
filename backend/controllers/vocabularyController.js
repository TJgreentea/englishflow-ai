const db = require("../db/connection");

const wordFields = `
  id,
  word,
  phonetic,
  part_of_speech,
  meaning_zh AS meaning,
  meaning_zh AS chinese_meaning,
  meaning_en AS english_definition,
  example_sentence AS example,
  example_sentence,
  example_translation,
  'CET4' AS difficulty
`;

const getAllWords = async (req, res) => {
  try {
    const [words] = await db.query(`
      SELECT ${wordFields}
      FROM words
      ORDER BY id ASC
    `);

    res.json({
      success: true,
      total: words.length,
      data: words,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load words",
      error: error.message,
    });
  }
};

const getWordById = async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid word id",
    });
  }

  try {
    const [[words], [families], [notes]] = await Promise.all([
      db.query(
        `
          SELECT ${wordFields}
          FROM words
          WHERE id = ?
          LIMIT 1
        `,
        [id],
      ),
      db.query(
        `
          SELECT
            id,
            word_id,
            family_group,
            root_word,
            family_meaning,
            relation_explanation,
            related_words,
            memory_tip,
            is_in_cet4,
            created_at,
            updated_at
          FROM word_families
          WHERE word_id = ?
          ORDER BY id ASC
        `,
        [id],
      ),
      db.query(
        `
          SELECT
            id,
            word_id,
            memory_tip,
            root_affix,
            ai_mnemonic,
            roots_affixes,
            etymology,
            synonym_comparison,
            synonym_analysis,
            common_collocations,
            collocations,
            difficulty_note,
            usage_notes,
            extra_notes,
            created_at,
            updated_at
          FROM word_notes
          WHERE word_id = ?
          ORDER BY id ASC
          LIMIT 1
        `,
        [id],
      ),
    ]);

    const word = words[0];

    if (!word) {
      return res.status(404).json({
        success: false,
        message: "Word not found",
      });
    }

    res.json({
      success: true,
      data: {
        word,
        families,
        notes: notes[0] || null,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load word",
      error: error.message,
    });
  }
};

const getDailyWords = async (req, res) => {
  const requestedCount = Number(req.query.count) || 10;
  const count = Math.min(Math.max(requestedCount, 1), 50);

  try {
    const [dailyWords] = await db.query(
      `
        SELECT ${wordFields}
        FROM words
        ORDER BY id ASC
        LIMIT ?
      `,
      [count],
    );

    res.json({
      success: true,
      count: dailyWords.length,
      data: dailyWords,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load daily words",
      error: error.message,
    });
  }
};

const getWordFamilyGroup = async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid word id",
    });
  }

  try {
    const [groups] = await db.query(
      `
        SELECT
          g.id,
          g.family_key,
          g.family_name,
          g.core_word_id,
          g.explanation,
          g.difficulty,
          g.source,
          g.created_at,
          g.updated_at
        FROM word_family_groups g
        INNER JOIN word_family_members m
          ON m.family_group_id = g.id
        WHERE m.word_id = ?
        ORDER BY g.id ASC
        LIMIT 1
      `,
      [id],
    );

    const group = groups[0];

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Family group not found",
      });
    }

    const [members] = await db.query(
      `
        SELECT
          m.id,
          m.family_group_id,
          m.word_id,
          m.role,
          m.relation_explanation,
          m.display_order,
          w.word,
          w.phonetic,
          w.part_of_speech,
          w.meaning_zh AS meaning,
          w.meaning_zh AS chinese_meaning,
          w.meaning_en AS english_definition,
          w.example_sentence AS example,
          w.example_sentence,
          w.example_translation,
          'CET4' AS difficulty
        FROM word_family_members m
        INNER JOIN words w
          ON w.id = m.word_id
        WHERE m.family_group_id = ?
        ORDER BY m.display_order ASC, m.id ASC
      `,
      [group.id],
    );

    res.json({
      success: true,
      data: {
        group,
        members,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to load family group",
      error: error.message,
    });
  }
};

module.exports = {
  getAllWords,
  getWordById,
  getDailyWords,
  getWordFamilyGroup,
};
