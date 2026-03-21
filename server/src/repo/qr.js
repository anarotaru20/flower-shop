const { randomUUID } = require('crypto')
const supabase = require('../config/db')

async function createQrCode({ user_id, order_id, message }) {
  const existingQr = await getQrCodeByOrderId(order_id)

  if (existingQr) {
    return existingQr
  }

  const token = randomUUID()

  const { data, error } = await supabase
    .from('qr_codes')
    .insert([
      {
        token,
        user_id,
        order_id,
        message,
      },
    ])
    .select()
    .single()

  if (error) throw error

  return data
}

async function getQrCodeByOrderId(order_id) {
  const { data, error } = await supabase
    .from('qr_codes')
    .select('*')
    .eq('order_id', order_id)
    .eq('is_active', true)
    .maybeSingle()

  if (error) throw error

  return data
}

async function getQrByToken(token) {
  const { data: qrData, error: qrError } = await supabase
    .from('qr_codes')
    .select(`
      token,
      message,
      order_id
    `)
    .eq('token', token)
    .eq('is_active', true)
    .single()

  if (qrError) throw qrError

  const { data: orderItems, error: orderItemsError } = await supabase
    .from('order_items')
    .select(`
      product_id,
      products (
        id,
        name,
        image_url,
        care_instructions,
        categories (
          slug,
          name
        )
      )
    `)
    .eq('order_id', qrData.order_id)

  if (orderItemsError) throw orderItemsError

  const eligibleProducts = (orderItems || [])
    .map((item) => item.products)
    .filter(
      (product) =>
        product &&
        (
          product.categories?.slug === 'plante-interior' ||
          product.categories?.slug === 'plante-propagare' ||
          product.categories?.slug === 'buchete-flori' ||
          product.categories?.slug === 'aranjamente-florale'
        )
    )

  return {
    token: qrData.token,
    message: qrData.message,
    products: eligibleProducts,
  }
}

module.exports = {
  createQrCode,
  getQrByToken,
  getQrCodeByOrderId,
}