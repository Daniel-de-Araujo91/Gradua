const jwt = require('jsonwebtoken');
const secret = '5fd62fa956db63bd928fcb446de39b87b80dc8ba';
const token = jwt.sign({
  sub: '23456789012'
}, secret, { expiresIn: '1h', issuer: 'gradua' });

async function run() {
  const res = await fetch('http://localhost:8080/announcements/student', {
    headers: { 'Authorization': 'Bearer ' + token }
  });
  console.log("Status:", res.status);
  const data = await res.text();
  console.log("Body:", data);
}
run();
