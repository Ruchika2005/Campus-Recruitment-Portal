const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Register (step 1)
router.post("/register", authController.registerStudent);

const upload = require("../middleware/upload");

// Complete Profile (step 2)
router.post("/complete-profile", upload.any(), authController.completeProfile);

// Login
router.post("/login", authController.loginUser);

// Change Password
router.post("/change-password", authController.changePassword);

module.exports = router;