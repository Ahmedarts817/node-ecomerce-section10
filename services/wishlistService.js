const factory = require("./handlersFactory");
const ApiError = require("../utils/apiError");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

// @desc    add product to wishlist
// @route   POST /api/v1/wishlist
// @access  private

exports.addProductToWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishlist: req.body.productId },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "product added",
    data: user.wishlist,
  });
});
// @desc    remove product from wishlist
// @route   Delete /api/v1/wishlist/:productId
// @access  private

exports.removeProductFromWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishlist: req.params.productId },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "product removed",
    data: user.wishlist,
  });
});
// @desc    get  logged user wishlist
// @route   GET /api/v1/wishlist
// @access  private

exports.getLoggedUserWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("wishlist");

  res.status(200).json({
    status: "success",
    message: "wishlist",
    results: user.wishlist.length,
    data: user.wishlist,
  });
});
