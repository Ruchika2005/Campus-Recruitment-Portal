const db = require("../config/db");

exports.getAllOpportunities = (req, res) => {
  db.query("SELECT * FROM opportunities ORDER BY deadline ASC", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

exports.createOpportunity = (req, res) => {
  const { title, company_name, type, description, deadline, branch, year, min_cgpa } = req.body;

  db.beginTransaction((err) => {
    if (err) return res.status(500).json({ error: "Transaction start failed", details: err });

    const oppQuery = `INSERT INTO opportunities (title, company_name, type, description, deadline) VALUES (?, ?, ?, ?, ?)`;
    db.query(oppQuery, [title, company_name, type, description, deadline], (err, oppResult) => {
      if (err) {
        return db.rollback(() => res.status(500).json({ error: "Failed to create opportunity", details: err }));
      }

      const oppId = oppResult.insertId;
      const eligQuery = `INSERT INTO opportunity_eligibility (opportunity_id, branch, year, min_cgpa) VALUES (?, ?, ?, ?)`;
      
      db.query(eligQuery, [oppId, branch, year, min_cgpa], (err, eligResult) => {
        if (err) {
          return db.rollback(() => res.status(500).json({ error: "Failed to add eligibility", details: err }));
        }

        db.commit((err) => {
          if (err) {
            return db.rollback(() => res.status(500).json({ error: "Transaction commit failed", details: err }));
          }
          res.status(201).json({ message: "Opportunity and eligibility created successfully!", opportunity_id: oppId });
        });
      });
    });
  });
};