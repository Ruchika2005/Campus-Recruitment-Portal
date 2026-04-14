const db = require("../config/db");

// ================= REGISTER (ONLY USERS TABLE) =================
exports.registerStudent = (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  const query = `
    INSERT INTO users (name, email, password, role)
    VALUES (?, ?, ?, 'student')
  `;

  db.query(query, [name, email, password], (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ message: "Email already exists" });
      }
      return res.status(500).json({ message: "Error registering user" });
    }

    return res.json({
      message: "User registered successfully",
      user_id: result.insertId
    });
  });
};



// ================= COMPLETE PROFILE =================
exports.completeProfile = (req, res) => {
  const {
    user_id,
    roll_no,
    branch,
    year,
    cgpa,
    skills,
    projects
  } = req.body;

  if (!user_id || !roll_no || !branch || !year || !cgpa) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const query = `
    INSERT INTO students 
    (roll_no, user_id, branch, year, cgpa, skills, projects)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [roll_no, user_id, branch, year, cgpa, skills, projects],
    (err) => {
      if (err) {
        return res.status(500).json({ message: "Profile creation failed" });
      }

      // after insert success
db.query(
  "SELECT user_id, name, role FROM users WHERE user_id = ?",
  [user_id],
  (err, userResult) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching user" });
    }

    return res.json({
      message: "Profile completed successfully",
      user: userResult[0]
    });
  }
);
    }
  );
};



// ================= LOGIN =================
exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  const query = `
    SELECT user_id, name, email, role
    FROM users
    WHERE email = ? AND password = ?
  `;

  db.query(query, [email, password], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Server error" });
    }

    if (result.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result[0];

    return res.json({
      message: "Login successful",
      user
    });
  });
};