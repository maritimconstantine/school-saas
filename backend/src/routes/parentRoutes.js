const express = require("express");

const {
  createParent,
  getParents,
  getParent,
  linkParentToLearner
} = require("../controllers/parentController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/", protect, getParents);

router.get("/:id", protect, getParent);

router.post(
  "/",
  protect,
  authorize("ADMIN", "BURSAR", "SCHOOL_ADMIN"),
  createParent
);

router.post(
  "/link",
  protect,
  authorize("ADMIN", "BURSAR", "SCHOOL_ADMIN"),
  linkParentToLearner
);

module.exports = router;