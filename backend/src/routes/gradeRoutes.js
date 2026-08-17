const express = require("express");

const {
  createGrade,
  getGrades,
  getGrade
} = require("../controllers/gradeController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", protect, getGrades);

router.get("/:id", protect, getGrade);

router.post(
  "/",
  protect,
  authorize("ADMIN", "SCHOOL_ADMIN"),
  createGrade
);

module.exports = router;