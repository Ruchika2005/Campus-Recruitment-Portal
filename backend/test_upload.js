const fs = require('fs');
// Create a fake file
fs.writeFileSync('dummy.pdf', 'dummy content');

const FormData = require('form-data');
const form = new FormData();
form.append('resume', fs.createReadStream('dummy.pdf'));

fetch('http://localhost:5000/api/student/profile/21/resume', {
  method: 'PUT',
  body: form,
  headers: form.getHeaders()
})
.then(res => res.json().then(data => ({status: res.status, body: data})))
.then(res => console.log('Response:', res))
.catch(err => console.error('Error:', err));
