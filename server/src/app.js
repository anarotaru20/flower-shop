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

// Payments
const payments = require("./routes/payments");
app.use("/payments", payments);

// Notifications
const cron = require("node-cron");
const { runReminderJob } = require("./jobs/reminderJob");

cron.schedule(
  "0 9 * * *",
  async () => {
    console.log("Running daily reminder job at 09:00 Europe/Bucharest");
    await runReminderJob();
  },
  {
    timezone: "Europe/Bucharest",
  },
);
// cron.schedule(
//   "*/1 * * * *",
//   async () => {
//     console.log("TEST reminder job");
//     await runReminderJob();
//   },
//   {
//     timezone: "Europe/Bucharest",
//   },
// );

// QR Codes
const qr = require("./routes/qr");
app.use("/qr", qr);

// Admin
const adminDashboardRoutes = require("./routes/adminDashboard");
app.use("/admin/dashboard", adminDashboardRoutes);

const adminProductsRoutes = require("./routes/adminProducts");
app.use("/admin/products", adminProductsRoutes);

const adminOrdersRoutes = require("./routes/adminOrders");
app.use("/admin/orders", adminOrdersRoutes);

const adminUsersRoutes = require("./routes/adminUsers");
app.use("/admin/users", adminUsersRoutes);

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
