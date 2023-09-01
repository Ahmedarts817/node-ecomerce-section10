const factory = require("./handlersFactory");
const Review = require("../models/reviewModel");

//Nested route
//get /api/v1/products/poductId/revoews
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.productId)
    filterObject = {
      product: req.params.productId,
    };
  req.filterObj = filterObject;
  next();
};
//@desc get all reviews
//@route /api/v1/reviews
//@access public
exports.getReviews = factory.getAll(Review);
//@desc get one review
//@route /api/v1/reviews/:id
//@access public
exports.getReview = factory.getOne(Review);

//Nested route (create)
exports.setProductIdAndUserIdToBody = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

//@desc create review
//@route /api/v1/reviews
//@access public
exports.createReview = factory.createOne(Review);

//@desc edit one review
//@route /api/v1/reviews/:id
//@access public
exports.updateReview = factory.updateOne(Review);
//@desc delete one review
//@route /api/v1/reviews/:id
//@access private
exports.deleteReview = factory.deleteOne(Review);
