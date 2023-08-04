const express = require("express");
const router = express.Router();

const {
  createReview,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
} = require("../services/reviwService");
const {
  createReviewValidator,
  getReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
} = require("../utils/validators/reviwValidator");

router.route("/").post(createReviewValidator, createReview).get(getReviews);
router
  .route("/:id")
  .get(getReviewValidator, getReview)
  .put(updateReviewValidator, updateReview)
  .delete(deleteReviewValidator, deleteReview);
module.exports = router;
