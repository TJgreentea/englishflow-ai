require("dotenv").config();

const db = require("../db/connection");

const SOURCE = "rule_generated";
const DIFFICULTY = "CET4";

const supplementalFamilyWords = [
  ["able", "/ˈeɪbl/", "adj.", "能够的；有能力的", "be able to, able student"],
  ["unable", "/ʌnˈeɪbl/", "adj.", "不能的；无法的", "be unable to"],
  ["enable", "/ɪˈneɪbl/", "v.", "使能够；使成为可能", "enable someone to do something"],
  ["accept", "/əkˈsept/", "v.", "接受；认可", "accept an offer"],
  ["acceptance", "/əkˈseptəns/", "n.", "接受；认可", "gain acceptance"],
  ["accidental", "/ˌæksɪˈdentl/", "adj.", "意外的；偶然的", "accidental damage"],
  ["accidentally", "/ˌæksɪˈdentəli/", "adv.", "意外地；偶然地", "accidentally break something"],
  ["act", "/ækt/", "v./n.", "行动；行为；表演", "act quickly"],
  ["action", "/ˈækʃn/", "n.", "行动；行为", "take action"],
  ["active", "/ˈæktɪv/", "adj.", "积极的；活跃的", "active role"],
  ["activity", "/ækˈtɪvəti/", "n.", "活动；活跃", "school activity"],
  ["agree", "/əˈɡriː/", "v.", "同意；赞成", "agree with someone"],
  ["agreement", "/əˈɡriːmənt/", "n.", "协议；同意", "reach an agreement"],
  ["amaze", "/əˈmeɪz/", "v.", "使惊讶", "amaze the audience"],
  ["announcement", "/əˈnaʊnsmənt/", "n.", "公告；宣布", "make an announcement"],
  ["appointment", "/əˈpɔɪntmənt/", "n.", "约会；任命", "make an appointment"],
  ["argument", "/ˈɑːrɡjumənt/", "n.", "争论；论点", "have an argument"],
  ["arrangement", "/əˈreɪndʒmənt/", "n.", "安排；布置", "make arrangements"],
  ["attraction", "/əˈtrækʃn/", "n.", "吸引；有吸引力的事物", "tourist attraction"],
  ["communicate", "/kəˈmjuːnɪkeɪt/", "v.", "交流；沟通", "communicate with others"],
  ["communication", "/kəˌmjuːnɪˈkeɪʃn/", "n.", "交流；通信", "communication skills"],
  ["create", "/kriˈeɪt/", "v.", "创造；创建", "create value"],
  ["creative", "/kriˈeɪtɪv/", "adj.", "有创造力的", "creative thinking"],
  ["creation", "/kriˈeɪʃn/", "n.", "创造；作品", "the creation of jobs"],
  ["decide", "/dɪˈsaɪd/", "v.", "决定", "decide to do something"],
  ["decision", "/dɪˈsɪʒn/", "n.", "决定；决策", "make a decision"],
  ["educate", "/ˈedʒukeɪt/", "v.", "教育；培养", "educate children"],
  ["education", "/ˌedʒuˈkeɪʃn/", "n.", "教育", "higher education"],
  ["encourage", "/ɪnˈkɜːrɪdʒ/", "v.", "鼓励；促进", "encourage students"],
  ["encouragement", "/ɪnˈkɜːrɪdʒmənt/", "n.", "鼓励", "need encouragement"],
  ["express", "/ɪkˈspres/", "v.", "表达；表示", "express an idea"],
  ["expression", "/ɪkˈspreʃn/", "n.", "表达；表情", "facial expression"],
  ["fortunate", "/ˈfɔːrtʃənət/", "adj.", "幸运的", "be fortunate to"],
  ["fortunately", "/ˈfɔːrtʃənətli/", "adv.", "幸运地", "fortunately enough"],
  ["unfortunately", "/ʌnˈfɔːrtʃənətli/", "adv.", "不幸地", "unfortunately, ..."],
  ["freedom", "/ˈfriːdəm/", "n.", "自由", "freedom of speech"],
  ["happiness", "/ˈhæpinəs/", "n.", "幸福；快乐", "bring happiness"],
  ["unhappy", "/ʌnˈhæpi/", "adj.", "不开心的；不满意的", "feel unhappy"],
  ["healthy", "/ˈhelθi/", "adj.", "健康的", "healthy food"],
  ["unhealthy", "/ʌnˈhelθi/", "adj.", "不健康的", "unhealthy habits"],
  ["hopeful", "/ˈhoʊpfl/", "adj.", "有希望的", "feel hopeful"],
  ["hopeless", "/ˈhoʊpləs/", "adj.", "无望的", "hopeless situation"],
  ["imagine", "/ɪˈmædʒɪn/", "v.", "想象", "imagine a future"],
  ["imagination", "/ɪˌmædʒɪˈneɪʃn/", "n.", "想象力", "use imagination"],
  ["importance", "/ɪmˈpɔːrtns/", "n.", "重要性", "the importance of education"],
  ["improvement", "/ɪmˈpruːvmənt/", "n.", "改善；提高", "make improvement"],
  ["inform", "/ɪnˈfɔːrm/", "v.", "通知；告知", "inform someone of something"],
  ["interesting", "/ˈɪntrəstɪŋ/", "adj.", "有趣的", "interesting story"],
  ["interested", "/ˈɪntrəstɪd/", "adj.", "感兴趣的", "be interested in"],
  ["knowledge", "/ˈnɑːlɪdʒ/", "n.", "知识", "gain knowledge"],
  ["nationality", "/ˌnæʃəˈnæləti/", "n.", "国籍；民族", "Chinese nationality"],
  ["organize", "/ˈɔːrɡənaɪz/", "v.", "组织；安排", "organize an event"],
  ["organization", "/ˌɔːrɡənəˈzeɪʃn/", "n.", "组织；机构", "international organization"],
  ["production", "/prəˈdʌkʃn/", "n.", "生产；产量", "mass production"],
  ["productive", "/prəˈdʌktɪv/", "adj.", "多产的；富有成效的", "productive work"],
  ["protection", "/prəˈtekʃn/", "n.", "保护", "environmental protection"],
  ["protective", "/prəˈtektɪv/", "adj.", "保护的；防护的", "protective clothing"],
  ["scientific", "/ˌsaɪənˈtɪfɪk/", "adj.", "科学的", "scientific research"],
  ["scientist", "/ˈsaɪəntɪst/", "n.", "科学家", "famous scientist"],
  ["successful", "/səkˈsesfl/", "adj.", "成功的", "successful business"],
  ["successfully", "/səkˈsesfəli/", "adv.", "成功地", "finish successfully"],
  ["suggestion", "/səˈdʒestʃən/", "n.", "建议", "make a suggestion"],
  ["unusual", "/ʌnˈjuːʒuəl/", "adj.", "不寻常的", "unusual experience"],
  ["valuable", "/ˈvæljuəbl/", "adj.", "有价值的；贵重的", "valuable advice"],
  ["variety", "/vəˈraɪəti/", "n.", "多样；种类", "a variety of"],
  ["wonderful", "/ˈwʌndərfl/", "adj.", "精彩的；极好的", "wonderful idea"],
];

const suffixRules = [
  { suffix: "ibility", replacements: [""], minRootLength: 4 },
  { suffix: "ability", replacements: ["able", ""], minRootLength: 4 },
  { suffix: "ically", replacements: ["ic"], minRootLength: 4 },
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

const manualHighConfidenceFamilies = [
  ["able", "ability", "unable", "enable"],
  ["absent", "absence"],
  ["accept", "acceptable", "acceptance"],
  ["accident", "accidental", "accidentally"],
  ["act", "action", "active", "activity"],
  ["actual", "actually"],
  ["addition", "additional"],
  ["adjust", "adjustment"],
  ["admire", "admirable"],
  ["advance", "advanced"],
  ["advantage", "advantageous"],
  ["advertise", "advertisement"],
  ["agree", "agreement", "disagree"],
  ["amaze", "amazing"],
  ["announce", "announcement"],
  ["appoint", "appointment"],
  ["argue", "argument"],
  ["arrange", "arrangement"],
  ["attract", "attractive", "attraction"],
  ["beauty", "beautiful"],
  ["care", "careful", "carefully", "careless"],
  ["certain", "certainly"],
  ["collect", "collection", "collective"],
  ["comfort", "comfortable"],
  ["communicate", "communication"],
  ["complete", "completely"],
  ["consider", "considerable", "consideration"],
  ["create", "creative", "creation"],
  ["decide", "decision"],
  ["deep", "deeply"],
  ["develop", "development"],
  ["differ", "different", "difference"],
  ["direct", "directly", "direction"],
  ["educate", "education"],
  ["electric", "electrical", "electricity"],
  ["employ", "employment", "unemployment"],
  ["encourage", "encouragement"],
  ["enjoy", "enjoyable"],
  ["especial", "especially"],
  ["exact", "exactly"],
  ["express", "expression"],
  ["fortunate", "fortunately", "unfortunately"],
  ["free", "freedom"],
  ["general", "generally"],
  ["happy", "happiness", "unhappy"],
  ["health", "healthy", "unhealthy"],
  ["hope", "hopeful", "hopeless"],
  ["imagine", "imagination"],
  ["important", "importance"],
  ["improve", "improvement"],
  ["inform", "information"],
  ["interest", "interesting", "interested"],
  ["kind", "kindness"],
  ["know", "knowledge"],
  ["like", "likely", "unlike"],
  ["manage", "management", "manager"],
  ["nation", "national", "international"],
  ["nature", "natural", "naturally"],
  ["organize", "organization"],
  ["possible", "possibly", "impossible"],
  ["practice", "practical"],
  ["prepare", "preparation"],
  ["produce", "production", "productive"],
  ["protect", "protection"],
  ["real", "really", "reality"],
  ["reason", "reasonable"],
  ["regular", "regularly", "irregular"],
  ["safe", "safety"],
  ["science", "scientific", "scientist"],
  ["sign", "signal", "signature"],
  ["silent", "silence"],
  ["simple", "simply"],
  ["social", "society"],
  ["special", "specially"],
  ["success", "successful", "successfully"],
  ["suggest", "suggestion"],
  ["usual", "usually", "unusual"],
  ["value", "valuable"],
  ["vary", "various", "variety"],
  ["wide", "widely"],
  ["wonder", "wonderful"],
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

const insertSupplementalWords = async () => {
  const values = supplementalFamilyWords.map(
    ([word, phonetic, partOfSpeech, meaningZh, exampleSentence]) => [
      word,
      phonetic,
      partOfSpeech,
      meaningZh,
      null,
      exampleSentence,
      null,
      1,
    ],
  );

  if (values.length === 0) {
    return 0;
  }

  const [result] = await db.query(
    `
      INSERT IGNORE INTO words (
        word,
        phonetic,
        part_of_speech,
        meaning_zh,
        meaning_en,
        example_sentence,
        example_translation,
        difficulty_level
      ) VALUES ?
    `,
    [values],
  );

  return result.affectedRows;
};

const main = async () => {
  const insertedSupplementalWords = await insertSupplementalWords();

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

  for (const family of manualHighConfidenceFamilies) {
    const existingWords = family.map(normalizeWord).filter((word) => wordSet.has(word));

    if (existingWords.length < 2) {
      continue;
    }

    const core = existingWords[0];

    for (const word of existingWords.slice(1)) {
      dsu.union(core, word);
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
      insertedSupplementalWords,
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
