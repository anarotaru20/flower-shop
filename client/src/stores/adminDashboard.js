import { defineStore } from 'pinia'
import {
  getAdminOverview,
  getAdminOrdersByMonth,
  getAdminRevenueByMonth,
} from '@/services/adminDashboard'

export const useAdminDashboardStore = defineStore('adminDashboard', {
  state: () => ({
    stats: {
      totalProducts: 0,
      totalOrders: 0,
      totalRevenue: 0,
      recentOrders: [],
    },
    ordersByMonth: {
      year: new Date().getFullYear(),
      labels: [],
      data: [],
    },
    revenueByMonth: {
      year: new Date().getFullYear(),
      labels: [],
      data: [],
    },
    loading: false,
    error: null,
  }),

  actions: {
    async fetchOverview() {
      this.loading = true
      this.error = null

      try {
        const overview = await getAdminOverview()

        this.stats = {
          totalProducts: overview?.totalProducts || 0,
          totalOrders: overview?.totalOrders || 0,
          totalRevenue: Number(overview?.totalRevenue || 0),
          recentOrders: overview?.recentOrders || [],
        }
      } catch (err) {
        this.error =
          err.response?.data?.message || err.message || 'Eroare la preluarea dashboard-ului'
      } finally {
        this.loading = false
      }
    },

    async fetchCharts(year = new Date().getFullYear()) {
      try {
        const [ordersChart, revenueChart] = await Promise.all([
          getAdminOrdersByMonth(year),
          getAdminRevenueByMonth(year),
        ])

        this.ordersByMonth = ordersChart || {
          year,
          labels: [],
          data: [],
        }

        this.revenueByMonth = revenueChart || {
          year,
          labels: [],
          data: [],
        }
      } catch (err) {
        this.error =
          err.response?.data?.message || err.message || 'Eroare la preluarea graficelor'
      }
    },

    async initDashboard(year = new Date().getFullYear()) {
      await this.fetchOverview()
      await this.fetchCharts(year)
    },
  },
})