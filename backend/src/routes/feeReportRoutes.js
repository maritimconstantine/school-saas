const express = require("express");

const {
  getLearnerFeeSummary,
  getLearnerFeeReports,
  getSchoolFeeSummary
} = require("../controllers/feeReportController");

const {
  protect
} = require("../middleware/authMiddleware");

const router = express.Router();

// School-wide fee summary
router.get(
  "/summary",
  protect,
  getSchoolFeeSummary
);

// Search and sort learners
router.get(
  "/learners",
  protect,
  getLearnerFeeReports
);

// Individual learner statement
router.get(
  "/learner/:learnerId",
  protect,
  getLearnerFeeSummary
);

module.exports = router;