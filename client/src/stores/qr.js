import { defineStore } from 'pinia'
import { createQr, getQrByToken } from '@/services/qr'

export const useQrStore = defineStore('qr', {
  state: () => ({
    qr: null,
    loading: false,
    error: null,
  }),

  actions: {
    async createQr(payload) {
      this.loading = true
      this.error = null

      try {
        const data = await createQr(payload)
        this.qr = data
        return data
      } catch (err) {
        this.error = err.response?.data?.message || err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    async fetchQrByToken(token) {
      this.loading = true
      this.error = null

      try {
        const data = await getQrByToken(token)
        this.qr = data
        return data
      } catch (err) {
        this.error = err.response?.data?.message || err.message
        this.qr = null
        throw err
      } finally {
        this.loading = false
      }
    },

    clearQr() {
      this.qr = null
      this.error = null
    }
  }
})