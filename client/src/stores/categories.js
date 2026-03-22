import { defineStore } from 'pinia'
import { getCategories } from '@/services/categories'

export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    categories: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchCategories() {
      this.loading = true
      this.error = null

      try {
        const data = await getCategories()
        this.categories = Array.isArray(data) ? data : []
      } catch (err) {
        this.error = err.response?.data?.message || err.message || 'Eroare la preluarea categoriilor'
        this.categories = []
      } finally {
        this.loading = false
      }
    },
  },
})