import { defineStore } from 'pinia'
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent
} from '@/services/events'

export const useEventsStore = defineStore('events', {
  state: () => ({
    list: [],
    loading: false,
    saving: false,
    deleting: false,
    error: null,
  }),

  actions: {
    async fetchEvents() {
      this.loading = true
      this.error = null

      try {
        const data = await getEvents()
        this.list = Array.isArray(data) ? data : []
      } catch (err) {
        this.error = err.response?.data?.message || 'Eroare la preluarea evenimentelor'
        this.list = []
      } finally {
        this.loading = false
      }
    },

    async addEvent(payload) {
      this.saving = true
      this.error = null

      try {
        const data = await createEvent(payload)
        this.list.unshift(data)
        return data
      } catch (err) {
        this.error = err.response?.data?.message || 'Eroare la adaugare eveniment'
        throw err
      } finally {
        this.saving = false
      }
    },

    async editEvent(id, payload) {
      this.saving = true
      this.error = null

      try {
        const data = await updateEvent(id, payload)

        const index = this.list.findIndex(event => event.id === id)
        if (index !== -1) {
          this.list[index] = data
        }

        return data
      } catch (err) {
        this.error = err.response?.data?.message || 'Eroare la actualizare eveniment'
        throw err
      } finally {
        this.saving = false
      }
    },

    async removeEvent(id) {
      this.deleting = true
      this.error = null

      try {
        await deleteEvent(id)
        this.list = this.list.filter(event => event.id !== id)
      } catch (err) {
        this.error = err.response?.data?.message || 'Eroare la stergere eveniment'
        throw err
      } finally {
        this.deleting = false
      }
    },
  },
})