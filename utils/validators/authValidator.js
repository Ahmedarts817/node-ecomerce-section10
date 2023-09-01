const slugify = require("slugify");
const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const User = require("../../models/userModel");

exports.signupValidator = [
  check("name")
    .notEmpty()
    .withMessage("User required")
    .isLength({ min: 3 })
    .withMessage("Too short User name")
    .isLength({ max: 32 })
    .withMessage("Too long User name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  body("email")
    .notEmpty()
    .withMessage("email required")
    .isEmail()
    .withMessage("invalid email format")
    .custom(
      async (val) =>
        await User.findOne({ email: val }).then((user) => {
          if (user) {
            return Promise.reject(new Error("email already exists"));
          }
        })
    ),
  check("password")
    .notEmpty()
    .withMessage("password is too required")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters"),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("confirm passsword is required")
    .custom((val, { req }) => {
      if (val !== req.body.password) {
        throw new Error("password must mathch confirmation password");
      }
      return true;
    }),

  validatorMiddleware,
];

exports.signinValidator = [
  body("email")
    .notEmpty()
    .withMessage("email required")
    .isEmail()
    .withMessage("invalid email format"),

  body("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters"),
  validatorMiddleware,
];
