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
    ORDER BY o.opportunity_id DESC
  `;
  db.query(query, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

exports.createOpportunity = (req, res) => {
  const { title, company_name, type, description, deadline, location, branch, year, min_cgpa } = req.body;

  db.beginTransaction((err) => {
    if (err) return res.status(500).json({ error: "Transaction start failed", details: err });

    const oppQuery = `INSERT INTO opportunities (title, company_name, type, description, deadline, location) VALUES (?, ?, ?, ?, ?, ?)`;
    db.query(oppQuery, [title, company_name, type, description, deadline, location || null], (err, oppResult) => {
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

        db.commit(async (err) => {
          if (err) {
            return db.rollback(() => res.status(500).json({ error: "Transaction commit failed", details: err }));
          }

          // Notify all students about new opportunity
          const emailSubject = `New Job Opportunity: ${title} at ${company_name}`;
          const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
              <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 30px; text-align: center;">
                <h1 style="margin: 0; font-size: 24px; letter-spacing: 0.5px;">New Recruitment Drive!</h1>
              </div>
              <div style="padding: 25px; color: #1f2937; background-color: white;">
                <div style="margin-bottom: 20px;">
                  <p style="font-size: 16px; margin: 0 0 10px 0;">A new opportunity has been posted:</p>
                  <div style="background-color: #f0fdf4; border-left: 4px solid #10b981; padding: 15px; border-radius: 4px;">
                    <p style="margin: 0; font-weight: bold; font-size: 18px; color: #065f46;">${company_name}</p>
                    <p style="margin: 5px 0 0 0; color: #047857; font-weight: 600;">${title}</p>
                  </div>
                </div>
                
                <div style="display: grid; gap: 10px; margin-bottom: 25px;">
                  <p style="margin: 0; font-size: 14px;"><strong style="color: #4b5563;">Type:</strong> <span style="text-transform: capitalize;">${type}</span></p>
                  <p style="margin: 0; font-size: 14px;"><strong style="color: #4b5563;">Deadline:</strong> ${deadline}</p>
                  <p style="margin: 0; font-size: 14px;"><strong style="color: #4b5563;">Location:</strong> ${location || 'N/A'}</p>
                </div>

                <div style="text-align: center;">
                  <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" style="background-color: #10b981; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);">View & Apply Now</a>
                </div>
              </div>
              <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #f3f4f6;">
                Don't miss the deadline! Make sure your profile is updated before applying.
              </div>
            </div>
          `;
          
          try {
            console.log(`[Opportunities] Triggering email broadcast...`);
            await broadcastToStudents(emailSubject, emailHtml);
          } catch (emailErr) {
            console.error("❌ Opportunity created but email broadcast failed:", emailErr.message);
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

  // Check deadline before allowing application
  const deadlineQuery = "SELECT deadline FROM opportunities WHERE opportunity_id = ?";
  db.query(deadlineQuery, [opportunity_id], (err, oppResults) => {
    if (err) return res.status(500).json({ error: err.message });
    if (oppResults.length === 0) return res.status(404).json({ error: "Opportunity not found" });

    const deadline = oppResults[0].deadline;
    if (deadline) {
      const now = new Date();
      now.setHours(0, 0, 0, 0); // compare by date only
      const deadlineDate = new Date(deadline);
      deadlineDate.setHours(0, 0, 0, 0);
      if (now > deadlineDate) {
        return res.status(403).json({ error: "Application deadline has passed. You can no longer apply for this opportunity." });
      }
    }

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