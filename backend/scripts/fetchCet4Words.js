const fs = require("node:fs/promises");
const path = require("node:path");

const SOURCE_REPO = "https://github.com/cuttlin/Vocabulary-of-CET-4";
const RAW_BASE =
  "https://raw.githubusercontent.com/cuttlin/Vocabulary-of-CET-4/master/JSON";
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const cleanWord = (word) => word.replace(/^\uFEFF/, "").trim();

const parsePartOfSpeech = (meaning) => {
  const match = meaning.match(/^([a-z.\/]+)\s*/i);
  return match ? match[1].replace(/\.$/, ".") : null;
};

const normalizeItem = (item) => ({
  word: cleanWord(item.word),
  phonetic: item.phonetic_symbol || "",
  part_of_speech: parsePartOfSpeech(item.mean || ""),
  meaning: item.mean || "",
  english_definition: "",
  example: "",
  example_translation: "",
  source: SOURCE_REPO,
});

const fetchLetter = async (letter) => {
  const response = await fetch(`${RAW_BASE}/${letter}.json`);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${letter}.json: ${response.status}`);
  }

  return response.json();
};

const main = async () => {
  const files = await Promise.all(LETTERS.map(fetchLetter));
  const byWord = new Map();

  for (const file of files) {
    for (const item of file) {
      const word = cleanWord(item.word || "");

      if (!word) {
        continue;
      }

      byWord.set(word.toLowerCase(), normalizeItem(item));
    }
  }

  const words = [...byWord.values()].sort((a, b) => a.word.localeCompare(b.word));
  const outputPath = path.join(__dirname, "..", "data", "cet4Words.json");

  await fs.writeFile(outputPath, `${JSON.stringify(words, null, 2)}\n`);

  console.log(
    JSON.stringify({
      source: SOURCE_REPO,
      output: outputPath,
      total: words.length,
    }),
  );
};

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
