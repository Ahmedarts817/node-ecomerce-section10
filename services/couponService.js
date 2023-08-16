const factory = require("./handlersFactory");
const Coupon = require("../models/couponModel");

//desc  Get list of coupons
//@route Get /api/v1/coupons
//@access private admin-manager
exports.getCoupons = factory.getAll(Coupon);

//desc  Get specific coupon by id
//@route Get /api/v1/coupons/:id
//@access private admin-manager
exports.getCoupon = factory.getOne(Coupon);

//desc create coupon by id
//@route Post /api/v1/coupons/:id
//@access private admin-manager
exports.createCoupon = factory.createOne(Coupon);

//desc update coupon by id
//@route Post /api/v1/coupons/:id
//@access private admin-manager
exports.updateCoupon = factory.updateOne(Coupon);

//desc delte coupon by id
//@route Delete /api/v1/coupons/:id
//@access private admin-manager
exports.deleteCoupon = factory.deleteOne(Coupon);
