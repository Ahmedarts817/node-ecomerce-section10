const mongoose = require("mongoose");
const Product = require("./productModel");

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

// populate user's name
reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name" });
  next();
});

//calculating the average of rating of the product
reviewSchema.statics.calcAverageRatingsAndQuantity = async function (
  productId
) {
  const result = await this.aggregate([
    //stage 1 get all reviewsof the same product
    {
      $match: { product: productId },
    },
    // stage 2 group reviews baed on productId, avgRatingand ,ratingsquantity.
    {
      $group: {
        _id: "product",
        averageRating: { $avg: $ratings },
        ratingsQuantity: { $sum: 1 },
      },
    },
  ]);
  // console.log(result)
  if (result.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: result[0].avgRatings,
      ratingsQuantity: result[0].ratingsQuantity,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  }
};
reviewSchema.post("save", async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.product);
});
reviewSchema.post("remove", async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.product);
});

const reviewModel = mongoose.model("Review", reviewSchema);
module.exports = reviewModel;
