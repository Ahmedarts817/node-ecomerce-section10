const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title of revew is required"],
    },
    description: {
      type: String,
      required: [true, "description of review is required"],
    },
    rating: {
      type: Number,
      required: [true, "rating is required"],
      length: [{ min: 1.0 }, "rating must be at least 1.0"],
      length: [{ max: 5.0 }, "rating must be less than o r equal 5.0"],
    },
    product: {
      type: mongoose.SchemaTypes.ObjectId,
      required: [true, "review must refer to a product"],
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      required: [true, "rating must be owned by user"],
    },
  },
  { timestamps: true }
);
const reviewModel = mongoose.model("Review", reviewSchema);
module.exports = reviewModel;
