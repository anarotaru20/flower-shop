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

export async function getAdminUsers() {
  const { data } = await api.get('/admin/users', getAuthConfig())
  return data
}

export async function getAdminUserById(id) {
  const { data } = await api.get(`/admin/users/${id}`, getAuthConfig())
  return data
}

export async function updateAdminUserRole(id, role) {
  const { data } = await api.patch(`/admin/users/${id}/role`, { role }, getAuthConfig())
  return data
}