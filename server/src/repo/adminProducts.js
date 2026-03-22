const db = require('../config/db')

async function getAllProducts() {
  const { data, error } = await db
    .from('products')
    .select(`
      *,
      categories (
        id,
        name
      )
    `)
    .order('created_at', { ascending: false })

  if (error) throw error

  return data || []
}

async function createProduct(payload) {
  const { data, error } = await db
    .from('products')
    .insert([payload])
    .select()
    .single()

  if (error) throw error

  return data
}

async function updateProduct(id, payload) {
  const { data, error } = await db
    .from('products')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  return data
}

async function deleteProduct(id) {
  const { error } = await db
    .from('products')
    .delete()
    .eq('id', id)

  if (error) throw error

  return true
}

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
}