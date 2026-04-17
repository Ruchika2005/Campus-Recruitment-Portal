const db = require("../config/db");

// DASHBOARD STATS
exports.getTNPStats = (req, res) => {
  const query = `
    SELECT
      (SELECT COUNT(*) FROM students) AS total_students,
      (SELECT COUNT(*) FROM opportunities) AS total_opportunities,
      (SELECT COUNT(*) FROM applications) AS total_applications,
      (
        SELECT ROUND(
          (COUNT(*) / (SELECT COUNT(*) FROM students)) * 100
        )
        FROM selections
      ) AS placement_rate
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