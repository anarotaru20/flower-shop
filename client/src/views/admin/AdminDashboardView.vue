<template>
  <div class="dashboard">
    <h1 class="text-h4 font-weight-bold mb-6">Dashboard</h1>

    <v-alert v-if="store.error" type="error" variant="tonal" class="mb-4">
      {{ store.error }}
    </v-alert>

    <v-row class="mb-4">
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
      <v-card-title class="font-weight-bold table-text">Comenzi recente</v-card-title>

      <v-card-text>
        <v-progress-circular v-if="store.loading" indeterminate />

        <v-table v-else class="mt-2">
          <thead>
            <tr>
              <th class="text-left font-weight-bold">Client</th>
              <th class="text-center font-weight-bold">Status</th>
              <th class="text-right font-weight-bold">Total</th>
              <th class="text-right font-weight-bold">Data</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in store.stats?.recentOrders || []" :key="order.id">
              <td>{{ order.customer_name || '-' }}</td>
              <td class="text-center">
                <span class="order-status-badge" :class="`status-${order.status}`">
                  {{ formatOrderStatus(order.status) }}
                </span>
              </td>
              <td class="text-right">{{ formatPrice(order.total) }}</td>
              <td class="text-right">{{ formatDate(order.created_at) }}</td>
            </tr>
            <tr v-if="!store.stats?.recentOrders?.length && !store.loading">
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

const store = useAdminDashboardStore()

const orderStatusMap = {
  pending: 'În procesare',
  confirmed: 'Confirmată',
  paid: 'Plătită',
  delivered: 'Livrată',
  cancelled: 'Anulată',
}

function formatOrderStatus(status) {
  return orderStatusMap[status] || status || '-'
}

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
  padding: 8px;
}

.stat-card {
  border-radius: 20px;
  transition: all 0.25s ease;
  border: 1px solid #f1e6e1;
  box-shadow: 0 10px 24px rgba(76, 58, 50, 0.08) !important;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 34px rgba(76, 58, 50, 0.12) !important;
}

.stat-card :deep(.v-card-text) {
  position: relative;
  padding: 22px 20px;
}

.stat-card :deep(.v-card-text)::before {
  content: '';
  display: block;
  width: 52px;
  height: 8px;
  border-radius: 999px;
  margin-bottom: 14px;
}

.v-col:nth-child(1) .stat-card {
  background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
}

.v-col:nth-child(1) .stat-card :deep(.v-card-text)::before {
  background: linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%);
}

.v-col:nth-child(2) .stat-card {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
}

.v-col:nth-child(2) .stat-card :deep(.v-card-text)::before {
  background: linear-gradient(90deg, #2563eb 0%, #60a5fa 100%);
}

.v-col:nth-child(3) .stat-card {
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
}

.v-col:nth-child(3) .stat-card :deep(.v-card-text)::before {
  background: linear-gradient(90deg, #10b981 0%, #34d399 100%);
}

.stat-title {
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 8px;
  font-weight: 600;
}

.stat-value {
  font-size: 34px;
  font-weight: 800;
  color: #1f2937;
  line-height: 1.1;
}

.recent-card {
  border-radius: 24px;
  border: 1px solid #f1e6e1;
  box-shadow: 0 12px 30px rgba(76, 58, 50, 0.08) !important;
  overflow: hidden;
}

.table-text {
  margin-top: 15px;
  margin-left: 10px;
  font-size: 30px;
  color: #1f2937;
}

:deep(.v-table) {
  background: transparent;
}

:deep(.v-table__wrapper) {
  overflow-x: auto;
}

:deep(.v-table thead th) {
  font-size: 14px;
  font-weight: 800 !important;
  color: #374151;
  white-space: nowrap;
}

:deep(.v-table tbody td) {
  padding-top: 16px !important;
  padding-bottom: 16px !important;
  font-size: 14px;
  color: #111827;
  white-space: nowrap;
}

:deep(.v-table tbody tr) {
  transition: background 0.2s ease;
}

:deep(.v-table tbody tr:hover) {
  background: #fcfcfc;
}

.order-status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 116px;
  padding: 7px 14px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
  border: 1px solid transparent;
  white-space: nowrap;
}

.order-status-badge.status-delivered {
  background: #dcfce7;
  color: #15803d;
  border-color: #86efac;
}

.order-status-badge.status-paid {
  background: #dbeafe;
  color: #1d4ed8;
  border-color: #93c5fd;
}

.order-status-badge.status-pending {
  background: #fef3c7;
  color: #b45309;
  border-color: #fcd34d;
}

.order-status-badge.status-cancelled {
  background: #fee2e2;
  color: #b91c1c;
  border-color: #fca5a5;
}

.order-status-badge.status-confirmed {
  background: #dcfce7;
  color: #15803d;
  border-color: #86efac;
}

@media (max-width: 960px) {
  .dashboard {
    padding: 4px;
  }

  .stat-card :deep(.v-card-text) {
    padding: 18px 16px;
  }

  .stat-value {
    font-size: 28px;
  }

  .table-text {
    margin-top: 10px;
    margin-left: 4px;
    font-size: 24px;
  }

  :deep(.v-table thead th),
  :deep(.v-table tbody td) {
    font-size: 13px;
  }

  .order-status-badge {
    min-width: 104px;
    padding: 6px 12px;
    font-size: 11px;
  }
}

@media (max-width: 600px) {
  .dashboard {
    padding: 0;
  }

  .stat-card {
    border-radius: 18px;
  }

  .stat-card :deep(.v-card-text) {
    padding: 16px 14px;
  }

  .stat-title {
    font-size: 13px;
  }

  .stat-value {
    font-size: 24px;
  }

  .recent-card {
    border-radius: 18px;
  }

  .table-text {
    font-size: 22px;
    margin-top: 8px;
    margin-left: 0;
  }

  :deep(.v-table thead th),
  :deep(.v-table tbody td) {
    font-size: 12px;
  }

  :deep(.v-table tbody td) {
    padding-top: 14px !important;
    padding-bottom: 14px !important;
  }

  .order-status-badge {
    min-width: 96px;
    padding: 5px 10px;
    font-size: 10px;
  }
}
</style>
