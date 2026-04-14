const mysql = require("mysql2");
require("dotenv").config();

// ✅ CORRECT WAY to use DATABASE_URL
const db = mysql.createConnection(process.env.DATABASE_URL);

// ✅ Enable multiple statements separately (important for your tables)
db.config.namedPlaceholders = true;
db.config.multipleStatements = true;

db.connect((err) => {
  if (err) {
    console.log("❌ DB Connection Failed:", err);
  } else {
    console.log("✅ Connected to Railway MySQL");
  }
});

module.exports = db;