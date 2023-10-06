const express = require("express");
const router = express.Router();

const {
  addProductToWishlist,
  removeProductFromWishlist,
  getLoggedUserWishlist,
} = require("../services/wishlistService");
const authService = require("../services/authService");

router.use(authService.protected, authService.allowedTo("user"));
router.route("/").get(getLoggedUserWishlist).post(addProductToWishlist);
router.route("/:productId").delete(removeProductFromWishlist);

module.exports = router;
