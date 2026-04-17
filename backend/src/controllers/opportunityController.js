const db = require("../config/db");

exports.getAllOpportunities = (req, res) => {
  const query = `
    SELECT o.*, 
    GROUP_CONCAT(DISTINCT e.branch SEPARATOR ', ') as branches,
    GROUP_CONCAT(DISTINCT e.year SEPARATOR ', ') as years,
    MAX(e.min_cgpa) as min_cgpa
    FROM opportunities o
    LEFT JOIN opportunity_eligibility e ON o.opportunity_id = e.opportunity_id
    GROUP BY o.opportunity_id
    ORDER BY o.deadline ASC
  `;
  db.query(query, (err, result) => {
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
      const eligQuery = `INSERT INTO opportunity_eligibility (opportunity_id, branch, year, min_cgpa) VALUES ?`;
      
      const branchList = branch.split(",").map(b => b.trim());
      const yearList = year.toString().split(",").map(y => parseInt(y.trim()));
      
      const values = [];
      for (const b of branchList) {
        for (const y of yearList) {
          values.push([oppId, b, y, min_cgpa]);
        }
      }

      db.query(eligQuery, [values], (err, eligResult) => {
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

exports.applyForOpportunity = (req, res) => {
  const { user_id, opportunity_id, roll_no } = req.body;
  if (!roll_no || !opportunity_id) return res.status(400).json({ error: "Missing parameters" });

  const checkQuery = "SELECT * FROM applications WHERE roll_no = ? AND opportunity_id = ?";
  db.query(checkQuery, [roll_no, opportunity_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length > 0) return res.status(400).json({ error: "Already applied" });

    const insertQuery = "INSERT INTO applications (roll_no, opportunity_id, status) VALUES (?, ?, 'applied')";
    db.query(insertQuery, [roll_no, opportunity_id], (err, insertResult) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: "Applied successfully" });
    });
  });
};

exports.getStudentApplications = (req, res) => {
  const { roll_no } = req.params;
  const query = `
    SELECT a.*, o.title, o.company_name, o.type, o.deadline
    FROM applications a
    JOIN opportunities o ON a.opportunity_id = o.opportunity_id
    WHERE a.roll_no = ?
    ORDER BY a.application_id DESC
  `;
  db.query(query, [roll_no], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

exports.getAllApplications = (req, res) => {
  const query = `
    SELECT a.*, s.name, s.branch, s.cgpa, o.title, o.company_name
    FROM applications a
    JOIN students s ON a.roll_no = s.roll_no
    JOIN opportunities o ON a.opportunity_id = o.opportunity_id
    ORDER BY a.application_id DESC
  `;
  db.query(query, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

exports.updateApplicationStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const query = "UPDATE applications SET status = ? WHERE application_id = ?";
  db.query(query, [status, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Status updated successfully" });
  });
};