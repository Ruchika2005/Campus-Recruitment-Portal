const express = require("express");
const router = express.Router();
const {
  getTNPStats,
  getRecentApplications,
  getTopCompanies,
  createAnnouncement,
  deleteAnnouncement
} = require("../controllers/tnpController");

router.get("/stats", getTNPStats);
router.get("/recent-applications", getRecentApplications);
router.get("/top-companies", getTopCompanies);

router.post("/announcements", createAnnouncement);
router.delete("/announcements/:id", deleteAnnouncement);

module.exports = router;