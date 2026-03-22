<template>
  <div class="reports-page">
    <div class="reports-header">
      <h1 class="text-h4 font-weight-bold">Rapoarte</h1>
      <p class="reports-subtitle">Evoluția comenzilor și a veniturilor pe luni</p>
    </div>

    <v-alert
      v-if="store.error"
      type="error"
      variant="tonal"
      class="mb-4"
    >
      {{ store.error }}
    </v-alert>

    <v-row>
      <v-col cols="12" md="6">
        <v-card class="report-card" elevation="2">
          <v-card-title class="font-weight-bold">
            Comenzi pe luni
          </v-card-title>

          <v-card-text>
            <div class="chart-box">
              <LineChart
                :labels="store.ordersByMonth.labels"
                :data="store.ordersByMonth.data"
                label="Comenzi"
              />
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="report-card" elevation="2">
          <v-card-title class="font-weight-bold">
            Venit pe luni
          </v-card-title>

          <v-card-text>
            <div class="chart-box">
              <LineChart
                :labels="store.revenueByMonth.labels"
                :data="store.revenueByMonth.data"
                label="Venit (lei)"
              />
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAdminDashboardStore } from '@/stores/adminDashboard'
import LineChart from '@/components/admin/LineChart.vue'

const store = useAdminDashboardStore()

onMounted(() => {
  store.fetchCharts()
})
</script>

<style scoped>
.reports-page {
  max-width: 1400px;
  margin: 0 auto;
}

.reports-header {
  margin-bottom: 24px;
}

.reports-subtitle {
  margin-top: 8px;
  color: #6b7280;
}

.report-card {
  border-radius: 20px;
}

.chart-box {
  height: 320px;
}
</style>