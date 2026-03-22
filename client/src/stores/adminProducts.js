import { defineStore } from 'pinia'
import {
  getAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
} from '@/services/adminProducts'

export const useAdminProductsStore = defineStore('adminProducts', {
  state: () => ({
    products: [],
    loading: false,
    error: null,
    selectedProduct: null,
  }),

  actions: {
    async fetchProducts() {
      this.loading = true
      this.error = null

      try {
        const data = await getAdminProducts()
        this.products = Array.isArray(data) ? data : []
      } catch (err) {
        this.error =
          err.response?.data?.message || err.message || 'Eroare la preluarea produselor'
        this.products = []
      } finally {
        this.loading = false
      }
    },

    async createProduct(payload) {
      this.loading = true
      this.error = null

      try {
        await createAdminProduct(payload)
        await this.fetchProducts()
      } catch (err) {
        this.error =
          err.response?.data?.message || err.message || 'Eroare la crearea produsului'
      } finally {
        this.loading = false
      }
    },

    async updateProduct(id, payload) {
      this.loading = true
      this.error = null

      try {
        await updateAdminProduct(id, payload)
        await this.fetchProducts()
      } catch (err) {
        this.error =
          err.response?.data?.message || err.message || 'Eroare la actualizarea produsului'
      } finally {
        this.loading = false
      }
    },

    async deleteProduct(id) {
      this.loading = true
      this.error = null

      try {
        await deleteAdminProduct(id)
        await this.fetchProducts()
      } catch (err) {
        this.error =
          err.response?.data?.message || err.message || 'Eroare la ștergerea produsului'
      } finally {
        this.loading = false
      }
    },

    setSelectedProduct(product) {
      this.selectedProduct = product
    },

    clearSelectedProduct() {
      this.selectedProduct = null
    },
  },
})