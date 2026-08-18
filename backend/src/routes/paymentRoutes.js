const express = require("express");

const {
  createPayment,
  getLearnerPayments,
  getPayments
} = require("../controllers/paymentController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

const router = express.Router();

// All payments
router.get(
  "/",
  protect,
  getPayments
);

// Learner payment history
router.get(
  "/learner/:learnerId",
  protect,
  getLearnerPayments
);

// Record payment
router.post(
  "/",
  protect,
  authorize("ADMIN", "BURSAR", "SCHOOL_ADMIN"),
  createPayment
);

module.exports = router;