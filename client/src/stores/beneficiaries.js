import { defineStore } from 'pinia'
import {
  getBeneficiaries,
  createBeneficiary,
  updateBeneficiary,
  deleteBeneficiary
} from '@/services/beneficiaries'

export const useBeneficiariesStore = defineStore('beneficiaries', {
  state: () => ({
    list: [],
    loading: false,
    saving: false,
    deleting: false,
    error: null,
  }),

  actions: {
    async fetchBeneficiaries() {
      this.loading = true
      this.error = null

      try {
        const data = await getBeneficiaries()
        this.list = Array.isArray(data) ? data : []
      } catch (err) {
        this.error = err.response?.data?.message || 'Eroare la preluarea beneficiarilor'
        this.list = []
      } finally {
        this.loading = false
      }
    },

    async addBeneficiary(payload) {
      this.saving = true
      this.error = null

      try {
        const data = await createBeneficiary(payload)
        this.list.unshift(data)
        return data
      } catch (err) {
        this.error = err.response?.data?.message || 'Eroare la adaugare beneficiar'
        throw err
      } finally {
        this.saving = false
      }
    },

    async editBeneficiary(id, payload) {
      this.saving = true
      this.error = null

      try {
        const data = await updateBeneficiary(id, payload)

        const index = this.list.findIndex(b => b.id === id)
        if (index !== -1) {
          this.list[index] = data
        }

        return data
      } catch (err) {
        this.error = err.response?.data?.message || 'Eroare la actualizare beneficiar'
        throw err
      } finally {
        this.saving = false
      }
    },

    async removeBeneficiary(id) {
      this.deleting = true
      this.error = null

      try {
        await deleteBeneficiary(id)
        this.list = this.list.filter(b => b.id !== id)
      } catch (err) {
        this.error = err.response?.data?.message || 'Eroare la stergere beneficiar'
        throw err
      } finally {
        this.deleting = false
      }
    },
  },
})