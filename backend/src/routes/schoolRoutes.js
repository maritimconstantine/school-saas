const express = require("express");

const {
  registerSchool,
  getSchools
} = require("../controllers/schoolController");

const router = express.Router();

router.post("/", registerSchool);

router.get("/", getSchools);

module.exports = router;