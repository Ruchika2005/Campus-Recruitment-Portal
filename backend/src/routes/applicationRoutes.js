const express = require("express");
const router = express.Router();
const { getStudentApplications } = require("../controllers/applicationController");

router.get("/:roll_no", getStudentApplications);

module.exports = router;