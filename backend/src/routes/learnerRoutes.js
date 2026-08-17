const express = require("express");

const {
  createLearner,
  getLearners,
  getLearner,
  updateLearner
} = require("../controllers/learnerController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/",
  protect,
  getLearners
);

router.get(
  "/:id",
  protect,
  getLearner
);

router.post(
  "/",
  protect,
  authorize("ADMIN", "BURSAR", "SCHOOL_ADMIN"),
  createLearner
);

router.put(
  "/:id",
  protect,
  authorize("ADMIN", "BURSAR", "SCHOOL_ADMIN"),
  updateLearner
);

module.exports = router;