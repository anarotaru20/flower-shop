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

export async function getAdminOverview() {
  const { data } = await api.get('/admin/dashboard/overview', getAuthConfig())
  return data
}

export async function getAdminOrdersByMonth(year) {
  const { data } = await api.get(
    `/admin/dashboard/orders-by-month?year=${year}`,
    getAuthConfig()
  )
  return data
}

export async function getAdminRevenueByMonth(year) {
  const { data } = await api.get(
    `/admin/dashboard/revenue-by-month?year=${year}`,
    getAuthConfig()
  )
  return data
}