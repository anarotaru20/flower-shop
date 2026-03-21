import { defineStore } from 'pinia'
import { getProfile, updateProfile, deleteProfile } from '@/services/profile'

export const useProfileStore = defineStore('profile', {
  state: () => ({
    profile: {
      id: '',
      email: '',
      username: '',
      first_name: '',
      last_name: '',
      birth_date: '',
      address: '',
      role: '',
      created_at: '',
    },
    loading: false,
    saving: false,
    deleting: false,
    error: null,
  }),

  getters: {
    fullName: (state) =>
      [state.profile.first_name, state.profile.last_name].filter(Boolean).join(' '),
  },

  actions: {
    async fetchProfile() {
      this.loading = true
      this.error = null

      try {
        const data = await getProfile()
        this.profile = {
          id: data?.id || '',
          email: data?.email || '',
          username: data?.username || '',
          first_name: data?.first_name || '',
          last_name: data?.last_name || '',
          birth_date: data?.birth_date || '',
          address: data?.address || '',
          role: data?.role || '',
          created_at: data?.created_at || '',
        }
      } catch (err) {
        this.error = err.response?.data?.message || err.message || 'Eroare la preluarea profilului'
      } finally {
        this.loading = false
      }
    },

    async saveProfile(payload) {
      this.saving = true
      this.error = null

      try {
        const data = await updateProfile(payload)
        this.profile = {
          id: data?.id || '',
          email: data?.email || '',
          username: data?.username || '',
          first_name: data?.first_name || '',
          last_name: data?.last_name || '',
          birth_date: data?.birth_date || '',
          address: data?.address || '',
          role: data?.role || '',
          created_at: data?.created_at || '',
        }
        return data
      } catch (err) {
        this.error = err.response?.data?.message || err.message || 'Eroare la actualizarea profilului'
        throw err
      } finally {
        this.saving = false
      }
    },

    async removeProfile() {
      this.deleting = true
      this.error = null

      try {
        return await deleteProfile()
      } catch (err) {
        this.error = err.response?.data?.message || err.message || 'Eroare la ștergerea contului'
        throw err
      } finally {
        this.deleting = false
      }
    },

    clearProfile() {
      this.profile = {
        id: '',
        email: '',
        username: '',
        first_name: '',
        last_name: '',
        birth_date: '',
        address: '',
        role: '',
        created_at: '',
      }
      this.error = null
    },
  },
})