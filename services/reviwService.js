const express = require("express");
const factory = require("./handlersFactory");
const Review = require("../models/reviewModel");

//@desc create review
//@route /api/v1/reviews
//@access public
exports.createReview = factory.createOne(Review);
//@desc get all reviews
//@route /api/v1/reviews
//@access public
exports.getReviews = factory.getAll(Review);
//@desc get one review
//@route /api/v1/reviews/:id
//@access public
exports.getReview = factory.getOne(Review);
//@desc edit one review
//@route /api/v1/reviews/:id
//@access public
exports.updateReview = factory.updateOne(Review);
//@desc delete one review
//@route /api/v1/reviews/:id
//@access private
exports.deleteReview = factory.deleteOne(Review);
