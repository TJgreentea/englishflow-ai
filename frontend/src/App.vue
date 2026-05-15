<script setup>
import { onMounted, ref } from 'vue'

const words = ref([])
const loading = ref(false)
const error = ref('')
const flippedWordId = ref(null)
const wordDetails = ref({})
const detailLoading = ref({})
const detailErrors = ref({})

const fetchWords = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await fetch('http://localhost:5052/api/vocabulary/daily?count=10')
    const result = await response.json()

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to load words')
    }

    words.value = result.data
    flippedWordId.value = null
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const fetchWordDetail = async (id) => {
  if (wordDetails.value[id] || detailLoading.value[id]) {
    return
  }

  detailLoading.value = {
    ...detailLoading.value,
    [id]: true,
  }
  detailErrors.value = {
    ...detailErrors.value,
    [id]: '',
  }

  try {
    const response = await fetch(`http://localhost:5052/api/vocabulary/${id}/family-group`)
    const result = await response.json()

    if (response.status === 404) {
      wordDetails.value = {
        ...wordDetails.value,
        [id]: {
          group: null,
          members: [],
        },
      }
      return
    }

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to load word detail')
    }

    wordDetails.value = {
      ...wordDetails.value,
      [id]: result.data,
    }
  } catch (err) {
    detailErrors.value = {
      ...detailErrors.value,
      [id]: err.message,
    }
  } finally {
    detailLoading.value = {
      ...detailLoading.value,
      [id]: false,
    }
  }
}

const toggleCard = async (id) => {
  if (flippedWordId.value === id) {
    flippedWordId.value = null
    return
  }

  flippedWordId.value = id
  await fetchWordDetail(id)
}

onMounted(fetchWords)
</script>

<template>
  <main class="page">
    <section class="toolbar">
      <div>
        <p class="eyebrow">CET-4 Vocabulary</p>
        <h1>今日单词</h1>
      </div>

      <button type="button" :disabled="loading" @click="fetchWords">
        {{ loading ? '加载中' : '刷新' }}
      </button>
    </section>

    <p v-if="error" class="error">{{ error }}</p>
    <p v-else-if="loading" class="status">正在从后端获取单词...</p>

    <section v-else class="word-grid">
      <button
        v-for="item in words"
        :key="item.id"
        type="button"
        class="word-card"
        :class="{ flipped: flippedWordId === item.id }"
        @click="toggleCard(item.id)"
      >
        <span class="card-face card-front">
          <span class="word-header">
            <span>
              <span class="word-title">{{ item.word }}</span>
              <span class="part-of-speech">{{ item.part_of_speech }}</span>
            </span>
            <span class="phonetic">{{ item.phonetic }}</span>
          </span>
          <span class="meaning">{{ item.meaning }}</span>
          <span class="example">{{ item.example }}</span>
        </span>

        <span class="card-face card-back">
          <span class="back-title">Word Family</span>

          <span v-if="detailLoading[item.id]" class="back-status">加载词族中...</span>
          <span v-else-if="detailErrors[item.id]" class="back-error">
            {{ detailErrors[item.id] }}
          </span>
          <span v-else-if="wordDetails[item.id]?.members?.length" class="family-list">
            <span v-if="wordDetails[item.id].group" class="family-summary">
              {{ wordDetails[item.id].group.family_name }}
            </span>
            <span
              v-for="member in wordDetails[item.id].members"
              :key="member.id"
              class="family-item"
              :class="{ current: member.word_id === item.id }"
            >
              <span class="family-word">
                {{ member.word }}
                <span>{{ member.role }}</span>
              </span>
              <span class="family-meaning">{{ member.meaning }}</span>
              <span class="family-relation">{{ member.relation_explanation }}</span>
            </span>
          </span>
          <span v-else class="back-status">暂无词族内容</span>
        </span>
      </button>
    </section>
  </main>
</template>

<style scoped>
.page {
  min-height: 100vh;
  padding: 48px;
  color: #172033;
  background: #f5f7fb;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  max-width: 1120px;
  margin: 0 auto 28px;
}

.eyebrow {
  margin: 0 0 6px;
  color: #2f6f73;
  font-size: 14px;
  font-weight: 700;
}

h1 {
  margin: 0;
  font-size: 36px;
  font-weight: 800;
}

button {
  min-width: 88px;
  height: 40px;
  border: 0;
  border-radius: 6px;
  color: white;
  background: #1f6f78;
  font-weight: 700;
  cursor: pointer;
}

button:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.status,
.error {
  max-width: 1120px;
  margin: 0 auto;
  padding: 16px;
  border-radius: 6px;
  background: white;
}

.error {
  color: #a21c2b;
}

.word-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  max-width: 1120px;
  margin: 0 auto;
}

.word-card {
  position: relative;
  display: block;
  min-height: 260px;
  padding: 0;
  border: 1px solid #dce3ef;
  border-radius: 8px;
  background: white;
  color: inherit;
  text-align: left;
  perspective: 1200px;
}

.word-card:focus-visible {
  outline: 3px solid rgba(31, 111, 120, 0.28);
  outline-offset: 3px;
}

.card-face {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-radius: 8px;
  background: white;
  backface-visibility: hidden;
  transform-style: preserve-3d;
  transition: transform 0.32s ease;
}

.card-front {
  justify-content: flex-start;
}

.card-back {
  overflow: auto;
  transform: rotateY(180deg);
}

.word-card.flipped .card-front {
  transform: rotateY(180deg);
}

.word-card.flipped .card-back {
  transform: rotateY(360deg);
}

.word-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.word-title {
  display: inline-block;
  margin-right: 8px;
  font-size: 24px;
  font-weight: 800;
}

.part-of-speech {
  color: #2f6f73;
  font-size: 14px;
  font-weight: 800;
}

.phonetic {
  color: #64748b;
  font-size: 14px;
  white-space: nowrap;
}

.meaning {
  display: block;
  margin: 0 0 12px;
  color: #1f6f78;
  font-size: 17px;
  font-weight: 700;
}

.example {
  display: block;
  margin: 0;
  color: #475569;
  line-height: 1.6;
}

.back-title {
  margin-bottom: 12px;
  color: #172033;
  font-size: 18px;
  font-weight: 800;
}

.back-status,
.back-error {
  color: #64748b;
  line-height: 1.6;
}

.back-error {
  color: #a21c2b;
}

.family-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.family-summary {
  display: block;
  color: #172033;
  font-size: 14px;
  font-weight: 800;
}

.family-item {
  display: block;
  padding-bottom: 12px;
  border-bottom: 1px solid #e2e8f0;
}

.family-item.current {
  padding: 10px;
  border: 1px solid #b8d7da;
  border-radius: 6px;
  background: #eef8f8;
}

.family-item:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}

.family-word {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 6px;
  color: #1f6f78;
  font-size: 17px;
  font-weight: 800;
}

.family-word span {
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}

.family-meaning,
.family-relation {
  display: block;
  color: #475569;
  line-height: 1.5;
}

.family-meaning {
  margin-bottom: 4px;
  color: #172033;
  font-weight: 700;
}

@media (max-width: 640px) {
  .page {
    padding: 24px 16px;
  }

  .toolbar {
    align-items: flex-start;
    flex-direction: column;
  }

  h1 {
    font-size: 30px;
  }
}
</style>
