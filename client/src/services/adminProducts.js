import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

function getAuthConfig() {
  const token = localStorage.getItem('token')

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
}

export async function getAdminProducts() {
  const { data } = await api.get('/admin/products', getAuthConfig())
  return data
}

export async function createAdminProduct(payload) {
  const { data } = await api.post('/admin/products', payload, getAuthConfig())
  return data
}

export async function updateAdminProduct(id, payload) {
  const { data } = await api.put(`/admin/products/${id}`, payload, getAuthConfig())
  return data
}

export async function deleteAdminProduct(id) {
  const { data } = await api.delete(`/admin/products/${id}`, getAuthConfig())
  return data
}