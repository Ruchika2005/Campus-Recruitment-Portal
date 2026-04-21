const db = require("../config/db");
const { broadcastToStudents } = require("../utils/emailService");

// DASHBOARD STATS
exports.getTNPStats = (req, res) => {
  const mainStatsQuery = `
    SELECT
      (SELECT COUNT(*) FROM students) AS total_students,
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

  const branch2026Query = `
    SELECT branch, COUNT(*) as total, SUM(CASE WHEN is_placed = 1 THEN 1 ELSE 0 END) as placed
    FROM students
    WHERE year = '2026'
    GROUP BY branch;
  `;

  const branch2027Query = `
    SELECT branch, COUNT(*) as total, SUM(CASE WHEN is_intern = 1 THEN 1 ELSE 0 END) as interned
    FROM students
    WHERE year = '2027'
    GROUP BY branch;
  `;

  db.query(mainStatsQuery, (err, stats) => {
    if (err) return res.status(500).json(err);
    
    db.query(branch2026Query, (err2, stats2026) => {
      if (err2) return res.status(500).json(err2);
      
      db.query(branch2027Query, (err3, stats2027) => {
        if (err3) return res.status(500).json(err3);
        
        res.json({
          ...stats[0],
          batch_2026_stats: stats2026,
          batch_2027_stats: stats2027
        });
      });
    });
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
exports.createAnnouncement = async (req, res) => {
  const { title, message } = req.body;
  if (!title || !message) return res.status(400).json({ error: "Title and message are required" });

  const query = "INSERT INTO announcements (title, message) VALUES (?, ?)";
  db.query(query, [title, message], async (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    
    // Notify all students
    const emailSubject = `New Announcement: ${title}`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <div style="background-color: #4f46e5; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">Campus Update</h1>
        </div>
        <div style="padding: 20px; color: #333; line-height: 1.6;">
          <h2 style="color: #4f46e5;">${title}</h2>
          <p>${message}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;"/>
          <p style="font-size: 14px; color: #666;">Please log in to the <strong>Campus Recruitment Portal</strong> to stay updated with latest information.</p>
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Go to Portal</a>
          </div>
        </div>
        <div style="background-color: #f9fafb; padding: 15px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e0e0e0;">
          This is an automated notification from the T&P Cell.
        </div>
      </div>
    `;

    try {
      console.log(`[Announcements] Triggering email broadcast...`);
      await broadcastToStudents(emailSubject, emailHtml);
    } catch (emailErr) {
      console.error("❌ Announcement created but email broadcast failed:", emailErr.message);
      // We still return success since the announcement was saved to DB
    }

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