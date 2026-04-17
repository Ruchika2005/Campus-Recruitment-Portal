const db = require("./src/config/db");
db.query("SHOW TABLES", (err, result) => {
  if (err) console.error(err);
  console.log("Tables:", result);
  db.query("DESCRIBE documents", (err, result) => {
    if (err) console.error("DESCRIBE error:", err);
    console.log("Documents Table:", result);
    process.exit(0);
  });
});
