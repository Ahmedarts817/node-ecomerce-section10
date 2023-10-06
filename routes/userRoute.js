const express = require("express");
const router = express.Router();

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeImage,
  changeUserPassword,
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUser,
} = require("../services/userService");
const {
  createUserValidator,
  getUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changePasswordValidator,
  updateLoggedUserDataValidator,
} = require("../utils/validators/userValidator");
const authService = require("../services/authService");

router.use(authService.protected);

//User
router.get("/getMe", getLoggedUserData, getUser);
router.put(
  "/changeMyPassword",
  changePasswordValidator,
  updateLoggedUserPassword
);
router.put("/updateMe", updateLoggedUserDataValidator, updateLoggedUserData);
router.put("/deactiveMe", deleteLoggedUser);

//Admin
router.use(authService.allowedTo("admin"));
router
  .route("/")
  .get(getUsers)
  .post(uploadUserImage, resizeImage, createUserValidator, createUser);
router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(uploadUserImage, resizeImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);
router.put("/changePassword/:id", changePasswordValidator, changeUserPassword);
module.exports = router;
