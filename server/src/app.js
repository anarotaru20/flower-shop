const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const logger = require("./config/logger");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

// Routes
// Auth
const auth = require("./routes/auth");
app.use(auth);

// Profile
const profile = require("./routes/profile");
app.use(profile);

// Beneficiaries
const beneficiaries = require("./routes/beneficiaries");
app.use(beneficiaries);

// Events
const events = require("./routes/events");
app.use(events);

// Products
const products = require("./routes/products");
app.use("/products", products);

// Categories
const categories = require("./routes/categories");
app.use("/categories", categories);

// Orders
const orders = require("./routes/orders");
app.use("/orders", orders);

app.use((req, res) => {
  logger.warn(`Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  logger.error({
    message: err?.message,
    code: err?.code,
    number: err?.number,
    name: err?.name,
    stack: err?.stack,
    original: err?.originalError?.message,
  });

  res.status(500).json({
    message: err?.message || "Internal server error",
    code: err?.code,
    number: err?.number,
    name: err?.name,
    original: err?.originalError?.message,
  });
});

module.exports = app;
