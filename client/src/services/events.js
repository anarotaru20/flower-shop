import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

function getAuthConfig() {
  const token = localStorage.getItem('token')

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
}

export async function getEvents() {
  const { data } = await api.get('/events', getAuthConfig())
  return data
}

export async function createEvent(payload) {
  const { data } = await api.post('/events', payload, getAuthConfig())
  return data
}

export async function updateEvent(id, payload) {
  const { data } = await api.put(`/events/${id}`, payload, getAuthConfig())
  return data
}

export async function deleteEvent(id) {
  const { data } = await api.delete(`/events/${id}`, getAuthConfig())
  return data
}