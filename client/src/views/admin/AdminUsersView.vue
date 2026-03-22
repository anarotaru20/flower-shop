<template>
  <div>
    <div class="d-flex justify-space-between align-center mb-6 flex-wrap ga-3">
      <div>
        <h1 class="text-h4 font-weight-bold">Users</h1>
        <p class="text-medium-emphasis">Administrare utilizatori și roluri</p>
      </div>

      <v-btn color="primary" variant="flat" @click="reloadUsers" :loading="store.loading">
        Reîncarcă
      </v-btn>
    </div>

    <v-alert
      v-if="store.error"
      type="error"
      variant="tonal"
      class="mb-4"
    >
      {{ store.error }}
    </v-alert>

    <v-card elevation="2" rounded="xl">
      <v-card-text>
        <div v-if="store.loading" class="d-flex justify-center py-10">
          <v-progress-circular indeterminate />
        </div>

        <v-table v-else>
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Nume</th>
              <th>Rol curent</th>
              <th>Schimbă rol</th>
              <th>Creat la</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="user in store.users" :key="user.id">
              <td class="text-caption">{{ user.id }}</td>
              <td>{{ user.email || '-' }}</td>
              <td>{{ user.full_name || '-' }}</td>
              <td>
                <v-chip
                  :color="user.role === 'admin' ? 'deep-purple' : 'grey-darken-1'"
                  size="small"
                  variant="flat"
                >
                  {{ user.role }}
                </v-chip>
              </td>
              <td style="min-width: 170px;">
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

            <tr v-if="!store.users.length">
              <td colspan="6" class="text-center py-6 text-medium-emphasis">
                Nu există utilizatori.
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAdminUsersStore } from '@/stores/adminUsers'

const store = useAdminUsersStore()

const roleOptions = [
  { label: 'Customer', value: 'customer' },
  { label: 'Admin', value: 'admin' },
]

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