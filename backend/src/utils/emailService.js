const nodemailer = require("nodemailer");
const db = require("../config/db");
require("dotenv").config();

let transporterPromise = null;

async function getTransporter() {
  if (transporterPromise) return transporterPromise;

  transporterPromise = (async () => {
    if (!process.env.EMAIL_USER || process.env.EMAIL_USER === "your-email@gmail.com") {
      const testAccount = await nodemailer.createTestAccount();
      const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log("⚠️ Using Test Email Account (Ethereal). Real emails won't be sent to inboxes.");
      return transporter;
    } else {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      return transporter;
    }
  })();

  return transporterPromise;
}

/**
 * Send an email to a specific recipient
 */
const sendEmail = async (to, subject, html) => {
  console.log(`\n--- 📧 EMAIL NOTIFICATION TRIGGERED ---`);
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`---------------------------------------\n`);

  try {
    const transporter = await getTransporter();
    const info = await transporter.sendMail({
      from: `"Campus Recruitment Portal" <${process.env.EMAIL_USER || "test@campus.com"}>`,
      to,
      subject,
      html,
    });
    console.log("✅ Email sent successfully!");
    
    // Provide a preview URL for test accounts
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log("🔗 Preview URL: %s", previewUrl);
    }

    return info;
  } catch (error) {
    console.error("❌ Email delivery failed (Check your SMTP credentials in .env):", error.message);
    return null;
  }
};

/**
 * Send an email to all registered students
 */
const broadcastToStudents = async (subject, html) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT email FROM users WHERE role = 'student'";
    db.query(query, async (err, results) => {
      if (err) {
        console.error("Error fetching student emails:", err);
        return resolve(null);
      }

      if (results.length === 0) return resolve(null);

      const emails = results.map(r => r.email);
      
      console.log(`\n--- 📧 BROADCAST NOTIFICATION TRIGGERED ---`);
      console.log(`To: (BCC All Students)`);
      console.log(`Subject: ${subject}`);
      console.log(`-------------------------------------------\n`);

      try {
        const transporter = await getTransporter();
        const info = await transporter.sendMail({
          from: `"Campus Recruitment Portal" <${process.env.EMAIL_USER}>`,
          to: process.env.EMAIL_USER, // Send to self
          bcc: emails,               // All students in BCC
          subject,
          html,
        });
        console.log("✅ Broadcast delivered successfully!");
        return resolve(info);
      } catch (error) {
        console.error("❌ Broadcast failed:", error.message);
        return resolve(null);
      }
    });
  });
};

module.exports = {
  sendEmail,
  broadcastToStudents,
};
