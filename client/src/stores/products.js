import { defineStore } from 'pinia'
import { getProducts, getProductBySlug } from '@/services/products'

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [],
    product: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchProducts(params = {}) {
      this.loading = true
      this.error = null

      try {
        const data = await getProducts(params)
        this.products = Array.isArray(data) ? data : data?.data || []
      } catch (err) {
        this.error = err.response?.data?.message || 'Eroare la produse'
        this.products = []
      } finally {
        this.loading = false
      }
    },

    async fetchProductBySlug(slug) {
      this.loading = true
      this.error = null

      try {
        const data = await getProductBySlug(slug)
        this.product = data
      } catch (err) {
        this.error = err.response?.data?.message || 'Eroare la produs'
        this.product = null
      } finally {
        this.loading = false
      }
    },
  },
})