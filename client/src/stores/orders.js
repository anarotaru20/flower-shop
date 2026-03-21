import { defineStore } from 'pinia'
import { createOrder, getOrders, cancelOrder } from '@/services/orders'

export const useOrdersStore = defineStore('orders', {
  state: () => ({
    orders: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchOrders() {
      this.loading = true
      this.error = null

      try {
        const data = await getOrders()
        this.orders = Array.isArray(data) ? data : []
      } catch (err) {
        this.error = err.response?.data?.message || err.message || 'Eroare la preluarea comenzilor'
        this.orders = []
      } finally {
        this.loading = false
      }
    },

    async addOrder(payload) {
      this.loading = true
      this.error = null

      try {
        const data = await createOrder(payload)
        this.orders.unshift(data)
        return data
      } catch (err) {
        this.error = err.response?.data?.message || err.message || 'Eroare la plasarea comenzii'
        throw err
      } finally {
        this.loading = false
      }
    },

    async cancelUserOrder(id) {
      this.loading = true
      this.error = null

      try {
        const data = await cancelOrder(id)
        const index = this.orders.findIndex((order) => order.id === id)

        if (index !== -1) {
          this.orders[index] = {
            ...this.orders[index],
            ...data,
          }
        }

        return data
      } catch (err) {
        this.error = err.response?.data?.message || err.message || 'Eroare la anularea comenzii'
        throw err
      } finally {
        this.loading = false
      }
    },
  },
})
