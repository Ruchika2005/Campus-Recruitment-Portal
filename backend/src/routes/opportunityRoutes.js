const express = require("express");
const router = express.Router();
const { getAllOpportunities } = require("../controllers/opportunityController");

router.get("/", getAllOpportunities);

module.exports = router;