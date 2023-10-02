const path = require('path')

const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const mongoSanitaize = require("express-mongo-sanitize");
const xss = require("xss-clean");

dotenv.config({ path: "config.env" });
const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddleware");
const dbConnection = require("./config/database");
// Routes
const categoryRoute = require("./routes/categoryRoute");
const subCategoryRoute = require("./routes/subCategoryRoute");
const brandRoute = require("./routes/brandRoute");
const productRoute = require("./routes/productRoute");
const userRoute = require("./routes/userRoute");
const authRoute = require("./routes/authRoute");
const reviewRoute = require("./routes/reviewRoute");
const couponRoute = require("./routes/couponRoute");
const cartRoute = require("./routes/cartRoute");
const orderRoute = require("./routes/orderRoute");
const { webhookCheckout } = require("./services/orderService");
// Connect with db
dbConnection();

// express app
const app = express();

// Middlewares
app.post(
  "/checkout-webhook",
  express.raw({ type: "application/json" }),
  webhookCheckout
);
app.use(express.json({ limit: "500k" }));
app.use(express.static(path.join(__dirname,'uploads')))
app.use(cors());
app.options("*", cors());
app.use(compression());

// middeleware to limit each ip for 100 requsts per window (per 15 minutes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);
// middleware to protect against http request pollution attacks

app.use(
  hpp({
    whitelist: [
      "price",
      "sold",
      "quantity",
      "ratingsAverage",
      "ratingsQuantity",
    ],
  })
);
// input data sanitization
app.use(mongoSanitaize());
// input cross side script sanitization
app.use(xss());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// Mount Routes
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/subcategories", subCategoryRoute);
app.use("/api/v1/brands", brandRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/reviews", reviewRoute);
app.use("/api/v1/coupons", couponRoute);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/orders", orderRoute);

app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

// Global error handling middleware for express
app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`App running running on port ${PORT}`);
});

// Handle rejection outside express
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down....`);
    process.exit(1);
  });
});
