const slugify = require("slugify");
const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const User = require("../../models/userModel");
const bcrypt = require("bcryptjs");

exports.getUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  validatorMiddleware,
];

exports.createUserValidator = [
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
  body("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters")
    .custom((val, { req }) => {
      if (val !== req.body.passwordConfirm) {
        throw new Error("password must mathch confirmation password");
      }
      return true;
    }),
  check("profileImg").optional(),
  check("role").optional(),

  check("passwordConfirm")
    .notEmpty()
    .withMessage("confirm passsword is required"),

  validatorMiddleware,
];

exports.changePasswordValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),

  check("currentPassword")
    .notEmpty()
    .withMessage("currentPassword is required")

    .custom(async (val, { req }) => {
      const user = await User.findById(req.params.id);
      const isTrue = await bcrypt.compare(val, user.password);
      if (!isTrue) {
        throw new Error("wrong current password");
      }
      if (await bcrypt.compare(req.body.password, user.password)) {
        throw new Error("new password is match to old password");
      }
      return true;
    }),
  check("password")
    .notEmpty()
    .withMessage("new password required")
    .custom((val, { req }) => {
      if (val !== req.body.confirmPassword) {
        throw new Error("confirm password dont match");
      }
      return true;
    }),
  check("confirmPassword").notEmpty().withMessage("new password required"),
  validatorMiddleware,
];
exports.updateUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
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
  validatorMiddleware,
];

exports.deleteUserValidator = [
  check("id").isMongoId().withMessage("Invalid User id format"),
  validatorMiddleware,
];

//User
exports.updateLoggedUserDataValidator = [
  body("name")
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
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
  validatorMiddleware,
];
