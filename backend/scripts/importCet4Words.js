require("dotenv").config();

const path = require("node:path");
const db = require("../db/connection");
const cet4Words = require(path.join("..", "data", "cet4Words.json"));

const normalizeWord = (item) => ({
  word: item.word,
  phonetic: item.phonetic || null,
  partOfSpeech: item.part_of_speech || item.partOfSpeech || null,
  meaningZh: item.chinese_meaning || item.meaning_zh || item.meaning || "",
  meaningEn: item.english_definition || item.meaning_en || null,
  exampleSentence: item.example_sentence || item.example || null,
  exampleTranslation: item.example_translation || null,
  difficultyLevel: 1,
});

const importWords = async () => {
  const words = cet4Words
    .map(normalizeWord)
    .filter((item) => item.word && item.meaningZh);

  if (words.length === 0) {
    console.log("No CET-4 words to import.");
    return;
  }

  const values = words.map((item) => [
    item.word,
    item.phonetic,
    item.partOfSpeech,
    item.meaningZh,
    item.meaningEn,
    item.exampleSentence,
    item.exampleTranslation,
    item.difficultyLevel,
  ]);

  const [result] = await db.query(
    `
      INSERT INTO words (
        word,
        phonetic,
        part_of_speech,
        meaning_zh,
        meaning_en,
        example_sentence,
        example_translation,
        difficulty_level
      ) VALUES ?
      ON DUPLICATE KEY UPDATE
        phonetic = VALUES(phonetic),
        part_of_speech = COALESCE(VALUES(part_of_speech), part_of_speech),
        meaning_zh = VALUES(meaning_zh),
        meaning_en = COALESCE(VALUES(meaning_en), meaning_en),
        example_sentence = VALUES(example_sentence),
        example_translation = COALESCE(VALUES(example_translation), example_translation),
        difficulty_level = VALUES(difficulty_level)
    `,
    [values],
  );

  console.log(
    JSON.stringify({
      source: "backend/data/cet4Words.json",
      imported: words.length,
      affectedRows: result.affectedRows,
    }),
  );
};

importWords()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.end();
  });
