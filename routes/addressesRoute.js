const express = require("express");
const router = express.Router();

const {
  addaddressToAddresses,
  removeaddressFromAddresses,
  getLoggedUserAddresses,
} = require("../services/addressesService");
const authService = require("../services/authService");

router.use(authService.protected, authService.allowedTo("user"));
router.route("/").get(getLoggedUserAddresses).post(addaddressToAddresses);
router.route("/:addressId").delete(removeaddressFromAddresses);

module.exports = router;
