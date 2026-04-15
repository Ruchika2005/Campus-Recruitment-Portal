const express = require("express");
const router = express.Router();
const { getAllOpportunities, createOpportunity } = require("../controllers/opportunityController");

router.get("/", getAllOpportunities);
router.post("/", createOpportunity);

module.exports = router;