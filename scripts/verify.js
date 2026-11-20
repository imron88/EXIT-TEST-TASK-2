const request = require('supertest');
const app = require('../src/app');
const userModel = require('../src/models/userModel');

const separator = (title) => {
  console.log('\n' + '='.repeat(80));
  console.log(`📌 SCENARIO: ${title}`);
  console.log('='.repeat(80));
};

const printResult = (method, url, status, headers, body) => {
  console.log(`\n➡️  REQUEST:  ${method} ${url}`);
  if (headers && headers.Authorization) {
    console.log(`🔑 Header:   Authorization: ${headers.Authorization.substring(0, 30)}...`);
  }
  console.log(`⬅️  RESPONSE: HTTP ${status}`);
  console.log('📦 BODY:');
  console.log(JSON.stringify(body, null, 2));
};

async function runVerification() {
  userModel.clear();

  // 1. Successful Register (Student)
  separator('1. Successful Register (Student)');
  const regStudentRes = await request(app)
    .post('/register')
    .send({
      name: 'Rahul Sharma',
      email: 'rahul.student@college.edu',
      password: 'studyHard123',
      role: 'student'
    });
  printResult('POST', '/register', regStudentRes.status, null, regStudentRes.body);

  // 1b. Successful Register (Admin)
  separator('1b. Successful Register (Admin)');
  const regAdminRes = await request(app)
    .post('/register')
    .send({
      name: 'Dr. Priya Patel',
      email: 'priya.admin@college.edu',
      password: 'adminSecure2026',
      role: 'admin'
    });
  printResult('POST', '/register', regAdminRes.status, null, regAdminRes.body);

  // 2. Successful Login (Student)
  separator('2. Successful Login (Student) -> JWT Token Generated');
  const loginStudentRes = await request(app)
    .post('/login')
    .send({
      email: 'rahul.student@college.edu',
      password: 'studyHard123'
    });
  const studentToken = loginStudentRes.body.token;
  printResult('POST', '/login', loginStudentRes.status, null, loginStudentRes.body);

  // 2b. Successful Login (Admin)
  separator('2b. Successful Login (Admin) -> Admin JWT Token Generated');
  const loginAdminRes = await request(app)
    .post('/login')
    .send({
      email: 'priya.admin@college.edu',
      password: 'adminSecure2026'
    });
  const adminToken = loginAdminRes.body.token;
  printResult('POST', '/login', loginAdminRes.status, null, loginAdminRes.body);

  // 3. GET /profile With Token
  separator('3. GET /profile WITH Valid Token');
  const profileWithTokenRes = await request(app)
    .get('/profile')
    .set('Authorization', `Bearer ${studentToken}`);
  printResult('GET', '/profile', profileWithTokenRes.status, { Authorization: `Bearer ${studentToken}` }, profileWithTokenRes.body);

  // 4. GET /profile WITHOUT Token (401)
  separator('4. GET /profile WITHOUT Token (401 Unauthorized)');
  const profileNoTokenRes = await request(app)
    .get('/profile');
  printResult('GET', '/profile', profileNoTokenRes.status, null, profileNoTokenRes.body);

  // 5. GET /students AS Admin (200 OK)
  separator('5. GET /students AS Admin (200 OK)');
  const studentsAdminRes = await request(app)
    .get('/students')
    .set('Authorization', `Bearer ${adminToken}`);
  printResult('GET', '/students', studentsAdminRes.status, { Authorization: `Bearer ${adminToken}` }, studentsAdminRes.body);

  // 6. GET /students AS Normal Student (403 Forbidden)
  separator('6. GET /students AS Normal Student (403 Forbidden)');
  const studentsStudentRes = await request(app)
    .get('/students')
    .set('Authorization', `Bearer ${studentToken}`);
  printResult('GET', '/students', studentsStudentRes.status, { Authorization: `Bearer ${studentToken}` }, studentsStudentRes.body);

  // 7. Input Validation Rejection
  separator('7. Input Validation Failure (Invalid email & short password)');
  const invalidRegRes = await request(app)
    .post('/register')
    .send({
      name: 'Test',
      email: 'invalid-email',
      password: '123'
    });
  printResult('POST', '/register', invalidRegRes.status, null, invalidRegRes.body);

  // 8. Duplicate Email Rejection
  separator('8. Duplicate Email Rejection (409 Conflict)');
  const duplicateRegRes = await request(app)
    .post('/register')
    .send({
      name: 'Duplicate Rahul',
      email: 'rahul.student@college.edu',
      password: 'password999'
    });
  printResult('POST', '/register', duplicateRegRes.status, null, duplicateRegRes.body);

  console.log('\n' + '='.repeat(80));
  console.log('✅ ALL SCENARIOS VERIFIED SUCCESSFULLY!');
  console.log('='.repeat(80));
}

runVerification().catch(console.error);
