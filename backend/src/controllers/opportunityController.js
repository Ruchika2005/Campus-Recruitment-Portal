const db = require("../config/db");
const { sendEmail, broadcastToStudents } = require("../utils/emailService");

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

          // Notify all students about new opportunity
          const emailSubject = `New Job Opportunity: ${title} at ${company_name}`;
          const emailHtml = `
            <h3>New Recruitment Drive!</h3>
            <p><strong>Company:</strong> ${company_name}</p>
            <p><strong>Role:</strong> ${title}</p>
            <p><strong>Deadline:</strong> ${deadline}</p>
            <hr/>
            <p>Check the Campus Recruitment Portal for eligibility and to apply.</p>
          `;
          broadcastToStudents(emailSubject, emailHtml);

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
    SELECT a.*, u.name, s.branch, s.cgpa, o.title, o.company_name, o.type, d.file_url as resume
    FROM applications a
    JOIN students s ON a.roll_no = s.roll_no
    JOIN users u ON s.user_id = u.user_id
    JOIN opportunities o ON a.opportunity_id = o.opportunity_id
    LEFT JOIN documents d ON s.roll_no = d.roll_no AND d.doc_type = 'resume'
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

    // Fetch student email and opportunity details for notification
    const detailQuery = `
      SELECT u.email, u.name, o.company_name, o.title, o.type, a.roll_no
      FROM applications a
      JOIN students s ON a.roll_no = s.roll_no
      JOIN users u ON s.user_id = u.user_id
      JOIN opportunities o ON a.opportunity_id = o.opportunity_id
      WHERE a.application_id = ?
    `;
    
    db.query(detailQuery, [id], (detailErr, detailRes) => {
      if (detailErr) {
        console.error("❌ Error fetching student details for email:", detailErr);
        return;
      }
      
      if (detailRes.length > 0) {
        const student = detailRes[0];
        const emailSubject = `Application Update: ${student.company_name}`;
        const emailHtml = `
          <h3>Hello ${student.name},</h3>
          <p>Your application for <strong>${student.title}</strong> at <strong>${student.company_name}</strong> has been updated.</p>
          <p>New Status: <strong style="text-transform: uppercase; color: #4f46e5;">${status}</strong></p>
          <hr/>
          <p>Log in to the portal to see more details.</p>
        `;
        sendEmail(student.email, emailSubject, emailHtml);

        // Auto-update student placement/internship flags if selected
        if (status === 'selected') {
          const flagColumn = student.type === 'placement' ? 'is_placed' : (student.type === 'internship' ? 'is_intern' : null);
          if (flagColumn) {
            db.query(`UPDATE students SET ${flagColumn} = 1 WHERE roll_no = ?`, [student.roll_no]);
          }
        }
      } else {
        console.log("ℹ️ No student found for notification (ID: %s)", id);
      }
    });

    res.json({ message: "Status updated successfully" });
  });
};