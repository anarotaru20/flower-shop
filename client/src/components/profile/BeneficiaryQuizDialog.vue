<template>
  <v-dialog v-model="model" max-width="680">
    <v-card class="quiz-card" elevation="0">
      <v-card-title class="quiz-title"> Quiz pentru preferințele persoanei</v-card-title>

      <v-card-text class="quiz-body">
        <div class="quiz-progress">
          <div class="quiz-subtitle">
            Alege varianta care se potrivește cel mai bine.
          </div>
          <div class="quiz-step">Pasul {{ step.value }} din 4</div>
          <div class="quiz-question">{{ currentQuestion }}</div>
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

        <div v-if="step === 4" class="quiz-budget-note">
          Vom folosi un interval de buget sugerat pe baza preferinței selectate.
        </div>

        <div class="quiz-actions">
          <v-btn class="quiz-btn" variant="text" :disabled="step === 1" @click="goBack"> Înapoi </v-btn>

          <v-spacer />

          <v-btn  variant="text" @click="closeDialog"> Anulează </v-btn>

          <v-btn class="finish-btn" :disabled="!canContinue" @click="goNext">
            {{ step === 4 ? 'Finalizează quiz-ul' : 'Următorul' }}
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

const step = reactive({
  value: 1,
})

const answers = reactive({
  preferred_colors: [],
  preferred_style: '',
  preferred_product_type: '',
  budget_key: '',
})

const colorOptions = [
  { label: 'roz, alb, lila', value: ['roz', 'alb', 'lila'] },
  { label: 'roșu, portocaliu, galben', value: ['rosu', 'portocaliu', 'galben'] },
  { label: 'verde', value: ['verde'] },
  { label: 'alb, crem', value: ['alb', 'crem'] },
]

const styleOptions = [
  { label: 'Elegant', value: 'Elegant' },
  { label: 'Jucăuș', value: 'JuJucăuș' },
  { label: 'Minimalist', value: 'Minimalist' },
  { label: 'Luxos', value: 'Luxos' },
]

const typeOptions = [
  { label: 'Buchet', value: 'Buchet' },
  { label: 'Plantă la ghiveci', value: 'Planta' },
  { label: 'Aranjament floral', value: 'Aranjament floral' },
  { label: 'Plantă de exterior', value: 'Plantă de exterior' },
]

const budgetOptions = [
  { label: '30 - 70 lei', value: 'small' },
  { label: '70 - 150 lei', value: 'medium' },
  { label: '150 - 200 lei', value: 'premium' },
  { label: '200 - 350 lei', value: 'extra-premium' },
]

const currentQuestion = computed(() => {
  if (step.value === 1) return 'Ce culori se potrivesc cel mai bine acestei persoane?'
  if (step.value === 2) return 'Ce stil ar prefera?'
  if (step.value === 3) return 'Ce tip de produs i-ar plăcea cel mai mult?'
  return 'Ce buget ți se pare potrivit pentru acest beneficiar?'
})

const currentOptions = computed(() => {
  if (step.value === 1) return colorOptions
  if (step.value === 2) return styleOptions
  if (step.value === 3) return typeOptions
  return budgetOptions
})

const canContinue = computed(() => {
  if (step.value === 1) return answers.preferred_colors.length > 0
  if (step.value === 2) return !!answers.preferred_style
  if (step.value === 3) return !!answers.preferred_product_type
  return !!answers.budget_key
})

function isSelected(value) {
  if (step.value === 1) {
    return JSON.stringify(answers.preferred_colors) === JSON.stringify(value)
  }

  if (step.value === 2) {
    return answers.preferred_style === value
  }

  if (step.value === 3) {
    return answers.preferred_product_type === value
  }

  return answers.budget_key === value
}

function handleSelect(value) {
  if (step.value === 1) {
    answers.preferred_colors = value
    return
  }

  if (step.value === 2) {
    answers.preferred_style = value
    return
  }

  if (step.value === 3) {
    answers.preferred_product_type = value
    return
  }

  answers.budget_key = value
}

function getBudgetRange(key) {
  if (key === 'small') return { budget_min: 30, budget_max: 70 }
  if (key === 'medium') return { budget_min: 70, budget_max: 150 }
  if (key === 'premium') return { budget_min: 150, budget_max: 200 }
  return { budget_min: 200, budget_max: 350 }
}

function resetQuiz() {
  step.value = 1
  answers.preferred_colors = []
  answers.preferred_style = ''
  answers.preferred_product_type = ''
  answers.budget_key = ''
}

function closeDialog() {
  model.value = false
}

function goBack() {
  if (step.value > 1) {
    step.value -= 1
  }
}

function goNext() {
  if (!canContinue.value) return

  if (step.value < 4) {
    step.value += 1
    return
  }

  const budget = getBudgetRange(answers.budget_key)

  emit('complete', {
    preferred_colors: answers.preferred_colors,
    preferred_style: answers.preferred_style,
    preferred_product_type: answers.preferred_product_type,
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
  },
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
  color: #b9364e;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  padding: 22px 24px 10px;
  border-bottom: 2px solid #f1e6e1;
  margin: 20px;
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
  padding-bottom: 15px;
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

.quiz-budget-note {
  margin-top: 14px;
  color: #6b7280;
  font-size: 14px;
}

.quiz-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 24px;
}

.quiz-btn {
  font-weight: 700;
  color: #b9364e;
  border: 1px solid #f3c4cd;
  background: #fff1f4;
}
.finish-btn {
  border-radius: 10px;
  text-transform: none;
  font-weight: 600;
  font-weight: 600;
  background: #b9364e;
  color: white;
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
