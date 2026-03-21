<template>
  <v-container class="py-8">
    <div class="profile-page">
      <div class="profile-header">
        <div>
          <h1 class="profile-title">My Profile</h1>
          <p class="profile-subtitle">Manage your account details and smart reminders</p>
        </div>
      </div>

      <v-row>
        <v-col cols="12" md="4" lg="3">
          <v-card class="profile-side" elevation="0">
            <v-card-text>
              <div class="profile-avatar-wrap">
                <v-avatar size="88" class="profile-avatar">
                  <span class="profile-avatar-text">
                    {{ initials }}
                  </span>
                </v-avatar>
              </div>

              <h2 class="profile-name">
                {{ displayName || 'Bloomera User' }}
              </h2>

              <p class="profile-email">
                {{ profileStore.profile.email || '-' }}
              </p>

              <v-divider class="my-4" />

              <div class="profile-meta">
                <div class="meta-item">
                  <span class="meta-label">Username</span>
                  <span class="meta-value">{{ profileStore.profile.username || '-' }}</span>
                </div>

                <div class="meta-item">
                  <span class="meta-label">Role</span>
                  <span class="meta-value">{{ profileStore.profile.role || 'customer' }}</span>
                </div>

                <div class="meta-item">
                  <span class="meta-label">Address</span>
                  <span class="meta-value">{{ profileStore.profile.address || '-' }}</span>
                </div>
              </div>

              <v-divider class="my-4" />

              <div class="profile-menu">
                <button
                  class="menu-item"
                  :class="{ active: activeSection === 'account' }"
                  @click="activeSection = 'account'"
                >
                  Account Info
                </button>

                <button
                  class="menu-item"
                  :class="{ active: activeSection === 'reminders' }"
                  @click="activeSection = 'reminders'"
                >
                  Smart Reminder
                </button>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="8" lg="9">
          <v-card class="profile-card" elevation="0">
            <v-card-text>
              <v-alert
                v-if="profileStore.error && activeSection === 'account'"
                type="error"
                variant="tonal"
                class="mb-4"
              >
                {{ profileStore.error }}
              </v-alert>

              <v-alert
                v-if="beneficiariesStore.error && activeSection === 'reminders'"
                type="error"
                variant="tonal"
                class="mb-4"
              >
                {{ beneficiariesStore.error }}
              </v-alert>

              <v-alert
                v-if="eventsStore.error && activeSection === 'reminders'"
                type="error"
                variant="tonal"
                class="mb-4"
              >
                {{ eventsStore.error }}
              </v-alert>

              <v-alert
                v-if="successMessage && activeSection === 'account'"
                type="success"
                variant="tonal"
                class="mb-4"
              >
                {{ successMessage }}
              </v-alert>

              <v-alert
                v-if="reminderSuccessMessage && activeSection === 'reminders'"
                type="success"
                variant="tonal"
                class="mb-4"
              >
                {{ reminderSuccessMessage }}
              </v-alert>

              <template v-if="activeSection === 'account'">
                <div class="section-head">
                  <h2>Account information</h2>
                  <p>Edit your personal details and delivery info.</p>
                </div>

                <div v-if="profileStore.loading" class="loading-wrap">
                  <v-progress-circular indeterminate size="34" />
                </div>

                <v-form v-else @submit.prevent="handleProfileSubmit">
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="profileForm.first_name"
                        label="First name"
                        variant="outlined"
                        density="comfortable"
                      />
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="profileForm.last_name"
                        label="Last name"
                        variant="outlined"
                        density="comfortable"
                      />
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="profileForm.username"
                        label="Username"
                        variant="outlined"
                        density="comfortable"
                      />
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field
                        :model-value="profileForm.email"
                        label="Email"
                        variant="outlined"
                        density="comfortable"
                        readonly
                      />
                    </v-col>

                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="profileForm.birth_date"
                        label="Birth date"
                        type="date"
                        variant="outlined"
                        density="comfortable"
                      />
                    </v-col>

                    <v-col cols="12">
                      <v-textarea
                        v-model="profileForm.address"
                        label="Address"
                        variant="outlined"
                        density="comfortable"
                        rows="3"
                        auto-grow
                      />
                    </v-col>
                  </v-row>

                  <div class="actions">
                    <v-btn
                      type="submit"
                      class="save-btn"
                      :loading="profileStore.saving"
                      :disabled="profileStore.saving"
                    >
                      Save changes
                    </v-btn>
                  </div>
                </v-form>
              </template>

              <template v-else-if="activeSection === 'reminders'">
                <div class="section-head section-head-inline">
                  <div>
                    <h2>Smart Reminder</h2>
                    <p>Manage beneficiaries, events and personalized floral reminders.</p>
                  </div>
                </div>

                <div v-if="remindersLoading" class="loading-wrap">
                  <v-progress-circular indeterminate size="34" />
                </div>

                <template v-else>
                  <div class="smart-grid">
                    <div class="smart-column">
                      <div class="smart-panel">
                        <div class="smart-panel-head">
                          <div>
                            <h3>Beneficiaries</h3>
                            <p>Saved people and their floral preferences</p>
                          </div>

                          <v-btn class="smart-action-btn" @click="openAddBeneficiaryDialog">
                            Add beneficiary
                          </v-btn>
                        </div>

                        <div v-if="!beneficiariesStore.list.length" class="empty-state">
                          <div class="empty-icon">💐</div>
                          <h4>No beneficiaries yet</h4>
                          <p>
                            Add your first beneficiary to reuse their preferences for future events.
                          </p>
                        </div>

                        <div v-else class="cards-list">
                          <div
                            v-for="beneficiary in beneficiariesStore.list"
                            :key="beneficiary.id"
                            class="entity-card"
                          >
                            <div class="entity-card-top">
                              <div>
                                <h4>{{ beneficiary.name }}</h4>
                                <p>{{ beneficiary.relationship || 'No relationship added' }}</p>
                              </div>

                              <div class="entity-actions">
                                <v-btn
                                  size="small"
                                  variant="text"
                                  class="text-btn"
                                  @click="openEditBeneficiaryDialog(beneficiary)"
                                >
                                  Edit
                                </v-btn>
                                <v-btn
                                  size="small"
                                  variant="text"
                                  class="text-btn danger-btn"
                                  @click="handleDeleteBeneficiary(beneficiary)"
                                >
                                  Delete
                                </v-btn>
                              </div>
                            </div>

                            <div class="entity-details">
                              <div class="detail-row">
                                <span class="detail-label">Preferred colors</span>
                                <span class="detail-value">
                                  {{ formatColors(beneficiary.preferred_colors) }}
                                </span>
                              </div>

                              <div class="detail-row">
                                <span class="detail-label">Preferred style</span>
                                <span class="detail-value">{{
                                  beneficiary.preferred_style || '-'
                                }}</span>
                              </div>

                              <div class="detail-row">
                                <span class="detail-label">Preferred type</span>
                                <span class="detail-value">{{
                                  beneficiary.preferred_product_type || '-'
                                }}</span>
                              </div>

                              <div class="detail-row">
                                <span class="detail-label">Budget</span>
                                <span class="detail-value">
                                  {{ formatBudget(beneficiary.budget_min, beneficiary.budget_max) }}
                                </span>
                              </div>

                              <div class="detail-row">
                                <span class="detail-label">Notes</span>
                                <span class="detail-value">{{ beneficiary.notes || '-' }}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="smart-column">
                      <div class="smart-panel">
                        <div class="smart-panel-head">
                          <div>
                            <h3>Events</h3>
                            <p>Birthdays, anniversaries and special moments</p>
                          </div>

                          <v-btn class="smart-action-btn" @click="openAddEventDialog">
                            Add event
                          </v-btn>
                        </div>

                        <div v-if="!eventsStore.list.length" class="empty-state">
                          <div class="empty-icon">📅</div>
                          <h4>No events yet</h4>
                          <p>Create an event and connect it to a beneficiary profile.</p>
                        </div>

                        <div v-else class="cards-list">
                          <div
                            v-for="event in eventsStore.list"
                            :key="event.id"
                            class="entity-card"
                          >
                            <div class="entity-card-top">
                              <div>
                                <h4>{{ beautifyEventType(event.event_type) }}</h4>
                                <p>{{ getBeneficiaryName(event.beneficiary_id) }}</p>
                              </div>

                              <div class="entity-actions">
                                <v-btn
                                  size="small"
                                  variant="text"
                                  class="text-btn"
                                  @click="openEditEventDialog(event)"
                                >
                                  Edit
                                </v-btn>
                                <v-btn
                                  size="small"
                                  variant="text"
                                  class="text-btn danger-btn"
                                  @click="handleDeleteEvent(event)"
                                >
                                  Delete
                                </v-btn>
                              </div>
                            </div>

                            <div class="entity-details">
                              <div class="detail-row">
                                <span class="detail-label">Event date</span>
                                <span class="detail-value">{{ event.event_date || '-' }}</span>
                              </div>

                              <div class="detail-row">
                                <span class="detail-label">Reminder days before</span>
                                <span class="detail-value">{{
                                  event.reminder_days_before ?? 4
                                }}</span>
                              </div>

                              <div class="detail-row">
                                <span class="detail-label">Notes</span>
                                <span class="detail-value">{{ event.notes || '-' }}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="smart-info">
                        <h3>How it works</h3>
                        <ul>
                          <li>Add a beneficiary once and reuse it for future events.</li>
                          <li>Create an event and connect it to a beneficiary profile.</li>
                          <li>Set how many days before the reminder should trigger.</li>
                          <li>
                            Use saved preferences later for personalized product recommendations.
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </template>
              </template>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <v-dialog v-model="beneficiaryDialog" max-width="760">
      <v-card class="dialog-card">
        <v-card-title class="dialog-title">
          {{ beneficiaryEditId ? 'Edit beneficiary' : 'Add beneficiary' }}
        </v-card-title>

        <v-card-text class="dialog-body">
          <v-form @submit.prevent="handleSaveBeneficiary">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="beneficiaryForm.name"
                  label="Name"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="beneficiaryForm.relationship"
                  label="Relationship"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

              <v-col cols="12">
                <div class="quiz-helper">
                  <div class="quiz-helper-text">
                    <h4>Not sure what to fill in?</h4>
                    <p>
                      We can help you with a few quick questions and suggest the beneficiary
                      preferences automatically.
                    </p>
                  </div>

                  <v-btn
                    variant="outlined"
                    class="quiz-helper-btn"
                    @click="beneficiaryQuizDialog = true"
                  >
                    Start quiz
                  </v-btn>
                </div>
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="beneficiaryForm.preferred_colors_text"
                  label="Preferred colors"
                  hint="Example: pink, white, lilac"
                  persistent-hint
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="beneficiaryForm.preferred_style"
                  label="Preferred style"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="beneficiaryForm.preferred_product_type"
                  label="Preferred product type"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

              <v-col cols="12" md="3">
                <v-text-field
                  v-model="beneficiaryForm.budget_min"
                  label="Budget min"
                  type="number"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

              <v-col cols="12" md="3">
                <v-text-field
                  v-model="beneficiaryForm.budget_max"
                  label="Budget max"
                  type="number"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="beneficiaryForm.notes"
                  label="Notes"
                  variant="outlined"
                  density="comfortable"
                  rows="3"
                  auto-grow
                />
              </v-col>
            </v-row>

            <div class="dialog-actions">
              <v-btn variant="text" @click="closeBeneficiaryDialog">Cancel</v-btn>
              <v-btn
                type="submit"
                class="save-btn"
                :loading="beneficiariesStore.saving"
                :disabled="beneficiariesStore.saving"
              >
                Save beneficiary
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="eventDialog" max-width="760">
      <v-card class="dialog-card">
        <v-card-title class="dialog-title">
          {{ eventEditId ? 'Edit event' : 'Add event' }}
        </v-card-title>

        <v-card-text class="dialog-body">
          <v-form @submit.prevent="handleSaveEvent">
            <v-row>
              <v-col cols="12" md="8">
                <v-select
                  v-model="eventForm.beneficiary_id"
                  :items="beneficiaryOptions"
                  item-title="title"
                  item-value="value"
                  label="Beneficiary"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

              <v-col cols="12" md="4" class="d-flex align-end">
                <v-btn
                  block
                  variant="outlined"
                  class="inline-add-btn"
                  @click="openAddBeneficiaryFromEvent"
                >
                  Add beneficiary
                </v-btn>
              </v-col>

              <v-col cols="12" md="6">
                <v-select
                  v-model="eventForm.event_type"
                  :items="eventTypeOptions"
                  label="Event type"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="eventForm.event_date"
                  label="Event date"
                  type="date"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field
                  v-model="eventForm.reminder_days_before"
                  label="Reminder days before"
                  type="number"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="eventForm.notes"
                  label="Notes"
                  variant="outlined"
                  density="comfortable"
                  rows="3"
                  auto-grow
                />
              </v-col>
            </v-row>

            <div class="dialog-actions">
              <v-btn variant="text" @click="closeEventDialog">Cancel</v-btn>
              <v-btn
                type="submit"
                class="save-btn"
                :loading="eventsStore.saving"
                :disabled="eventsStore.saving"
              >
                Save event
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <BeneficiaryQuizDialog v-model="beneficiaryQuizDialog" @complete="handleQuizComplete" />
  </v-container>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import BeneficiaryQuizDialog from '@/components/profile/BeneficiaryQuizDialog.vue'
import { useProfileStore } from '@/stores/profile'
import { useBeneficiariesStore } from '@/stores/beneficiaries'
import { useEventsStore } from '@/stores/events'

const profileStore = useProfileStore()
const beneficiariesStore = useBeneficiariesStore()
const eventsStore = useEventsStore()

const beneficiaryQuizDialog = ref(false)
const activeSection = ref('account')
const successMessage = ref('')
const reminderSuccessMessage = ref('')

const beneficiaryDialog = ref(false)
const beneficiaryEditId = ref(null)

const eventDialog = ref(false)
const eventEditId = ref(null)

const profileForm = reactive({
  username: '',
  first_name: '',
  last_name: '',
  birth_date: '',
  address: '',
  email: '',
})

const beneficiaryForm = reactive({
  name: '',
  relationship: '',
  preferred_colors_text: '',
  preferred_style: '',
  preferred_product_type: '',
  budget_min: '',
  budget_max: '',
  notes: '',
})

const eventForm = reactive({
  beneficiary_id: '',
  event_type: '',
  event_date: '',
  reminder_days_before: 4,
  notes: '',
})

const eventTypeOptions = [
  { title: 'Birthday', value: 'birthday' },
  { title: 'Anniversary', value: 'anniversary' },
  { title: 'Holiday', value: 'holiday' },
  { title: 'Custom', value: 'custom' },
]

const remindersLoading = computed(() => beneficiariesStore.loading || eventsStore.loading)

const beneficiaryOptions = computed(() =>
  beneficiariesStore.list.map((beneficiary) => ({
    title: beneficiary.name,
    value: beneficiary.id,
  })),
)

const displayName = computed(() => {
  const first = profileStore.profile.first_name || ''
  const last = profileStore.profile.last_name || ''
  return `${first} ${last}`.trim() || profileStore.profile.username || ''
})

const initials = computed(() => {
  const source = displayName.value || profileStore.profile.email || 'B'

  return source
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('')
})

function syncProfileForm() {
  profileForm.username = profileStore.profile.username || ''
  profileForm.first_name = profileStore.profile.first_name || ''
  profileForm.last_name = profileStore.profile.last_name || ''
  profileForm.birth_date = profileStore.profile.birth_date || ''
  profileForm.address = profileStore.profile.address || ''
  profileForm.email = profileStore.profile.email || ''
}

function resetBeneficiaryForm() {
  beneficiaryForm.name = ''
  beneficiaryForm.relationship = ''
  beneficiaryForm.preferred_colors_text = ''
  beneficiaryForm.preferred_style = ''
  beneficiaryForm.preferred_product_type = ''
  beneficiaryForm.budget_min = ''
  beneficiaryForm.budget_max = ''
  beneficiaryForm.notes = ''
}

function resetEventForm() {
  eventForm.beneficiary_id = ''
  eventForm.event_type = ''
  eventForm.event_date = ''
  eventForm.reminder_days_before = 4
  eventForm.notes = ''
}

function parseColors(text) {
  return String(text || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function formatColors(colors) {
  if (!Array.isArray(colors) || !colors.length) return '-'
  return colors.join(', ')
}

function formatBudget(min, max) {
  const hasMin = min !== null && min !== undefined && min !== ''
  const hasMax = max !== null && max !== undefined && max !== ''

  if (hasMin && hasMax) return `${min} - ${max} RON`
  if (hasMin) return `from ${min} RON`
  if (hasMax) return `up to ${max} RON`
  return '-'
}

function beautifyEventType(value) {
  if (!value) return 'Event'
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function getBeneficiaryName(beneficiaryId) {
  const beneficiary = beneficiariesStore.list.find((item) => item.id === beneficiaryId)
  return beneficiary?.name || 'Unknown beneficiary'
}

function openAddBeneficiaryDialog() {
  reminderSuccessMessage.value = ''
  beneficiaryEditId.value = null
  resetBeneficiaryForm()
  beneficiaryDialog.value = true
}

function handleQuizComplete(result) {
  beneficiaryForm.preferred_colors_text = Array.isArray(result.preferred_colors)
    ? result.preferred_colors.join(', ')
    : ''
  beneficiaryForm.preferred_style = result.preferred_style || ''
  beneficiaryForm.preferred_product_type = result.preferred_product_type || ''
  beneficiaryForm.budget_min = result.budget_min ?? ''
  beneficiaryForm.budget_max = result.budget_max ?? ''
}

function openEditBeneficiaryDialog(beneficiary) {
  reminderSuccessMessage.value = ''
  beneficiaryEditId.value = beneficiary.id
  beneficiaryForm.name = beneficiary.name || ''
  beneficiaryForm.relationship = beneficiary.relationship || ''
  beneficiaryForm.preferred_colors_text = Array.isArray(beneficiary.preferred_colors)
    ? beneficiary.preferred_colors.join(', ')
    : ''
  beneficiaryForm.preferred_style = beneficiary.preferred_style || ''
  beneficiaryForm.preferred_product_type = beneficiary.preferred_product_type || ''
  beneficiaryForm.budget_min = beneficiary.budget_min ?? ''
  beneficiaryForm.budget_max = beneficiary.budget_max ?? ''
  beneficiaryForm.notes = beneficiary.notes || ''
  beneficiaryDialog.value = true
}

function closeBeneficiaryDialog() {
  beneficiaryDialog.value = false
  beneficiaryEditId.value = null
  resetBeneficiaryForm()
}

function openAddEventDialog() {
  reminderSuccessMessage.value = ''

  if (!beneficiariesStore.list.length) {
    openAddBeneficiaryDialog()
    return
  }

  eventEditId.value = null
  resetEventForm()
  eventDialog.value = true
}

function openEditEventDialog(event) {
  reminderSuccessMessage.value = ''
  eventEditId.value = event.id
  eventForm.beneficiary_id = event.beneficiary_id || ''
  eventForm.event_type = event.event_type || ''
  eventForm.event_date = event.event_date || ''
  eventForm.reminder_days_before = event.reminder_days_before ?? 4
  eventForm.notes = event.notes || ''
  eventDialog.value = true
}

function openAddBeneficiaryFromEvent() {
  beneficiaryDialog.value = true
  beneficiaryEditId.value = null
  resetBeneficiaryForm()
}

function closeEventDialog() {
  eventDialog.value = false
  eventEditId.value = null
  resetEventForm()
}

async function handleProfileSubmit() {
  successMessage.value = ''

  try {
    await profileStore.saveProfile({
      username: profileForm.username,
      first_name: profileForm.first_name,
      last_name: profileForm.last_name,
      birth_date: profileForm.birth_date || null,
      address: profileForm.address,
    })

    syncProfileForm()
    successMessage.value = 'Profile updated successfully.'
  } catch (error) {}
}

async function handleSaveBeneficiary() {
  reminderSuccessMessage.value = ''

  const payload = {
    name: beneficiaryForm.name,
    relationship: beneficiaryForm.relationship || null,
    preferred_colors: parseColors(beneficiaryForm.preferred_colors_text),
    preferred_style: beneficiaryForm.preferred_style || null,
    preferred_product_type: beneficiaryForm.preferred_product_type || null,
    budget_min: beneficiaryForm.budget_min === '' ? null : Number(beneficiaryForm.budget_min),
    budget_max: beneficiaryForm.budget_max === '' ? null : Number(beneficiaryForm.budget_max),
    notes: beneficiaryForm.notes || null,
  }

  try {
    const data = beneficiaryEditId.value
      ? await beneficiariesStore.editBeneficiary(beneficiaryEditId.value, payload)
      : await beneficiariesStore.addBeneficiary(payload)

    closeBeneficiaryDialog()

    if (eventDialog.value && !eventForm.beneficiary_id && data?.id) {
      eventForm.beneficiary_id = data.id
    }

    reminderSuccessMessage.value = beneficiaryEditId.value
      ? 'Beneficiary updated successfully.'
      : 'Beneficiary added successfully.'
  } catch (error) {}
}

async function handleSaveEvent() {
  reminderSuccessMessage.value = ''

  const payload = {
    beneficiary_id: eventForm.beneficiary_id,
    event_type: eventForm.event_type,
    event_date: eventForm.event_date,
    reminder_days_before:
      eventForm.reminder_days_before === '' || eventForm.reminder_days_before === null
        ? 4
        : Number(eventForm.reminder_days_before),
    notes: eventForm.notes || null,
  }

  try {
    await (eventEditId.value
      ? eventsStore.editEvent(eventEditId.value, payload)
      : eventsStore.addEvent(payload))

    const wasEdit = !!eventEditId.value
    closeEventDialog()

    reminderSuccessMessage.value = wasEdit
      ? 'Event updated successfully.'
      : 'Event added successfully. The reminder will be sent automatically.'
  } catch (error) {}
}

async function handleDeleteBeneficiary(beneficiary) {
  const confirmed = window.confirm(`Delete beneficiary "${beneficiary.name}"?`)
  if (!confirmed) return

  reminderSuccessMessage.value = ''

  try {
    await beneficiariesStore.removeBeneficiary(beneficiary.id)
    reminderSuccessMessage.value = 'Beneficiary deleted successfully.'
  } catch (error) {}
}

async function handleDeleteEvent(event) {
  const confirmed = window.confirm(
    `Delete event "${beautifyEventType(event.event_type)}" for ${getBeneficiaryName(event.beneficiary_id)}?`,
  )
  if (!confirmed) return

  reminderSuccessMessage.value = ''

  try {
    await eventsStore.removeEvent(event.id)
    reminderSuccessMessage.value = 'Event deleted successfully.'
  } catch (error) {}
}

watch(
  () => profileStore.profile,
  () => {
    syncProfileForm()
  },
  { deep: true },
)

onMounted(async () => {
  await profileStore.fetchProfile()
  syncProfileForm()
  await Promise.all([beneficiariesStore.fetchBeneficiaries(), eventsStore.fetchEvents()])
})
</script>

<style scoped>
.profile-page {
  max-width: 1200px;
  margin: 0 auto;
}

.profile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.profile-title {
  font-size: 32px;
  font-weight: 700;
  margin: 0;
  color: #1f2937;
}

.profile-subtitle {
  margin: 6px 0 0;
  color: #6b7280;
}

.profile-side,
.profile-card {
  border-radius: 24px;
  border: 1px solid #ece7f6;
  background: #ffffff;
}

.profile-side {
  height: 100%;
}

.profile-avatar-wrap {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.profile-avatar {
  background: linear-gradient(135deg, #d8b4fe, #f9a8d4);
  color: white;
}

.profile-avatar-text {
  font-size: 28px;
  font-weight: 700;
}

.profile-name {
  text-align: center;
  font-size: 22px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 6px;
}

.profile-email {
  text-align: center;
  color: #6b7280;
  margin-bottom: 0;
  word-break: break-word;
}

.profile-meta {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.meta-label {
  font-size: 13px;
  color: #9ca3af;
}

.meta-value {
  font-size: 15px;
  color: #374151;
  font-weight: 500;
  word-break: break-word;
}

.profile-menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.menu-item {
  width: 100%;
  border: 1px solid #ece7f6;
  background: #fff;
  color: #4b5563;
  border-radius: 16px;
  padding: 12px 14px;
  text-align: left;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;
}

.menu-item:hover {
  border-color: #e9b4c7;
  color: #b76e88;
}

.menu-item.active {
  background: linear-gradient(135deg, #fdf2f8, #f5f3ff);
  border-color: #e9b4c7;
  color: #b76e88;
}

.section-head {
  margin-bottom: 20px;
}

.section-head-inline {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-head h2 {
  font-size: 22px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 6px;
}

.section-head p {
  margin: 0;
  color: #6b7280;
}

.actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}

.save-btn {
  border-radius: 999px;
  padding-inline: 22px;
  text-transform: none;
  font-weight: 600;
}

.loading-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 220px;
}

.smart-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.smart-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.smart-panel {
  border: 1px solid #ece7f6;
  border-radius: 22px;
  background: linear-gradient(180deg, #fff, #fdf8fb);
  padding: 22px;
}

.smart-panel-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
}

.smart-panel-head h3 {
  margin: 0 0 6px;
  font-size: 20px;
  color: #1f2937;
}

.smart-panel-head p {
  margin: 0;
  color: #6b7280;
}

.smart-action-btn {
  border-radius: 999px;
  text-transform: none;
  font-weight: 600;
}

.cards-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.entity-card {
  border: 1px solid #eee6f7;
  border-radius: 18px;
  background: #ffffff;
  padding: 16px;
}

.entity-card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.entity-card-top h4 {
  margin: 0 0 4px;
  font-size: 18px;
  color: #1f2937;
}

.entity-card-top p {
  margin: 0;
  color: #6b7280;
}

.entity-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.text-btn {
  text-transform: none;
  font-weight: 600;
}

.danger-btn {
  color: #d15b72;
}

.entity-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-row {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 10px;
}

.detail-label {
  color: #9ca3af;
  font-size: 13px;
}

.detail-value {
  color: #374151;
  font-size: 14px;
  word-break: break-word;
}

.empty-state {
  border: 1px dashed #e9b4c7;
  border-radius: 20px;
  background: #fffafd;
  padding: 28px 20px;
  text-align: center;
}

.empty-icon {
  font-size: 34px;
  margin-bottom: 10px;
}

.empty-state h4 {
  margin: 0 0 6px;
  color: #1f2937;
}

.empty-state p {
  margin: 0;
  color: #6b7280;
  line-height: 1.6;
}

.smart-info {
  border: 1px solid #ece7f6;
  border-radius: 22px;
  background: #faf7ff;
  padding: 22px;
}

.smart-info h3 {
  margin: 0 0 12px;
  color: #1f2937;
}

.smart-info ul {
  margin: 0;
  padding-left: 18px;
  color: #4b5563;
  line-height: 1.8;
}

.dialog-card {
  border-radius: 24px;
}

.dialog-title {
  font-size: 22px;
  font-weight: 700;
  padding: 22px 24px 10px;
  color: #1f2937;
}

.dialog-body {
  padding-top: 8px;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
}

.inline-add-btn {
  min-height: 48px;
  border-radius: 14px;
  text-transform: none;
  font-weight: 600;
}

.quiz-helper {
  border: 1px solid #ece7f6;
  border-radius: 18px;
  background: linear-gradient(135deg, #fff8fb, #faf7ff);
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.quiz-helper-text h4 {
  margin: 0 0 6px;
  font-size: 17px;
  color: #1f2937;
}

.quiz-helper-text p {
  margin: 0;
  color: #6b7280;
  line-height: 1.6;
}

.quiz-helper-btn {
  border-radius: 999px;
  text-transform: none;
  font-weight: 600;
  flex-shrink: 0;
}

@media (max-width: 640px) {
  .quiz-helper {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 1100px) {
  .smart-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 960px) {
  .profile-title {
    font-size: 28px;
  }
}

@media (max-width: 600px) {
  .detail-row {
    grid-template-columns: 1fr;
  }

  .smart-panel-head,
  .entity-card-top {
    flex-direction: column;
  }
}
</style>
