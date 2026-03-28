import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

function getAuthHeaders() {
  const token = localStorage.getItem('token')

  if (!token) {
    throw new Error('Not authenticated')
  }

  return {
    Authorization: `Bearer ${token}`,
  }
}

export async function createPaymentIntent(orderId) {
  const headers = getAuthHeaders()

  const { data } = await api.post('/payments/create-intent', { orderId }, { headers })

  return data
}

export async function confirmOrderPayment(orderId) {
  const headers = getAuthHeaders()

  const { data } = await api.post('/payments/confirm', { orderId }, { headers })

  return data
}