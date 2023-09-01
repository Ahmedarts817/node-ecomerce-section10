const asyncHandler = require("express-async-handler");
const APiError = require("../utils/apiError");

const Product = require("../models/productModel");
const Coupon = require("../models/couponModel");
const Cart = require("../models/cartModel");
const ApiError = require("../utils/apiError");

const calcTotalCartPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.quantity * item.price;
  });
  cart.totalCartPrice = totalPrice;
  cart.totalPriceAfterDiscount = undefined;
  return totalPrice;
};

// @des add product to cart
// @route Post /api/v1/cart
// @access Private/User
exports.addProductToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;
  const product = await Product.findById(productId);

  //1)get cart for logged user
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [{ product: productId, color, price: product.price }],
    });
  } else {
    //product exists in cart > update product quantity
    const productIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.color === color
    );
    console.log(productIndex);
    if (productIndex > -1) {
      const cartItem = cart.cartItems[productIndex];
      cartItem.quantity += 1;
    } else {
      //product not exist in cart > push product to cart items
      cart.cartItems.push({ product: productId, color, price: product.price });
    }
  }

  //calculate total cart price
  calcTotalCartPrice(cart);
  await cart.save();
  res.status(200).json({
    status: "success",
    message: "product added to cart successfuly",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

//@desc get logged user cart
//@route Get /api/v1/cart
//@access private/User
exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return next(new ApiError(`no cart for this user id: ${req.user._id}`), 404);
  }

  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});
//@desc remove item from cart
//@route Delete /api/v1/cart/item:id
//@access private/User
exports.removeSpecificCartItem = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },

    {
      $pull: { cartItems: { _id: req.params.itemId } },
    },
    { new: true }
  );
  calcTotalCartPrice(cart);
  await cart.save();

  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

//@desc clear logged user cart
//@route Delete /api/v1/cart
//@access Private/User
exports.clearCart = asyncHandler(async (req, res, next) => {
  await Cart.findOneAndDelete({ user: req.user._id });
  res.status(204).send();
});

//@desc update logged user cart item quantity
//@route PUT /api/v1/cart/PitemId
//@access Private/User
exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === req.params.itemId
  );
  if (itemIndex > -1) {
    const cartItem = cart.cartItems[itemIndex];
    cartItem.quantity = quantity;
  } else {
    return next(new ApiError(`no item for this id ${req.params.itemId}`));
  }
  calcTotalCartPrice(cart);
  await cart.save();

  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

//@desc apply coupon on logged user cart
//@route PUT /api/v1/cart/applyCoupon
//@access Private/User
exports.applyCoupon = asyncHandler(async (req, res, next) => {
  //1)get coupon based on coupo name
  const coupon = await Coupon.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });
  if (!coupon) {
    return next(new ApiError("coupon is invalid or expired"));
  }

  //2) get user cart to get total price
  const cart = await Cart.findOne({ user: req.user._id });
  const totalPrice = cart.totalCartPrice;
  //3) calculate price after discount
  const totalPriceAfterDiscount = (
    totalPrice -
    (totalPrice * coupon.discount) / 100
  ).toFixed(2);

  cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
  await cart.save();
  res.status(200).json({
    status: "success",
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});
