import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

export async function registerUser(payload) {
  const { data } = await api.post('/register', payload)
  return data
}

export async function loginUser(payload) {
  const { data } = await api.post('/login', payload)
  return data
}

export async function forgotPassword(payload) {
  const { data } = await api.post('/forgot-password', payload)
  return data
}

export async function resetPassword(payload) {
  const { data } = await api.post('/reset-password', payload)
  return data
}
