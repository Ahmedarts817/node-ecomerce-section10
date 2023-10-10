const stripe = require("stripe")(process.env.STRIPE_SECRET);
const asyncHandler = require("express-async-handler");
const factory = require("./handlersFactory");
const ApiError = require("../utils/apiError");

const User = require("../models/orderModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");

// @desc create cash  order
// @route POST /api/v1/orders/cartId
// @access Protected/User
exports.createCashOrder = asyncHandler(async (req, res, next) => {
  //app settings
  const taxPrice = 0;
  const shippingPrice = 0;

  // 1) Get cart depend on cartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(
      new ApiError(`there is no such cart with id ${req.params.cartId}`, 404)
    );
  }

  // 2) get order price depend on cart price "check if coupon applied"
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

  // 3) create order with default payment method 'cash'
  const order = await Order.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice,
  });

  // 4)after creating order , decrement product quantity and increment product sold
  if (order) {
    const bulkOptions = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOptions, {});

    //5) Clear cart depend on cart id
    await Cart.findByIdAndDelete(req.params.cartId);
  }

  res.status(200).json({ status: "success", data: order });
});

exports.filterOrderForLoggedUser = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") req.filterObj = { user: req.user._id };
  next();
});
// @desc get all orders
// @route Post /api/v1/orders
// @access protected/user-admin-manager
exports.findAllOrders = factory.getAll(Order);

// @desc get one order
// @route Post /api/v1/orders/:id/pay
// @access protected/admin-manager
exports.findSpecificOrder = factory.getOne(Order);

// @desc update  one order to paid
// @route Post /api/v1/orders/:id/pay
// @access protected/admin-manager
exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new ApiError(
        `There is no such a order with this id:${req.params.id}`,
        404
      )
    );
  }

  //  update order to paid
  order.isPaid = true;
  order.paidAt = Date.now();

  const upadatedOrder = await order.save();

  res.status(200).json({ status: "success", data: upadatedOrder });
});

// @desc update  one order to delivered
// @route Post /api/v1/orders/:id/pay
// @access protected/admin-manager
exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new ApiError(
        `There is no such a order with this id:${req.params.id}`,
        404
      )
    );
  }

  // update order to delivered
  order.isDelivered = true;
  order.deliveredAt = Date.now();

  const updatedOrder = await order.save();

  res.status(200).json({ status: "success", data: updatedOrder });
});

// @desc Get checkout session from stripe and send it as a response
// @route GET /api/v1/orders/checkout-session/carId
// @access Protected/User
exports.checkoutSession = asyncHandler(async (req, res, next) => {
  //app settings
  const taxPrice = 0;
  const shipppingPrice = 0;

  // 1) Get card depend on cart id
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(
      new ApiError(`There is no such cart with id ${req.params.cartId}`, 404)
    );
  }

  // 2)get order price depend on cart price  "check if coupon applied"
  const cartPrice = cart.totalpriceAfterDiscount
    ? cart.totalpriceAfterDiscount
    : cart.totalCartPrice;

  const totalOrderPrice = cartPrice + taxPrice + shipppingPrice;

  // 3) create stripe checkout session

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "egp",
          product_data: {
            name: req.user.name,
          },
          unit_amount: totalOrderPrice * 100,
        },

        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/orders`,
    cancel_url: `${req.protocol}://${req.get("host")}/cart`,
    customer_email: req.user.email,
    client_refernce_id: req.params.carId,
    metadata: req.body.shippingAddress,
  });

  // send session to response
  res.status(200).json({ status: "success", data: session });
});

const createCardOrder = async (session) => {
  const cartId = session.client_refernce_id;
  const shippingAddress = session.metadata;
  const orderPrice = session.amount_total / 100;

  const cart = Cart.findById(cartId);
  const user = await User.findOne({ email: session.customer_email });

  // 3) create order with default paymentMethodType  card
  const order = await Order.create({
    user: user._id,
    cartItems: cart.cartItems,
    shippingAddress,
    totalOrderPrice: orderPrice,
    isPaid: true,
    paidAt: Date.now(),
    paymentMethodType: "card",
  });

  // 4) After creating order, decrement product quantity, increment product sold
  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Product.bulkWrite(bulkOption, {});

    // 5) Clear cart depend on cartId
    await Cart.findByIdAndDelete(cartId);
  }
};

//@desc this hook will run when stripe payment successfuly
//@route post /webhook_checkout
// @access Protected/User
exports.webhookCheckout = asyncHandler(async (req, res, next) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === "checkout.session.completed") {
    //  Create order
    createCardOrder(event.data.object);
  }

  res.status(200).json({ received: true });
});
