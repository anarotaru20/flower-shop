const QRCode = require('qrcode')
const { createQrCode, getQrByToken } = require('../repo/qr')

async function createQr(req, res) {
  try {
    const { order_id, product_id, message } = req.body
    const user_id = req.user.id

    const qr = await createQrCode({
      user_id,
      order_id,
      product_id,
      message
    })

    const qrValue = `${process.env.CLIENT_URL}/qr/${qr.token}`
    const qrImage = await QRCode.toDataURL(qrValue)

    res.status(201).json({
      ...qr,
      qr_url: qrValue,
      qr_image: qrImage
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

async function getQr(req, res) {
  try {
    const { token } = req.params
    const qr = await getQrByToken(token)

    res.json(qr)
  } catch (err) {
    res.status(404).json({ message: 'QR not found' })
  }
}

module.exports = {
  createQr,
  getQr
}