const express = require("express");

const {
  createClass,
  getClasses,
  getClass
} = require("../controllers/classController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", protect, getClasses);

router.get("/:id", protect, getClass);

router.post(
  "/",
  protect,
  authorize("ADMIN", "SCHOOL_ADMIN"),
  createClass
);

module.exports = router;