const adminProductsRepo = require('../repo/adminProducts')

async function getAllProducts(req, res) {
  try {
    const products = await adminProductsRepo.getAllProducts()
    return res.status(200).json(products)
  } catch (error) {
    return res.status(500).json({
      message: 'Eroare la preluarea produselor',
      error: error.message,
    })
  }
}

async function createProduct(req, res) {
  try {
    const product = await adminProductsRepo.createProduct(req.body)
    return res.status(201).json(product)
  } catch (error) {
    return res.status(500).json({
      message: 'Eroare la crearea produsului',
      error: error.message,
    })
  }
}

async function updateProduct(req, res) {
  try {
    const { id } = req.params
    const product = await adminProductsRepo.updateProduct(id, req.body)
    return res.status(200).json(product)
  } catch (error) {
    return res.status(500).json({
      message: 'Eroare la actualizarea produsului',
      error: error.message,
    })
  }
}

async function deleteProduct(req, res) {
  try {
    const { id } = req.params
    await adminProductsRepo.deleteProduct(id)
    return res.status(200).json({ message: 'Produs sters cu succes' })
  } catch (error) {
    return res.status(500).json({
      message: 'Eroare la stergerea produsului',
      error: error.message,
    })
  }
}

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
}