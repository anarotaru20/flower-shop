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

export async function createPaymentIntent(orderId) {
  const headers = await getAuthHeaders()

  const { data } = await api.post('/payments/create-intent', { orderId }, { headers })

  return data
}

export async function confirmOrderPayment(orderId) {
  const headers = await getAuthHeaders()

  const { data } = await api.post('/payments/confirm', { orderId }, { headers })

  return data
}
