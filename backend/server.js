const express = require("express");
const cors = require("cors");
const db = require("./src/config/db");

const app = express();
const PORT = 5000;

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= ROUTES =================
const authRoutes = require("./src/routes/authRoutes");
app.use("/api/auth", authRoutes);

const studentRoutes = require("./src/routes/studentRoutes");
const opportunityRoutes = require("./src/routes/opportunityRoutes");
const applicationRoutes = require("./src/routes/applicationRoutes");
const tnpRoutes = require("./src/routes/tnpRoutes");


app.use("/api/student", studentRoutes);
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/tnp", tnpRoutes);

// ================= TEST ROUTE =================
app.get("/", (req, res) => {
  res.send("Server running");
});

// ================= CREATE TABLES (FOR DEMO) =================
const createTables = () => {
  const query = `
  CREATE TABLE IF NOT EXISTS users (
      user_id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role ENUM('student', 'admin') NOT NULL DEFAULT 'student',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS students (
      roll_no VARCHAR(20) PRIMARY KEY,
      user_id INT UNIQUE,
      branch VARCHAR(50),
      year INT,
      cgpa DECIMAL(3,2),
      skills TEXT,
      projects TEXT,
      FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS opportunities (
      opportunity_id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(100),
      company_name VARCHAR(100),
      type ENUM('internship', 'placement', 'hackathon', 'program'),
      description TEXT,
      deadline DATE
  );

  CREATE TABLE IF NOT EXISTS opportunity_eligibility (
      eligibility_id INT AUTO_INCREMENT PRIMARY KEY,
      opportunity_id INT,
      branch VARCHAR(50),
      year INT,
      min_cgpa DECIMAL(3,2),
      FOREIGN KEY (opportunity_id) REFERENCES opportunities(opportunity_id)
  );

  CREATE TABLE IF NOT EXISTS documents (
      document_id INT AUTO_INCREMENT PRIMARY KEY,
      roll_no VARCHAR(20),
      doc_type ENUM('resume', 'marksheet', 'certificate', 'other'),
      file_url VARCHAR(255),
      FOREIGN KEY (roll_no) REFERENCES students(roll_no) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS applications (
      application_id INT AUTO_INCREMENT PRIMARY KEY,
      roll_no VARCHAR(20),
      opportunity_id INT,
      status ENUM('applied','shortlisted','selected','rejected') DEFAULT 'applied',
      UNIQUE(roll_no, opportunity_id),
      FOREIGN KEY (roll_no) REFERENCES students(roll_no),
      FOREIGN KEY (opportunity_id) REFERENCES opportunities(opportunity_id)
  );

  CREATE TABLE IF NOT EXISTS announcements (
      announcement_id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(100),
      message TEXT
  );

  CREATE TABLE IF NOT EXISTS selections (
      selection_id INT AUTO_INCREMENT PRIMARY KEY,
      roll_no VARCHAR(20),
      opportunity_id INT,
      FOREIGN KEY (roll_no) REFERENCES students(roll_no),
      FOREIGN KEY (opportunity_id) REFERENCES opportunities(opportunity_id)
  );
  `;

  db.query(query, (err) => {
    if (err) {
      console.log("❌ Error creating tables:", err);
    } else {
      console.log("✅ Tables ready");
    }
  });
};

// ================= SAFE ADMIN INSERT =================
const insertAdmin = () => {
  const query = `
    INSERT INTO users (name, email, password, role)
    SELECT 'TNP Admin', 'admin@college.com', 'admin123', 'admin'
    WHERE NOT EXISTS (
      SELECT 1 FROM users WHERE email = 'admin@college.com'
    )
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.log("❌ Admin insert error:", err);
    } else {
      if (result.affectedRows === 0) {
        console.log("ℹ️ Admin already exists");
      } else {
        console.log("✅ Admin created");
      }
    }
  });
};

// ================= INITIAL SETUP =================
insertAdmin();

// Uncomment ONLY if you want to create tables manually
// createTables();

// ================= START SERVER =================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

