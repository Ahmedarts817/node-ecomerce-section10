const express = require("express");
const router = express.Router({mergeParams:true});
const authService = require("../services/authService");

const {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
  createFilterObj,
  setProductIdAndUserIdToBody,
} = require("../services/reviwService");
const {
  createReviewValidator,
  getReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
} = require("../utils/validators/reviwValidator");

router
  .route("/")
  .get(createFilterObj, getReviews)
  .post(
    authService.protected,
    authService.allowedTo("user"),
    setProductIdAndUserIdToBody,
    createReviewValidator,
    createReview
  );
router
  .route("/:id")
  .get(getReviewValidator, getReview)
  .put(
    authService.protected,
    authService.allowedTo("user"),
    updateReviewValidator,
    updateReview
  )
  .delete(
    authService.protected,
    authService.allowedTo("user", "admin", "manager"),
    deleteReviewValidator,
    deleteReview
  );
module.exports = router;
