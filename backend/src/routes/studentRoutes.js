const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  getProfile,
  getAnnouncements,
  getSelected,
  updateProfile,
  updateResume,
  deleteResume
} = require("../controllers/studentController");
const upload = require("../middleware/upload");

router.get("/stats/:user_id", getDashboardStats);
router.get("/profile/:user_id", getProfile);
router.put("/profile/:user_id", updateProfile);
router.put("/profile/:user_id/resume", upload.any(), updateResume);
router.delete("/profile/:user_id/resume", deleteResume);
router.get("/announcements", getAnnouncements);
router.get("/selected", getSelected);

module.exports = router;