const db = require("../config/db");
const { broadcastToStudents } = require("../utils/emailService");

// DASHBOARD STATS
exports.getTNPStats = (req, res) => {
  const query = `
    SELECT
      (SELECT COUNT(*) FROM students WHERE year = '2026') AS total_2026,
      (SELECT COUNT(*) FROM students WHERE year = '2027') AS total_2027,
      (SELECT COUNT(*) FROM opportunities) AS total_opportunities,
      (SELECT COUNT(*) FROM applications) AS total_applications,
      (
        SELECT ROUND((COUNT(*) / (SELECT GREATEST(COUNT(*), 1) FROM students WHERE year = '2026')) * 100)
        FROM students
        WHERE year = '2026' AND is_placed = 1
      ) AS placement_rate,
      (
        SELECT ROUND((COUNT(*) / (SELECT GREATEST(COUNT(*), 1) FROM students WHERE year = '2027')) * 100)
        FROM students
        WHERE year = '2027' AND is_intern = 1
      ) AS internship_rate
  `;

  db.query(query, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result[0]);
  });
};


// RECENT APPLICATIONS
exports.getRecentApplications = (req, res) => {
  const query = `
    SELECT u.name AS student, o.company_name, o.title AS role, a.created_at
    FROM applications a
    JOIN students s ON a.roll_no = s.roll_no
    JOIN users u ON s.user_id = u.user_id
    JOIN opportunities o ON a.opportunity_id = o.opportunity_id
    ORDER BY a.application_id DESC
    LIMIT 5
  `;

  db.query(query, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};


// TOP COMPANIES
exports.getTopCompanies = (req, res) => {
  const query = `
    SELECT 
      o.company_name,
      COUNT(a.application_id) AS applications,
      COUNT(s.selection_id) AS selected
    FROM opportunities o
    LEFT JOIN applications a ON o.opportunity_id = a.opportunity_id
    LEFT JOIN selections s ON o.opportunity_id = s.opportunity_id
    GROUP BY o.company_name
    ORDER BY applications DESC
    LIMIT 5
  `;

  db.query(query, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

// CREATE ANNOUNCEMENT
exports.createAnnouncement = (req, res) => {
  const { title, message } = req.body;
  if (!title || !message) return res.status(400).json({ error: "Title and message are required" });

  const query = "INSERT INTO announcements (title, message) VALUES (?, ?)";
  db.query(query, [title, message], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    
    // Notify all students
    const emailSubject = `New Announcement: ${title}`;
    const emailHtml = `
      <h3>New Announcement from T&P Cell</h3>
      <p><strong>${title}</strong></p>
      <p>${message}</p>
      <hr/>
      <p>Please log in to the portal for more details.</p>
    `;
    broadcastToStudents(emailSubject, emailHtml);

    res.status(201).json({ message: "Announcement created", id: result.insertId });
  });
};

// DELETE ANNOUNCEMENT
exports.deleteAnnouncement = (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM announcements WHERE announcement_id = ?";
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Announcement deleted" });
  });
};

// GET ALL STUDENTS
exports.getAllStudents = (req, res) => {
  const query = `
    SELECT 
      u.name, 
      u.email, 
      s.roll_no, 
      s.branch, 
      s.year, 
      s.cgpa,
      (SELECT COUNT(*) FROM applications WHERE roll_no = s.roll_no) AS app_count
    FROM users u
    JOIN students s ON u.user_id = s.user_id
    ORDER BY s.roll_no ASC
  `;

  db.query(query, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

// GET STUDENT ACTIVITY
exports.getStudentActivity = (req, res) => {
  const { roll_no } = req.params;
  const query = `
    SELECT o.company_name, o.title, a.status, a.created_at
    FROM applications a
    JOIN opportunities o ON a.opportunity_id = o.opportunity_id
    WHERE a.roll_no = ?
    ORDER BY a.created_at DESC
  `;

  db.query(query, [roll_no], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};