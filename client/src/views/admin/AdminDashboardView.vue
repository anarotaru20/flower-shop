<template>
  <div class="dashboard">
    <h1 class="text-h4 font-weight-bold mb-6">Dashboard</h1>

    <v-alert
      v-if="store.error"
      type="error"
      variant="tonal"
      class="mb-4"
    >
      {{ store.error }}
    </v-alert>

    <v-row class="mb-2">
      <v-col cols="12" md="4">
        <v-card class="stat-card" elevation="2">
          <v-card-text>
            <div class="stat-title">Total produse</div>
            <div class="stat-value">
              {{ store.stats?.totalProducts ?? 0 }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="stat-card" elevation="2">
          <v-card-text>
            <div class="stat-title">Total comenzi</div>
            <div class="stat-value">
              {{ store.stats?.totalOrders ?? 0 }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="stat-card" elevation="2">
          <v-card-text>
            <div class="stat-title">Venit total</div>
            <div class="stat-value">
              {{ formatPrice(store.stats?.totalRevenue ?? 0) }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-card class="recent-card" elevation="2">
      <v-card-title class="font-weight-bold">Comenzi recente</v-card-title>

      <v-card-text>
        <v-progress-circular
          v-if="store.loading"
          indeterminate
        />

        <v-table v-else class="mt-2">
          <thead>
            <tr>
              <th class="text-left">Client</th>
              <th class="text-left">Status</th>
              <th class="text-left">Total</th>
              <th class="text-left">Data</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in store.stats?.recentOrders || []" :key="order.id">
              <td>{{ order.customer_name || '-' }}</td>
              <td>
                <v-chip
                  :color="order.status === 'completed' ? 'green' : order.status === 'pending' ? 'orange' : 'grey'"
                  size="small"
                  variant="flat"
                >
                  {{ order.status }}
                </v-chip>
              </td>
              <td>{{ formatPrice(order.total) }}</td>
              <td>{{ formatDate(order.created_at) }}</td>
            </tr>
            <tr v-if="!(store.stats?.recentOrders?.length) && !store.loading">
              <td colspan="4" class="text-center py-4">Nu există comenzi recente.</td>
            </tr>
          </tbody>
        </v-table>
        
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAdminDashboardStore } from '@/stores/adminDashboard'
import LineChart from '@/components/admin/LineChart.vue'

const store = useAdminDashboardStore()

function formatPrice(value) {
  return `${Number(value || 0).toFixed(2)} lei`
}

function formatDate(value) {
  if (!value) return '-'
  return new Date(value).toLocaleString('ro-RO')
}

onMounted(() => {
  store.initDashboard()
})
</script>

<style scoped>
.dashboard {
  max-width: 1400px;
  margin: 0 auto;
}

.stat-card {
  border-radius: 20px;
  transition: all 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
}

.stat-title {
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
}

.recent-card {
  border-radius: 20px;
}
</style>