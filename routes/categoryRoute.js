const express = require("express");

const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validators/categoryValidator");

const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeImage,
} = require("../services/categoryService");

const subcategoriesRoute = require("./subCategoryRoute");
const authService = require("../services/authService");

const router = express.Router();

router.use("/:categoryId/subcategories", subcategoriesRoute);

router.route("/").get(getCategories).post(
  authService.protected,
  authService.allowedTo("user"),
  // uploadCategoryImage,
  // resizeImage,
  createCategoryValidator,
  createCategory
);
router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(
    uploadCategoryImage,
    resizeImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(deleteCategoryValidator, deleteCategory);

module.exports = router;
