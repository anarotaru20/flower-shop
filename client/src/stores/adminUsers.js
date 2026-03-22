import { defineStore } from 'pinia'
import {
  getAdminUsers,
  getAdminUserById,
  updateAdminUserRole,
} from '@/services/adminUsers'

export const useAdminUsersStore = defineStore('adminUsers', {
  state: () => ({
    users: [],
    selectedUser: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchUsers() {
      this.loading = true
      this.error = null

      try {
        const data = await getAdminUsers()
        this.users = Array.isArray(data.users) ? data.users : []
      } catch (err) {
        this.error =
          err.response?.data?.message ||
          err.message ||
          'Eroare la preluarea utilizatorilor'
        this.users = []
      } finally {
        this.loading = false
      }
    },

    async fetchUserById(id) {
      this.loading = true
      this.error = null

      try {
        const data = await getAdminUserById(id)
        this.selectedUser = data.user || null
      } catch (err) {
        this.error =
          err.response?.data?.message ||
          err.message ||
          'Eroare la preluarea utilizatorului'
        this.selectedUser = null
      } finally {
        this.loading = false
      }
    },

    async changeUserRole(id, role) {
      this.loading = true
      this.error = null

      try {
        const data = await updateAdminUserRole(id, role)
        const updatedUser = data.user

        const index = this.users.findIndex((user) => user.id === id)
        if (index !== -1) {
          this.users[index] = updatedUser
        }

        if (this.selectedUser?.id === id) {
          this.selectedUser = updatedUser
        }
      } catch (err) {
        this.error =
          err.response?.data?.message ||
          err.message ||
          'Eroare la actualizarea rolului utilizatorului'
      } finally {
        this.loading = false
      }
    },
  },
})