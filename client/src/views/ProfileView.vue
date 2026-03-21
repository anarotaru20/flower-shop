<template>
  <v-container class="py-8">
    <div class="profile-page">
      <div class="profile-header">
        <div>
          <h1 class="profile-title">My Profile</h1>
          <p class="profile-subtitle">Manage your account details and delivery information</p>
        </div>
      </div>

      <v-row>
        <v-col cols="12" md="4">
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
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="8">
          <v-card class="profile-card" elevation="0">
            <v-card-text>
              <div class="section-head">
                <h2>Account information</h2>
              </div>

              <v-alert
                v-if="profileStore.error"
                type="error"
                variant="tonal"
                class="mb-4"
              >
                {{ profileStore.error }}
              </v-alert>

              <v-alert
                v-if="successMessage"
                type="success"
                variant="tonal"
                class="mb-4"
              >
                {{ successMessage }}
              </v-alert>

              <div v-if="profileStore.loading" class="loading-wrap">
                <v-progress-circular indeterminate size="34" />
              </div>

              <v-form v-else @submit.prevent="handleSubmit">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="form.first_name"
                      label="First name"
                      variant="outlined"
                      density="comfortable"
                    />
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="form.last_name"
                      label="Last name"
                      variant="outlined"
                      density="comfortable"
                    />
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="form.username"
                      label="Username"
                      variant="outlined"
                      density="comfortable"
                    />
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      :model-value="form.email"
                      label="Email"
                      variant="outlined"
                      density="comfortable"
                      readonly
                    />
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="form.birth_date"
                      label="Birth date"
                      type="date"
                      variant="outlined"
                      density="comfortable"
                    />
                  </v-col>

                  <v-col cols="12">
                    <v-textarea
                      v-model="form.address"
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
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useProfileStore } from '@/stores/profile'

const profileStore = useProfileStore()
const successMessage = ref('')

const form = reactive({
  username: '',
  first_name: '',
  last_name: '',
  birth_date: '',
  address: '',
  email: '',
})

const displayName = computed(() => {
  const first = profileStore.profile.first_name || ''
  const last = profileStore.profile.last_name || ''
  return `${first} ${last}`.trim() || profileStore.profile.username || ''
})

const initials = computed(() => {
  const source =
    displayName.value ||
    profileStore.profile.email ||
    'B'

  return source
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('')
})

function syncForm() {
  form.username = profileStore.profile.username || ''
  form.first_name = profileStore.profile.first_name || ''
  form.last_name = profileStore.profile.last_name || ''
  form.birth_date = profileStore.profile.birth_date || ''
  form.address = profileStore.profile.address || ''
  form.email = profileStore.profile.email || ''
}

async function handleSubmit() {
  successMessage.value = ''

  try {
    await profileStore.saveProfile({
      username: form.username,
      first_name: form.first_name,
      last_name: form.last_name,
      birth_date: form.birth_date || null,
      address: form.address,
    })

    syncForm()
    successMessage.value = 'Profile updated successfully.'
  } catch (error) {
  }
}

watch(
  () => profileStore.profile,
  () => {
    syncForm()
  },
  { deep: true }
)

onMounted(async () => {
  await profileStore.fetchProfile()
  syncForm()
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

.section-head {
  margin-bottom: 20px;
}

.section-head h2 {
  font-size: 22px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
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
</style>