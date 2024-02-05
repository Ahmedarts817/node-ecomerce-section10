const express = require("express");
const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validators/productValidator");

const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  resizeProductImages,
  createFilterObj,
} = require("../services/productService");
const authService = require("../services/authService");

// mergeParams: Allow us to access parameters on other routers
// ex: We need to access subCategoryId from category router
const router = express.Router({ mergeParams: true });
const reviewRoute = require("./reviewRoute");
//nested route
router.use("/:productId/reviews", reviewRoute);

router
  .route("/")
  .get(createFilterObj, getProducts)
  .post(
    authService.protected,
    authService.allowedTo("admin", "manager"),
    uploadProductImages,
    resizeProductImages,
    createProductValidator,
    createProduct
  );
router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(
    authService.protected,
    authService.allowedTo("admin", "manager"),
    uploadProductImages,
    resizeProductImages,
    updateProductValidator,
    updateProduct
  )
  .delete(
    authService.protected,
    authService.allowedTo("admin"),
    deleteProductValidator,
    deleteProduct
  );

module.exports = router;
