const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const academicYearRoutes = require("./routes/academicYearRoutes");
const gradeRoutes = require("./routes/gradeRoutes");
const classRoutes = require("./routes/classRoutes");
const learnerRoutes = require("./routes/learnerRoutes");
const parentRoutes = require("./routes/parentRoutes");
const feeCategoryRoutes =require("./routes/feeCategoryRoutes");

const feeStructureRoutes =require("./routes/feeStructureRoutes");

const paymentRoutes =require("./routes/paymentRoutes");

const receiptRoutes = require("./routes/receiptRoutes");

const app = express();

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(
  cors({
    origin:
      process.env.CLIENT_URL ||
      "http://localhost:5173",

    credentials: true
  })
);

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true
  })
);
app.use(
  "/api/fee-categories",
  feeCategoryRoutes
);

app.use(
  "/api/fee-structures",
  feeStructureRoutes
);

app.use(
  "/api/payments",
  paymentRoutes
);

app.use(
  "/api/receipts",
  receiptRoutes
);

// ==========================================
// BASIC ROUTES
// ==========================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message:
      "School Fee Management System API is running",
    version: "1.0.0"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "API is healthy",
    timestamp:
      new Date().toISOString()
  });
});

// ==========================================
// API ROUTES
// ==========================================

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/academic-years",
  academicYearRoutes
);

app.use(
  "/api/grades",
  gradeRoutes
);

app.use(
  "/api/classes",
  classRoutes
);

app.use(
  "/api/learners",
  learnerRoutes
);

app.use(
  "/api/parents",
  parentRoutes
);

// ==========================================
// 404
// ==========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message:
      `Route ${req.method} ${req.originalUrl} not found`
  });
});

// ==========================================
// ERROR HANDLER
// ==========================================

app.use(
  (err, req, res, next) => {
    console.error(err);

    const statusCode =
      err.statusCode || 500;

    res.status(statusCode).json({
      success: false,
      message:
        err.message ||
        "Internal server error"
    });
  }
);

module.exports = app;