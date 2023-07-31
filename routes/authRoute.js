const express = require("express");
const router = express.Router();
const { sigup, signin, forgetPassword } = require("../services/authService");
const {
  signupValidator,
  signinValidator,
} = require("../utils/validators/authValidator");

router.post("/signup", signupValidator, sigup);
router.post("/signin", signinValidator, signin);
router.post("/forgetPassword", forgetPassword);

module.exports = router;
