const db = require("../config/db");

// GET student dashboard stats
exports.getDashboardStats = (req, res) => {
  const user_id = req.params.user_id;

  const query = `
    SELECT 
      (SELECT COUNT(*) FROM opportunities) AS total_opportunities,
      (SELECT COUNT(*) FROM applications WHERE roll_no = s.roll_no) AS applied,
      (SELECT COUNT(*) FROM applications WHERE status='shortlisted' AND roll_no = s.roll_no) AS shortlisted,
      (SELECT COUNT(*) FROM applications WHERE status='selected' AND roll_no = s.roll_no) AS selected
    FROM students s
    WHERE s.user_id = ?
  `;

  db.query(query, [user_id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result[0]);
  });
};

// GET PROFILE
exports.getProfile = (req, res) => {
  const user_id = req.params.user_id;

  const query = `
    SELECT u.name, u.email, s.*, d.file_url as resume
    FROM users u
    JOIN students s ON u.user_id = s.user_id
    LEFT JOIN documents d ON s.roll_no = d.roll_no AND d.doc_type = 'resume'
    WHERE u.user_id = ?
  `;

  db.query(query, [user_id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result[0]);
  });
};

// UPDATE PROFILE
exports.updateProfile = (req, res) => {
  const user_id = req.params.user_id;
  const { cgpa, year } = req.body;

  const query = `
    UPDATE students 
    SET cgpa = ?, year = ?
    WHERE user_id = ?
  `;

  db.query(query, [cgpa, year, user_id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Profile updated successfully" });
  });
};

// UPDATE RESUME
exports.updateResume = (req, res) => {
  console.log("UPDATE RESUME HIT! user_id:", req.params.user_id);
  const user_id = req.params.user_id;
  const file = req.files && req.files.length > 0 ? req.files[0] : null;
  console.log("req.files:", req.files);
  
  if (!file) {
    console.log("No file uploaded");
    return res.status(400).json({ message: "No file uploaded" });
  }

  const fileUrl = '/uploads/resumes/' + file.filename;
  console.log("fileUrl:", fileUrl);

  db.query("SELECT roll_no FROM students WHERE user_id = ?", [user_id], (err, result) => {
    if (err) {
      console.log("Select roll_no error:", err);
      return res.status(500).json(err);
    }
    if (result.length === 0) {
      console.log("Student not found");
      return res.status(404).json({ message: "Student not found" });
    }

    const roll_no = result[0].roll_no;
    console.log("roll_no:", roll_no);

    // Check if document exists
    db.query("SELECT * FROM documents WHERE roll_no = ? AND doc_type = 'resume'", [roll_no], (chkErr, chkRes) => {
      if (chkErr) return res.status(500).json(chkErr);

      if (chkRes.length > 0) {
        // UPDATE
        console.log("Updating existing document for roll_no:", roll_no);
        db.query("UPDATE documents SET file_url = ? WHERE roll_no = ? AND doc_type = 'resume'", [fileUrl, roll_no], (updErr) => {
           if (updErr) {
             console.log("Update document error:", updErr);
             return res.status(500).json(updErr);
           }
           console.log("Document updated successfully");
           res.json({ message: "Resume updated successfully", resume: fileUrl });
        });
      } else {
        // INSERT
        console.log("Inserting new document for roll_no:", roll_no);
        db.query("INSERT INTO documents (roll_no, doc_type, file_url) VALUES (?, 'resume', ?)", [roll_no, fileUrl], (insErr) => {
           if (insErr) {
             console.log("Insert document error:", insErr);
             return res.status(500).json(insErr);
           }
           console.log("Document inserted successfully");
           res.json({ message: "Resume uploaded successfully", resume: fileUrl });
        });
      }
    });
  });
};

// DELETE RESUME
exports.deleteResume = (req, res) => {
  const user_id = req.params.user_id;

  db.query("SELECT roll_no FROM students WHERE user_id = ?", [user_id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.length === 0) return res.status(404).json({ message: "Student not found" });

    const roll_no = result[0].roll_no;

    db.query("DELETE FROM documents WHERE roll_no = ? AND doc_type = 'resume'", [roll_no], (delErr) => {
      if (delErr) return res.status(500).json(delErr);
      res.json({ message: "Resume deleted successfully" });
    });
  });
};


// GET ANNOUNCEMENTS
exports.getAnnouncements = (req, res) => {
  db.query("SELECT * FROM announcements", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};


// GET SELECTED STUDENTS
exports.getSelected = (req, res) => {
  const query = `
    SELECT a.*, u.name, s.branch, s.cgpa, o.title, o.company_name, o.type
    FROM applications a
    JOIN students s ON a.roll_no = s.roll_no
    JOIN users u ON s.user_id = u.user_id
    JOIN opportunities o ON a.opportunity_id = o.opportunity_id
    WHERE a.status = 'selected'
    ORDER BY o.deadline DESC, a.application_id DESC
  `;

  db.query(query, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};