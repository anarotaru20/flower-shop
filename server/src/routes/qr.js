const express = require('express')
const router = express.Router()
const { createQr, getQr } = require('../controllers/qr')
const authMiddleware = require('../middleware/auth')

router.post('/', authMiddleware, createQr)
router.get('/:token', getQr)

module.exports = router