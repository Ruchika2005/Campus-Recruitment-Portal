const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  getProfile,
  getAnnouncements,
  getSelected
} = require("../controllers/studentController");

router.get("/stats/:user_id", getDashboardStats);

module.exports = router;


router.get("/profile/:user_id", getProfile);
router.get("/announcements", getAnnouncements);
router.get("/selected", getSelected);