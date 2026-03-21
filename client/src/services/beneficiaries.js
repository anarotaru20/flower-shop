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

export async function getBeneficiaries() {
  const { data } = await api.get('/beneficiaries', getAuthConfig())
  return data
}

export async function createBeneficiary(payload) {
  const { data } = await api.post('/beneficiaries', payload, getAuthConfig())
  return data
}

export async function updateBeneficiary(id, payload) {
  const { data } = await api.put(`/beneficiaries/${id}`, payload, getAuthConfig())
  return data
}

export async function deleteBeneficiary(id) {
  const { data } = await api.delete(`/beneficiaries/${id}`, getAuthConfig())
  return data
}