const { broadcastToStudents } = require("../src/utils/emailService");
const db = require("../src/config/db");

async function test() {
  console.log("Testing broadcastToStudents...");
  try {
    const info = await broadcastToStudents("Announcement Test", "<h3>This is a test announcement</h3><p>Message goes here.</p>");
    console.log("Result:", info ? "Success" : "Failed");
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

test();
