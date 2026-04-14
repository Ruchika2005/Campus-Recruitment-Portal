const db = require("../config/db");

exports.getAllOpportunities = (req, res) => {
  db.query("SELECT * FROM opportunities ORDER BY deadline ASC", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};