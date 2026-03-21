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

export async function createQr(payload) {
  const { data } = await api.post('/qr', payload, getAuthConfig())
  return data
}

export async function getQrByToken(token) {
  const { data } = await api.get(`/qr/${token}`)
  return data
}