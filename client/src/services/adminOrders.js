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

export async function getAdminOrders() {
  const { data } = await api.get('/admin/orders', getAuthConfig())
  return data
}

export async function getAdminOrderById(id) {
  const { data } = await api.get(`/admin/orders/${id}`, getAuthConfig())
  return data
}

export async function updateAdminOrderStatus(id, payload) {
  const { data } = await api.put(`/admin/orders/${id}/status`, payload, getAuthConfig())
  return data
}