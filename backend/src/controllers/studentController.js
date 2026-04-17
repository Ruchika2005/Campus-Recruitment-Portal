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
    SELECT u.name, u.email, s.*
    FROM users u
    JOIN students s ON u.user_id = s.user_id
    WHERE u.user_id = ?
  `;

  db.query(query, [user_id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result[0]);
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