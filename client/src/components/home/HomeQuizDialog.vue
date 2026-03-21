<template>
  <v-dialog v-model="model" max-width="720">
    <v-card class="quiz-card" elevation="0">
      <v-card-title class="quiz-title">
        Bloomera Recommendation Quiz
      </v-card-title>

      <v-card-text class="quiz-body">
        <div class="quiz-progress">
          <div class="quiz-step">Step {{ step }} of 5</div>
          <div class="quiz-question">{{ currentQuestion }}</div>
          <div class="quiz-subtitle">
            Answer a few quick questions and we’ll suggest your best floral matches.
          </div>
        </div>

        <div class="quiz-options">
          <button
            v-for="option in currentOptions"
            :key="option.value"
            type="button"
            class="quiz-option"
            :class="{ selected: isSelected(option.value) }"
            @click="handleSelect(option.value)"
          >
            {{ option.label }}
          </button>
        </div>

        <div class="quiz-actions">
          <v-btn variant="text" :disabled="step === 1" @click="goBack">
            Back
          </v-btn>

          <v-spacer />

          <v-btn variant="text" @click="closeDialog">
            Cancel
          </v-btn>

          <v-btn
            class="finish-btn"
            :disabled="!canContinue"
            @click="goNext"
          >
            {{ step === 5 ? 'See recommendations' : 'Next' }}
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed, reactive, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'complete'])

const model = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const state = reactive({
  step: 1,
  event_type: '',
  preferred_style: '',
  preferred_colors: [],
  preferred_product_type: '',
  budget_key: '',
})

const eventOptions = [
  { label: 'Birthday', value: 'birthday' },
  { label: 'Anniversary', value: 'anniversary' },
  { label: 'Just because', value: 'just because' },
  { label: 'Special event', value: 'special event' },
  { label: 'Sympathy', value: 'sympathy' },
]

const styleOptions = [
  { label: 'Elegant', value: 'elegant' },
  { label: 'Romantic', value: 'romantic' },
  { label: 'Natural', value: 'natural' },
  { label: 'Playful', value: 'playful' },
  { label: 'Luxury', value: 'luxury' },
]

const colorOptions = [
  { label: 'Soft tones (pink, white, lilac)', value: ['roz', 'alb', 'lila'] },
  { label: 'Vibrant tones (red, orange, yellow)', value: ['rosu', 'portocaliu', 'galben'] },
  { label: 'Green / natural', value: ['verde'] },
  { label: 'Neutral (white, cream)', value: ['alb', 'crem'] },
]

const typeOptions = [
  { label: 'Bouquet', value: 'buchet' },
  { label: 'Plant', value: 'planta' },
  { label: 'Flower box', value: 'flower box' },
  { label: 'Surprise gift', value: 'cadou floral' },
]

const budgetOptions = [
  { label: '30 - 70 RON', value: 'small' },
  { label: '70 - 150 RON', value: 'medium' },
  { label: '150 - 300 RON', value: 'premium' },
]

const step = computed(() => state.step)

const currentQuestion = computed(() => {
  if (state.step === 1) return 'What is the occasion?'
  if (state.step === 2) return 'What vibe do you want to send?'
  if (state.step === 3) return 'What colors do you prefer?'
  if (state.step === 4) return 'What type of product do you want?'
  return 'What budget do you have in mind?'
})

const currentOptions = computed(() => {
  if (state.step === 1) return eventOptions
  if (state.step === 2) return styleOptions
  if (state.step === 3) return colorOptions
  if (state.step === 4) return typeOptions
  return budgetOptions
})

const canContinue = computed(() => {
  if (state.step === 1) return !!state.event_type
  if (state.step === 2) return !!state.preferred_style
  if (state.step === 3) return state.preferred_colors.length > 0
  if (state.step === 4) return !!state.preferred_product_type
  return !!state.budget_key
})

function isSelected(value) {
  if (state.step === 1) return state.event_type === value
  if (state.step === 2) return state.preferred_style === value
  if (state.step === 3) {
    return JSON.stringify(state.preferred_colors) === JSON.stringify(value)
  }
  if (state.step === 4) return state.preferred_product_type === value
  return state.budget_key === value
}

function handleSelect(value) {
  if (state.step === 1) {
    state.event_type = value
    return
  }

  if (state.step === 2) {
    state.preferred_style = value
    return
  }

  if (state.step === 3) {
    state.preferred_colors = value
    return
  }

  if (state.step === 4) {
    state.preferred_product_type = value
    return
  }

  state.budget_key = value
}

function getBudgetRange(key) {
  if (key === 'small') return { budget_min: 30, budget_max: 70 }
  if (key === 'medium') return { budget_min: 70, budget_max: 150 }
  return { budget_min: 150, budget_max: 300 }
}

function resetQuiz() {
  state.step = 1
  state.event_type = ''
  state.preferred_style = ''
  state.preferred_colors = []
  state.preferred_product_type = ''
  state.budget_key = ''
}

function closeDialog() {
  model.value = false
}

function goBack() {
  if (state.step > 1) {
    state.step -= 1
  }
}

function goNext() {
  if (!canContinue.value) return

  if (state.step < 5) {
    state.step += 1
    return
  }

  const budget = getBudgetRange(state.budget_key)

  emit('complete', {
    event_type: state.event_type,
    preferred_style: state.preferred_style,
    preferred_colors: state.preferred_colors,
    preferred_product_type: state.preferred_product_type,
    budget_min: budget.budget_min,
    budget_max: budget.budget_max,
  })

  model.value = false
}

watch(
  () => props.modelValue,
  (value) => {
    if (value) {
      resetQuiz()
    }
  }
)
</script>

<style scoped>
.quiz-card {
  border-radius: 24px;
  border: 1px solid #ece7f6;
}

.quiz-title {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  padding: 22px 24px 10px;
}

.quiz-body {
  padding-top: 8px;
}

.quiz-progress {
  margin-bottom: 20px;
}

.quiz-step {
  font-size: 13px;
  font-weight: 700;
  color: #c48797;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.quiz-question {
  font-size: 22px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
}

.quiz-subtitle {
  color: #6b7280;
  line-height: 1.6;
}

.quiz-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.quiz-option {
  border: 1px solid #ece7f6;
  background: #fff;
  color: #374151;
  border-radius: 18px;
  padding: 18px 16px;
  text-align: left;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;
  min-height: 82px;
}

.quiz-option:hover {
  border-color: #e9b4c7;
  color: #b76e88;
  background: #fff8fb;
}

.quiz-option.selected {
  background: linear-gradient(135deg, #fdf2f8, #f5f3ff);
  border-color: #e9b4c7;
  color: #b76e88;
}

.quiz-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 24px;
}

.finish-btn {
  border-radius: 999px;
  text-transform: none;
  font-weight: 600;
}

@media (max-width: 640px) {
  .quiz-options {
    grid-template-columns: 1fr;
  }

  .quiz-question {
    font-size: 20px;
  }
}
</style>