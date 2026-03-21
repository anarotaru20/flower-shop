import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

export async function getProducts(params = {}) {
  const { data } = await api.get('/products', { params })
  return data
}

export async function getProductBySlug(slug) {
  const { data } = await api.get(`/products/${slug}`)
  return data
}