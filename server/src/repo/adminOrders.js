const db = require('../config/db')

async function getAllOrders() {
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
      user_id,
      customer_name,
      phone,
      shipping_address,
      payment_method,
      status,
      payment_status,
      subtotal,
      tax_amount,
      total,
      invoice_number,
      paid_at,
      created_at,
      order_items (
        id,
        order_id,
        product_id,
        product_name,
        quantity,
        price,
        created_at,
        products (
          id,
          name,
          slug,
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