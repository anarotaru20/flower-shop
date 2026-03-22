const {
  getAllAdminUsers,
  getAdminUserById,
  updateAdminUserRole,
} = require('../repo/adminUsers')

async function getUsers(req, res) {
  try {
    const users = await getAllAdminUsers()

    return res.status(200).json({
      success: true,
      users,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Eroare la preluarea utilizatorilor',
    })
  }
}

async function getUserById(req, res) {
  try {
    const { id } = req.params

    const user = await getAdminUserById(id)

    return res.status(200).json({
      success: true,
      user,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Eroare la preluarea utilizatorului',
    })
  }
}

async function updateUserRole(req, res) {
  try {
    const { id } = req.params
    const { role } = req.body

    const allowedRoles = ['admin', 'customer']

    if (!role || !allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Rol invalid. Valorile permise sunt: admin, customer',
      })
    }

    const updatedUser = await updateAdminUserRole(id, role)

    return res.status(200).json({
      success: true,
      message: 'Rol actualizat cu succes',
      user: updatedUser,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Eroare la actualizarea rolului utilizatorului',
    })
  }
}

module.exports = {
  getUsers,
  getUserById,
  updateUserRole,
}