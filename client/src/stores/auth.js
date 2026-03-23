import { defineStore } from 'pinia'
import { registerUser, loginUser, forgotPassword, resetPassword } from '@/services/auth'
import { getProfile } from '@/services/profile'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,
    successMessage: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    clearMessages() {
      this.error = null
      this.successMessage = null
    },

    async fetchProfile() {
      try {
        const data = await getProfile()
        this.user = data ?? null
        return data
      } catch (err) {
        this.user = null
        throw err
      }
    },

    logout() {
      this.user = null
      this.token = null
      this.error = null
      this.successMessage = null
      localStorage.removeItem('token')
    },

    async register(payload) {
      this.loading = true
      this.error = null
      this.successMessage = null

      try {
        const data = await registerUser(payload)

        const accessToken = data?.session?.access_token ?? null
        this.token = accessToken

        if (this.token) {
          localStorage.setItem('token', this.token)
          await this.fetchProfile()
        } else {
          this.user = null
          localStorage.removeItem('token')
        }

        this.successMessage = null
        return data
      } catch (err) {
        this.error = err.response?.data?.message || 'A aparut o eroare la inregistrare.'
        throw err
      } finally {
        this.loading = false
      }
    },

    async login(payload) {
      this.loading = true
      this.error = null
      this.successMessage = null

      try {
        const data = await loginUser(payload)

        const accessToken = data?.session?.access_token ?? null
        this.token = accessToken

        if (this.token) {
          localStorage.setItem('token', this.token)
          await this.fetchProfile()
        } else {
          this.user = null
          localStorage.removeItem('token')
        }

        this.successMessage = data?.message || 'Autentificare reusita.'
        return data
      } catch (err) {
        this.error = err.response?.data?.message || 'Email sau parola incorecte.'
        throw err
      } finally {
        this.loading = false
      }
    },

    async sendForgotPassword(payload) {
      this.loading = true
      this.error = null
      this.successMessage = null

      try {
        const data = await forgotPassword(payload)
        this.successMessage = data?.message || 'Emailul pentru resetare a fost trimis.'
        return data
      } catch (err) {
        this.error = err.response?.data?.message || 'Nu s-a putut trimite emailul de resetare.'
        throw err
      } finally {
        this.loading = false
      }
    },

    async resetUserPassword(payload) {
      this.loading = true
      this.error = null
      this.successMessage = null

      try {
        const data = await resetPassword(payload)
        this.successMessage = data?.message || 'Parola a fost resetata cu succes.'
        return data
      } catch (err) {
        this.error = err.response?.data?.message || 'Nu s-a putut reseta parola.'
        throw err
      } finally {
        this.loading = false
      }
    },
  },
})