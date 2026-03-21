const { randomUUID } = require('crypto')
const supabase = require('../config/db')

async function createQrCode({ user_id, order_id, product_id, message }) {
  const token = randomUUID()

  const { data, error } = await supabase
    .from('qr_codes')
    .insert([
      {
        token,
        user_id,
        order_id,
        product_id,
        message
      }
    ])
    .select()
    .single()

  if (error) throw error

  return data
}

async function getQrByToken(token) {
  const { data, error } = await supabase
    .from('qr_codes')
    .select(`
      token,
      message,
      products (
        name,
        image_url,
        care_instructions
      )
    `)
    .eq('token', token)
    .eq('is_active', true)
    .single()

  if (error) throw error

  return data
}

module.exports = {
  createQrCode,
  getQrByToken
}