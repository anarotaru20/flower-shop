import { defineStore } from 'pinia'
import { getAdminOrders, getAdminOrderById, updateAdminOrderStatus } from '@/services/adminOrders'

export const useAdminOrdersStore = defineStore('adminOrders', {
  state: () => ({
    orders: [],
    selectedOrder: null,
    loading: false,
    detailsLoading: false,
    error: null,
  }),

  actions: {
    async fetchOrders() {
      this.loading = true
      this.error = null

      try {
        const data = await getAdminOrders()
        this.orders = Array.isArray(data) ? data : []
      } catch (err) {
        this.error = err.response?.data?.message || err.message || 'Eroare la preluarea comenzilor'
        this.orders = []
      } finally {
        this.loading = false
      }
    },

    async fetchOrderById(id) {
      this.detailsLoading = true
      this.error = null

      try {
        const data = await getAdminOrderById(id)
        this.selectedOrder = data || null
      } catch (err) {
        this.error = err.response?.data?.message || err.message || 'Eroare la preluarea comenzii'
        this.selectedOrder = null
      } finally {
        this.detailsLoading = false
      }
    },
    async updateOrderStatus(id, status) {
      this.loading = true
      this.error = null

      try {
        await updateAdminOrderStatus(id, { status })
        await this.fetchOrders()

        if (this.selectedOrder?.id === id) {
          await this.fetchOrderById(id)
        }
      } catch (err) {
        this.error =
          err.response?.data?.message || err.message || 'Eroare la actualizarea statusului comenzii'
      } finally {
        this.loading = false
      }
    },

    clearSelectedOrder() {
      this.selectedOrder = null
    },
  },
})
