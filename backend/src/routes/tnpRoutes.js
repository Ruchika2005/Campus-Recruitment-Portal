const express = require("express");
const router = express.Router();
const {
  getTNPStats,
  getRecentApplications,
  getTopCompanies
} = require("../controllers/tnpController");

router.get("/stats", getTNPStats);
router.get("/recent-applications", getRecentApplications);
router.get("/top-companies", getTopCompanies);

module.exports = router;