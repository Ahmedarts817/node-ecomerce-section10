const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

// @desc    add address to addresses
// @route   POST /api/v1/addresses
// @access  private

exports.addaddressToAddresses = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { addresses: req.body },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "address added",
    data: user.addresses,
  });
});
// @desc    remove address from addresses
// @route   Delete /api/v1/addresses/:addressId
// @access  private

exports.removeaddressFromAddresses = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { addresses: { _id: req.params.addressId } },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "address removed",
    data: user.addresses,
  });
});
// @desc    get  logged user addresses
// @route   GET /api/v1/addresses
// @access  private

exports.getLoggedUserAddresses = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("addresses");

  res.status(200).json({
    status: "success",
    message: "addresses",
    results: user.addresses.length,
    data: user.addresses,
  });
});
