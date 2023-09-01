const { check, body } = require("express-validator");
const validationMiddleware = require("../../middlewares/validatorMiddleware");
const Review = require("../../models/reviewModel");

exports.createReviewValidator = [
  body("title").notEmpty().withMessage("review title is required"),
  body("description").notEmpty().withMessage("review description is required"),
  body("ratings")
    .isFloat({ min: 1, max: 5 })
    .withMessage("rating must be between 1 and 5"),

  check("user").isMongoId().withMessage("invalid mongo id of user"),
  check("product")
    .isMongoId()
    .withMessage("invalid mongo id of product")
    .custom((val, { req }) =>
      //check if logged user made review before
      Review.findOne({ user: req.user._id, product: req.body.product }).then(
        (review) => {
          console.log(review);
          if (review) {
            return Promise.reject(
              new Error("you have already created a review")
            );
          }
        }
      )
    ),
  validationMiddleware,
];

exports.getReviewValidator = [
  check("id").isMongoId().withMessage("invalid mongo id "),
  validationMiddleware,
];
exports.updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("invalid mongo id ")
    .custom((val, { req }) =>
      //check review ownership before update
      Review.findById(val).then((review) => {
        if (!review) {
          return Promise.reject(new Error("no review with this review id"));
        }
        if (review.user._id.toString() !== req.user._id.toString()) {
          return Promise.reject(
            new Error(`you are not allowed to perform this action`)
          );
        }
      })
    ),

  validationMiddleware,
];
exports.deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("invalid mongo id ")
    .custom((val, { req }) => {
      if (req.user.role === "user") {
        return Review.findById(val).then((review) => {
          if (!review) return Promise.reject(new Error("no review"));
          if (review.user._id.toString() !== req.user._id.toString())
            return Promise.reject(new Error("not allowed"));
        });
      }
      return true;
    }),
  validationMiddleware,
];
