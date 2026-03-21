import axios from 'axios'
import { supabase } from '@/lib/supabase'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

async function getAuthHeaders() {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const token = session?.access_token

  if (!token) {
    throw new Error('Not authenticated')
  }

  return {
    Authorization: `Bearer ${token}`,
  }
}

export async function createOrder(payload) {
  const headers = await getAuthHeaders()
  const { data } = await api.post('/orders', payload, { headers })
  return data
}

export async function getOrders() {
  const headers = await getAuthHeaders()
  const { data } = await api.get('/orders', { headers })
  return data
}

export async function downloadInvoice(id) {
  const headers = await getAuthHeaders()

  const response = await api.get(`/orders/${id}/invoice`, {
    headers,
    responseType: 'blob',
  })

  return response.data
}

export async function cancelOrder(id) {
  const headers = await getAuthHeaders()
  const { data } = await api.put(`/orders/${id}/cancel`, {}, { headers })
  return data
}
