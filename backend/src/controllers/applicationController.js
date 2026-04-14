const db = require("../config/db");

exports.getStudentApplications = (req, res) => {
  const roll_no = req.params.roll_no;

  const query = `
    SELECT a.*, o.title, o.company_name
    FROM applications a
    JOIN opportunities o ON a.opportunity_id = o.opportunity_id
    WHERE a.roll_no = ?
  `;

  db.query(query, [roll_no], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};