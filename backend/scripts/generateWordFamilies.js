require("dotenv").config();

const db = require("../db/connection");

const SOURCE = "rule_generated";
const DIFFICULTY = "CET4";

const suffixRules = [
  { suffix: "ibility", replacements: [""], minRootLength: 4 },
  { suffix: "ability", replacements: ["able", ""], minRootLength: 4 },
  { suffix: "ation", replacements: ["", "e"], minRootLength: 4 },
  { suffix: "tion", replacements: ["", "e"], minRootLength: 4 },
  { suffix: "sion", replacements: ["", "e"], minRootLength: 4 },
  { suffix: "ment", replacements: [""], minRootLength: 4 },
  { suffix: "ness", replacements: ["", "y"], minRootLength: 4 },
  { suffix: "ity", replacements: ["", "e"], minRootLength: 4 },
  { suffix: "ible", replacements: [""], minRootLength: 4 },
  { suffix: "able", replacements: [""], minRootLength: 4 },
  { suffix: "ive", replacements: [""], minRootLength: 4 },
  { suffix: "ing", replacements: ["", "e"], minRootLength: 4 },
  { suffix: "ed", replacements: ["", "e"], minRootLength: 4 },
  { suffix: "ly", replacements: [""], minRootLength: 4 },
];

const normalizeWord = (word) => word.toLowerCase().trim();

const createDisjointSet = (items) => {
  const parent = new Map(items.map((item) => [item, item]));

  const find = (item) => {
    const current = parent.get(item);

    if (current !== item) {
      const root = find(current);
      parent.set(item, root);
      return root;
    }

    return current;
  };

  const union = (a, b) => {
    const rootA = find(a);
    const rootB = find(b);

    if (rootA !== rootB) {
      parent.set(rootB, rootA);
    }
  };

  return { find, union };
};

const getRootCandidates = (word, wordSet) => {
  const candidates = new Set();

  for (const rule of suffixRules) {
    if (word.length <= rule.suffix.length + 2 || !word.endsWith(rule.suffix)) {
      continue;
    }

    const stem = word.slice(0, -rule.suffix.length);

    for (const replacement of rule.replacements) {
      const candidate = `${stem}${replacement}`;

      if (
        candidate !== word &&
        candidate.length >= rule.minRootLength &&
        wordSet.has(candidate)
      ) {
        candidates.add(candidate);
      }
    }
  }

  return [...candidates];
};

const pickCoreWord = (membersByWord) => {
  return [...membersByWord].sort((a, b) => {
    if (a.word.length !== b.word.length) {
      return a.word.length - b.word.length;
    }

    return a.word.localeCompare(b.word);
  })[0];
};

const getRole = (word, coreWord) => {
  if (word === coreWord) {
    return "core";
  }

  if (word.startsWith(coreWord) || coreWord.startsWith(word)) {
    return "derived";
  }

  return "related";
};

const getRelationExplanation = (word, coreWord, role) => {
  if (role === "core") {
    return `${word} 是这个词族的核心词。`;
  }

  if (role === "derived") {
    return `${word} 与核心词 ${coreWord} 共享明显词形基础，可作为派生词一起记忆。`;
  }

  return `${word} 与核心词 ${coreWord} 在词形上有关联，可作为同族相关词辅助记忆。`;
};

const main = async () => {
  const [rows] = await db.query(
    `
      SELECT id, word
      FROM words
      WHERE difficulty_level = 1
      ORDER BY word ASC
    `,
  );

  await db.query(
    `
      DELETE FROM word_family_groups
      WHERE source = ?
    `,
    [SOURCE],
  );

  const words = rows.map((row) => ({
    id: row.id,
    word: normalizeWord(row.word),
    originalWord: row.word,
  }));
  const wordMap = new Map(words.map((item) => [item.word, item]));
  const wordSet = new Set(wordMap.keys());
  const dsu = createDisjointSet([...wordSet]);

  for (const word of wordSet) {
    for (const candidate of getRootCandidates(word, wordSet)) {
      dsu.union(candidate, word);
    }
  }

  const components = new Map();

  for (const word of wordSet) {
    const root = dsu.find(word);
    const group = components.get(root) || [];
    group.push(wordMap.get(word));
    components.set(root, group);
  }

  const families = [...components.values()]
    .filter((members) => members.length >= 2)
    .map((members) => {
      const core = pickCoreWord(members);
      return {
        familyKey: core.word,
        familyName: `${core.word} family`,
        explanation: `${core.word} family 由规则初步识别，成员共享明显词形基础，建议后续人工审核确认记忆逻辑。`,
        core,
        members: members.sort((a, b) => {
          if (a.word === core.word) return -1;
          if (b.word === core.word) return 1;
          if (a.word.length !== b.word.length) return a.word.length - b.word.length;
          return a.word.localeCompare(b.word);
        }),
      };
    });

  let createdOrUpdatedGroups = 0;
  let insertedMembers = 0;

  for (const family of families) {
    const [existingGroups] = await db.query(
      `
        SELECT id, source
        FROM word_family_groups
        WHERE family_key = ?
        LIMIT 1
      `,
      [family.familyKey],
    );

    if (existingGroups[0]?.source === "manual_reviewed") {
      continue;
    }

    await db.query(
      `
        INSERT INTO word_family_groups (
          family_key,
          family_name,
          core_word_id,
          explanation,
          difficulty,
          source
        ) VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          family_name = VALUES(family_name),
          core_word_id = VALUES(core_word_id),
          explanation = VALUES(explanation),
          difficulty = VALUES(difficulty),
          source = VALUES(source)
      `,
      [
        family.familyKey,
        family.familyName,
        family.core.id,
        family.explanation,
        DIFFICULTY,
        SOURCE,
      ],
    );

    const [groupRows] = await db.query(
      `
        SELECT id
        FROM word_family_groups
        WHERE family_key = ?
        LIMIT 1
      `,
      [family.familyKey],
    );
    const familyGroupId = groupRows[0].id;

    await db.query(
      `
        DELETE FROM word_family_members
        WHERE family_group_id = ?
      `,
      [familyGroupId],
    );

    const memberValues = family.members.map((member, index) => {
      const role = getRole(member.word, family.core.word);

      return [
        familyGroupId,
        member.id,
        role,
        getRelationExplanation(member.word, family.core.word, role),
        index + 1,
      ];
    });

    await db.query(
      `
        INSERT INTO word_family_members (
          family_group_id,
          word_id,
          role,
          relation_explanation,
          display_order
        ) VALUES ?
      `,
      [memberValues],
    );

    createdOrUpdatedGroups += 1;
    insertedMembers += memberValues.length;
  }

  console.log(
    JSON.stringify({
      source: SOURCE,
      scannedWords: words.length,
      generatedFamilies: families.length,
      createdOrUpdatedGroups,
      insertedMembers,
    }),
  );
};

main()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.end();
  });
