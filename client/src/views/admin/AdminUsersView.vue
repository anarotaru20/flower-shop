<template>
  <div class="users-page">
    <div class="users-header">
      <div class="users-title-wrap">
        <h1 class="text-h4 font-weight-bold page-title">Utilizatori</h1>
      </div>

      <div class="users-toolbar">
        <v-text-field
          v-model="searchQuery"
          placeholder="Caută după nume..."
          variant="outlined"
          density="comfortable"
          prepend-inner-icon="mdi-magnify"
          hide-details
          clearable
          class="users-search"
        />
        <v-btn
          color="primary"
          class="reload-users-btn"
          @click="reloadUsers"
          :loading="store.loading"
        >
          Reîncarcă
        </v-btn>
      </div>
    </div>

    <v-alert v-if="store.error" type="error" variant="tonal" class="mb-4">
      {{ store.error }}
    </v-alert>

    <v-card class="users-card" elevation="2">
      <v-card-title class="font-weight-bold users-card-title">
        Lista utilizatori
        <v-spacer />
        <span class="users-count">{{ filteredUsers.length }} utilizatori</span>
      </v-card-title>

      <v-card-text>
        <div v-if="store.loading" class="loading-wrap">
          <v-progress-circular indeterminate />
        </div>

        <template v-else>
          <div class="desktop-table">
            <v-table class="users-table">
              <thead>
                <tr>
                  <th class="text-left font-weight-bold">ID</th>
                  <th class="text-left font-weight-bold">Email</th>
                  <th class="text-left font-weight-bold">Nume</th>
                  <th class="text-left font-weight-bold">Rol curent</th>
                  <th class="text-left font-weight-bold">Schimbă rol</th>
                  <th class="text-left font-weight-bold">Creat la</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="user in filteredUsers" :key="user.id">
                  <td class="user-id">{{ user.id }}</td>
                  <td>{{ user.email || '-' }}</td>
                  <td class="user-name">{{ user.full_name || '-' }}</td>
                  <td>
                    <v-chip
                      :color="user.role === 'admin' ? 'deep-purple' : 'grey-darken-1'"
                      size="small"
                      variant="flat"
                      class="role-chip"
                    >
                      {{ user.role === 'admin' ? 'Administrator' : 'Client' }}
                    </v-chip>
                  </td>
                  <td class="role-select-cell">
                    <v-select
                      :model-value="user.role"
                      :items="roleOptions"
                      item-title="label"
                      item-value="value"
                      density="compact"
                      variant="outlined"
                      hide-details
                      @update:model-value="changeRole(user, $event)"
                    />
                  </td>
                  <td>{{ formatDate(user.created_at) }}</td>
                </tr>

                <tr v-if="!filteredUsers.length">
                  <td colspan="6" class="text-center py-6">
                    Nu există utilizatori care să corespundă căutării.
                  </td>
                </tr>
              </tbody>
            </v-table>
          </div>

          <div class="mobile-users">
            <div v-for="user in filteredUsers" :key="user.id" class="mobile-user-card">
              <div class="mobile-user-top">
                <div class="mobile-user-main">
                  <h3 class="mobile-user-name">{{ user.full_name || '-' }}</h3>
                  <p class="mobile-user-email">{{ user.email || '-' }}</p>
                </div>

                <v-chip
                  :color="user.role === 'admin' ? 'deep-purple' : 'grey-darken-1'"
                  size="small"
                  variant="flat"
                  class="role-chip"
                >
                  {{ user.role === 'admin' ? 'Administrator' : 'Client' }}
                </v-chip>
              </div>

              <div class="mobile-user-meta">
                <div class="mobile-meta-box">
                  <span class="mobile-meta-label">ID</span>
                  <span class="mobile-meta-value mobile-id">{{ user.id }}</span>
                </div>

                <div class="mobile-meta-box">
                  <span class="mobile-meta-label">Creat la</span>
                  <span class="mobile-meta-value">{{ formatDate(user.created_at) }}</span>
                </div>
              </div>

              <div class="mobile-role-section">
                <span class="mobile-meta-label">Schimbă rol</span>
                <v-select
                  :model-value="user.role"
                  :items="roleOptions"
                  item-title="label"
                  item-value="value"
                  density="compact"
                  variant="outlined"
                  hide-details
                  @update:model-value="changeRole(user, $event)"
                />
              </div>
            </div>

            <div v-if="!filteredUsers.length" class="mobile-empty-state">
              Nu există utilizatori care să corespundă căutării.
            </div>
          </div>
        </template>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useAdminUsersStore } from '@/stores/adminUsers'

const store = useAdminUsersStore()
const searchQuery = ref('')

const roleOptions = [
  { label: 'Client', value: 'customer' },
  { label: 'Administrator', value: 'admin' },
]

const filteredUsers = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  if (!query) return store.users || []

  return (store.users || []).filter((user) => (user.full_name || '').toLowerCase().includes(query))
})

function formatDate(value) {
  if (!value) return '-'
  return new Date(value).toLocaleString('ro-RO')
}

async function reloadUsers() {
  await store.fetchUsers()
}

async function changeRole(user, newRole) {
  if (!newRole || newRole === user.role) return
  await store.changeUserRole(user.id, newRole)
}

onMounted(async () => {
  await store.fetchUsers()
})
</script>

<style scoped>
.users-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 8px;
}

.users-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.users-title-wrap {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.page-title {
  color: #1f2937;
}

.page-subtitle {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

.users-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.users-search {
  min-width: 320px;
  max-width: 380px;
}

.reload-users-btn {
  height: 48px;
  border-radius: 10px;
  text-transform: none;
  font-weight: 700;
  padding-inline: 18px;
  background: #b9364e;
  color: white;
}

.users-card {
  border-radius: 24px;
  border: 1px solid #f1e6e1;
  box-shadow: 0 12px 30px rgba(76, 58, 50, 0.08) !important;
  overflow: hidden;
}

.users-card-title {
  padding: 22px 24px 10px;
  color: #1f2937;
}

.users-count {
  font-size: 13px;
  font-weight: 700;
  color: #6b7280;
}

.loading-wrap {
  display: flex;
  justify-content: center;
  padding: 36px 0;
}

.desktop-table {
  display: block;
}

.mobile-users {
  display: none;
}

:deep(.users-table) {
  background: transparent;
}

:deep(.users-table .v-table__wrapper) {
  overflow-x: auto;
}

:deep(.users-table thead th) {
  color: #374151;
  font-size: 14px;
  font-weight: 800 !important;
  white-space: nowrap;
}

:deep(.users-table tbody td) {
  padding-top: 16px !important;
  padding-bottom: 16px !important;
  color: #111827;
  vertical-align: middle;
}

:deep(.users-table tbody tr) {
  transition: background 0.2s ease;
}

:deep(.users-table tbody tr:hover) {
  background: #fcfcfc;
}

.user-id {
  max-width: 200px;
  font-size: 12px;
  color: #6b7280;
  word-break: break-all;
}

.user-name {
  font-weight: 700;
  color: #1f2937;
}

.role-chip {
  font-weight: 700;
}

.role-select-cell {
  min-width: 170px;
}

.mobile-user-card {
  border: 1px solid #f1e6e1;
  border-radius: 20px;
  padding: 16px;
  background: #fff;
  box-shadow: 0 8px 20px rgba(76, 58, 50, 0.06);
}

.mobile-user-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.mobile-user-main {
  min-width: 0;
  flex: 1;
}

.mobile-user-name {
  margin: 0;
  font-size: 16px;
  font-weight: 800;
  color: #1f2937;
  word-break: break-word;
}

.mobile-user-email {
  margin: 4px 0 0;
  color: #6b7280;
  font-size: 13px;
  word-break: break-word;
}

.mobile-user-meta {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-top: 14px;
}

.mobile-meta-box {
  background: #fcfaf8;
  border: 1px solid #f1e6e1;
  border-radius: 16px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mobile-meta-label {
  font-size: 12px;
  font-weight: 700;
  color: #6b7280;
}

.mobile-meta-value {
  font-size: 14px;
  font-weight: 800;
  color: #1f2937;
  word-break: break-word;
}

.mobile-id {
  font-size: 12px;
  color: #6b7280;
}

.mobile-role-section {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid #f3ebe7;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mobile-empty-state {
  text-align: center;
  padding: 24px 16px;
  color: #6b7280;
  border: 1px dashed #e7d7cf;
  border-radius: 18px;
}

@media (max-width: 960px) {
  .users-page {
    padding: 4px;
  }

  .users-header {
    align-items: stretch;
  }

  .users-toolbar {
    width: 100%;
  }

  .users-search {
    min-width: 0;
    max-width: none;
    flex: 1;
  }

  .reload-users-btn {
    flex-shrink: 0;
  }
}

@media (max-width: 700px) {
  .desktop-table {
    display: none;
  }

  .mobile-users {
    display: grid;
    gap: 14px;
  }

  .users-card-title {
    padding: 18px 18px 8px;
  }

  .page-title {
    font-size: 28px !important;
  }

  .page-subtitle {
    font-size: 13px;
  }
}

@media (max-width: 600px) {
  .users-page {
    padding: 0;
  }

  .users-header {
    gap: 14px;
    margin-bottom: 18px;
  }

  .users-toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .users-search {
    width: 100%;
  }

  .reload-users-btn {
    width: 100%;
  }

  .users-card {
    border-radius: 20px;
  }

  .mobile-user-card {
    padding: 14px;
    border-radius: 18px;
  }
}
</style>
