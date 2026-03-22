// import axios from 'axios'

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL
// })

// function getAuthConfig() {
//   const token = localStorage.getItem('token')

//   return {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   }
// }

// export async function getProfile() {
//   const { data } = await api.get('/profile', getAuthConfig())
//   return data
// }

// export async function updateProfile(payload) {
//   const { data } = await api.put('/profile', payload, getAuthConfig())
//   return data
// }

// export async function deleteProfile() {
//   const { data } = await api.delete('/profile', getAuthConfig())
//   return data
// }


import api from './api'

export async function getProfile() {
  const { data } = await api.get('/profile')
  return data
}

export async function updateProfile(payload) {
  const { data } = await api.put('/profile', payload)
  return data
}

export async function deleteProfile() {
  const { data } = await api.delete('/profile')
  return data
}