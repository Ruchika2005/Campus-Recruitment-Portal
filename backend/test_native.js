async function runTest() {
  try {
    // 1. Register user
    const email = `test${Date.now()}@test.com`;
    let res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test User', email, password: 'password123' })
    });
    const regData = await res.json();
    console.log("Register:", regData);
    const user_id = regData.user_id;

    // 2. Complete Profile
    const formData = new FormData();
    formData.append('user_id', user_id);
    formData.append('roll_no', 'TEST' + Date.now());
    formData.append('branch', 'Comp');
    formData.append('year', '2025');
    formData.append('cgpa', '9.0');
    
    // Append a file
    const fileBlob = new Blob(['dummy pdf content'], { type: 'application/pdf' });
    formData.append('resume', fileBlob, 'resume.pdf');

    console.log("Submitting complete profile...");
    res = await fetch('http://localhost:5000/api/auth/complete-profile', {
      method: 'POST',
      body: formData
    });
    const compData = await res.json();
    console.log("Complete Profile:", compData);

    // 3. Update Resume
    console.log("Updating resume...");
    const updateFormData = new FormData();
    const updateFileBlob = new Blob(['updated pdf content'], { type: 'application/pdf' });
    updateFormData.append('resume', updateFileBlob, 'updated.pdf');

    res = await fetch(`http://localhost:5000/api/student/profile/${user_id}/resume`, {
      method: 'PUT',
      body: updateFormData
    });
    const updateData = await res.json();
    console.log("Update Resume:", updateData);

    // 4. Check documents table again
    const db = require('./src/config/db');
    db.query("SELECT * FROM documents WHERE roll_no = ?", [formData.get('roll_no')], (err, result) => {
      if (err) console.error("DB Error:", err);
      console.log("Documents Table after update:", result);
      process.exit(0);
    });

  } catch (err) {
    console.error("Test Error:", err);
    process.exit(1);
  }
}

runTest();
