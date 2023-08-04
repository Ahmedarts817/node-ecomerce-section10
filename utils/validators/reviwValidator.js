const validationMiddleware = require("../../middlewares/validatorMiddleware");
const { check, body } = require("express-validator");

exports.createReviewValidator = [
  body("title").notEmpty().withMessage("review title is required"),
  body("description").notEmpty().withMessage("review description is required"),
  body("rating")
    .isLength({ min: 1.0 })
    .withMessage("rating must be at leats 1.0"),
  body("rating")
    .isLength({ max: 5.0 })
    .withMessage("rating must be at maximum 1.5"),
  check("user").isMongoId().withMessage("invalid mongo id of user"),
  check("product").isMongoId().withMessage("invalid mongo id of product"),

  validationMiddleware,
];

exports.getReviewValidator = [
  check("user").isMongoId().withMessage("invalid mongo id of user"),
  validationMiddleware,
];
exports.updateReviewValidator = [
  check("user").isMongoId().withMessage("invalid mongo id of user"),
  validationMiddleware,
];
exports.deleteReviewValidator = [
  check("user").isMongoId().withMessage("invalid mongo id of user"),
  validationMiddleware,
];
