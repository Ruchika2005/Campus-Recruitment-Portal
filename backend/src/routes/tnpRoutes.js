const express = require("express");
const router = express.Router();
const {
  getTNPStats,
  getRecentApplications,
  getTopCompanies,
  createAnnouncement,
  deleteAnnouncement,
  getAllStudents,
  getStudentActivity
} = require("../controllers/tnpController");

router.get("/stats", getTNPStats);
router.get("/recent-applications", getRecentApplications);
router.get("/top-companies", getTopCompanies);

router.get("/students", getAllStudents);
router.get("/students/:roll_no/activity", getStudentActivity);

router.post("/announcements", createAnnouncement);
router.delete("/announcements/:id", deleteAnnouncement);

module.exports = router;