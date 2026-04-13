const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Register (step 1)
router.post("/register", authController.registerStudent);

// Complete Profile (step 2)
router.post("/complete-profile", authController.completeProfile);

// Login
router.post("/login", authController.loginUser);

module.exports = router;