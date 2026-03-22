const db = require('../config/db')

async function getAllOrders() {
  const { data, error } = await db
    .from('orders')
    .select(`
      id,
      customer_name,
      phone,
      shipping_address,
      status,
      total,
      created_at
    `)
    .order('created_at', { ascending: false })

  if (error) throw error

  return data || []
}

async function getOrderById(id) {
  const { data, error } = await db
    .from('orders')
    .select(`
      id,
      customer_name,
      phone,
      shipping_address,
      payment_method,
      status,
      total,
      created_at,
      order_items (
        quantity,
        price,
        products (
          id,
          name,
          price,
          image_url
        )
      )
    `)
    .eq('id', id)
    .single()

  if (error) throw error

  return data
}

async function updateOrderStatus(id, status) {
  const { data, error } = await db
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  return data
}

module.exports = {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
}