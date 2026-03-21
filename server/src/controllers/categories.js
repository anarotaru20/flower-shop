const categoryRepo = require("../repo/categories");

async function getCategories(req, res, next) {
  try {
    const categories = await categoryRepo.getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCategories,
};