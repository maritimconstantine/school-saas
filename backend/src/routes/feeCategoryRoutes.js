const express = require("express");

const {
  createFeeCategory,
  getFeeCategories
} = require("../controllers/feeCategoryController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/",
  protect,
  getFeeCategories
);

router.post(
  "/",
  protect,
  authorize("ADMIN", "SCHOOL_ADMIN"),
  createFeeCategory
);

module.exports = router;