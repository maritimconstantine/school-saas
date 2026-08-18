const express = require("express");

const {
  generateReceipt
} = require("../controllers/receiptController");

const {
  protect
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/:id",
  protect,
  generateReceipt
);

module.exports = router;