const express = require("express");

const {
  addProductToCart,
  getLoggedUserCart,
  updateCartItemQuantity,
  clearCart,
  removeSpecificCartItem,
  applyCoupon,
} = require("../services/cartService");
const authService = require("../services/authService");

const router = express.Router();

router.use(authService.protected, authService.allowedTo("user"));
router
  .route("/")
  .post(addProductToCart)
  .get(getLoggedUserCart)
  .delete(clearCart);

router.put("/applyCoupon", applyCoupon);

router
  .route("/:itemId")
  .put(updateCartItemQuantity)
  .delete(removeSpecificCartItem);

module.exports = router;
