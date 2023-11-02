const express = require("express");
const router = express.Router();
const authService = require("../services/authService");

const {
  createCashOrder,
  findAllOrders,
  findSpecificOrder,
  updateOrderToPaid,
  updateOrderToDelivered,
  checkoutSession,
  filterOrderForLoggedUser
} = require("../services/orderService");
router.use(authService.protected);
router.get(
  "/checkout-session/:cartId",
  authService.allowedTo("user"),
  checkoutSession
);
router.route("/:cartId").post(authService.allowedTo("user"), createCashOrder);
router
  .route("/")
  .get(authService.allowedTo("user", "admin", "manager"), filterOrderForLoggedUser,findAllOrders);
router
  .route("/:id/pay")
  .get(authService.allowedTo("admin", "manager"), findSpecificOrder);
router
  .route("/:id/pay")
  .put(authService.allowedTo("admin", "manager"), updateOrderToPaid);
router
  .route("/:id/deliver")
  .put(authService.allowedTo("admin", "manager"), updateOrderToDelivered);
module.exports = router;
