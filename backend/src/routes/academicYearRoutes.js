const express = require("express");

const {
  createAcademicYear,
  getAcademicYears,
  getAcademicYear,
  setActiveAcademicYear
} = require("../controllers/academicYearController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/",
  protect,
  getAcademicYears
);

router.get(
  "/:id",
  protect,
  getAcademicYear
);

router.post(
  "/",
  protect,
  authorize("ADMIN", "SCHOOL_ADMIN"),
  createAcademicYear
);

router.patch(
  "/:id/activate",
  protect,
  authorize("ADMIN", "SCHOOL_ADMIN"),
  setActiveAcademicYear
);

module.exports = router;