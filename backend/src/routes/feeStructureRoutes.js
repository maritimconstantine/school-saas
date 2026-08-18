const express = require("express");

const {
  createFeeStructure,
  getFeeStructures,
  getGradeFeeTotal
} = require("../controllers/feeStructureController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/",
  protect,
  getFeeStructures
);

router.get(
  "/total",
  protect,
  getGradeFeeTotal
);

router.post(
  "/",
  protect,
  authorize("ADMIN", "SCHOOL_ADMIN"),
  createFeeStructure
);

module.exports = router;