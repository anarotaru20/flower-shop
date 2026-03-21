const productRepo = require("../repo/products");

async function getProducts(req, res, next) {
  try {
    const { category } = req.query;
    const products = await productRepo.getAllProducts(category);
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
}

async function getProductBySlug(req, res, next) {
  try {
    const { slug } = req.params;

    const product = await productRepo.getProductBySlug(slug);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProducts,
  getProductBySlug,
};