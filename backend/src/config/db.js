const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
  uri: process.env.DATABASE_URL,
  multipleStatements: true   // ✅ VERY IMPORTANT
});

db.connect((err) => {
  if (err) {
    console.log("❌ DB Connection Failed:", err);
  } else {
    console.log("✅ Connected to Railway MySQL");
  }
});

module.exports = db;