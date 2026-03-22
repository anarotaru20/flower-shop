const express = require('express')
const {
  getUsers,
  getUserById,
  updateUserRole,
} = require('../controllers/adminUsers')
const auth = require('../middleware/auth')
const isAdmin = require('../middleware/isAdmin')

const router = express.Router()

router.get('/', auth, isAdmin, getUsers)
router.get('/:id', auth, isAdmin, getUserById)
router.patch('/:id/role', auth, isAdmin, updateUserRole)

module.exports = router