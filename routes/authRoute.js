const express = require("express");
const router = express.Router();
const {
  sigup,
  signin,
  forgetPassword,
  verifyResetCode,
  resetPassword,
} = require("../services/authService");
const {
  signupValidator,
  signinValidator,
} = require("../utils/validators/authValidator");

router.post("/signup", signupValidator, sigup);
router.post("/signin", signinValidator, signin);
router.post("/forgetPassword", forgetPassword);
router.post("/verifyResetCode", verifyResetCode);
router.post("/resetPassword", resetPassword);

module.exports = router;
