const db = require('../config/db')

async function isAdmin(req, res, next) {
  try {
    const user = req.user

    if (!user) {
      return res.status(401).json({ message: 'Neautorizat' })
    }

    const { data, error } = await db
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (error) throw error

    if (!data || data.role !== 'admin') {
      return res.status(403).json({ message: 'Acces interzis' })
    }

    next()
  } catch (error) {
    return res.status(500).json({
      message: 'Eroare la verificarea rolului de admin',
      error: error.message,
    })
  }
}

module.exports = isAdmin