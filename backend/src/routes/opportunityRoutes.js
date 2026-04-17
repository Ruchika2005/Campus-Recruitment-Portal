const express = require("express");
const router = express.Router();
const { getAllOpportunities, createOpportunity, applyForOpportunity, getStudentApplications, getAllApplications, updateApplicationStatus } = require("../controllers/opportunityController");

router.get("/", getAllOpportunities);
router.post("/", createOpportunity);
router.post("/apply", applyForOpportunity);
router.get("/applications/student/:roll_no", getStudentApplications);
router.get("/applications", getAllApplications);
router.put("/applications/:id", updateApplicationStatus);

module.exports = router;