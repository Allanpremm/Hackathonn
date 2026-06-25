const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// Using mock DB because no keys provided
router.post('/register', (req, res) => {
  const { name, branch, year, subjects, phone, email } = req.body;
  const newStudent = {
    id: crypto.randomUUID(),
    name, branch, year, subjects, phone, email,
    created_at: new Date().toISOString()
  };
  global.mockDb.students.push(newStudent);
  
  const token = jwt.sign({ id: newStudent.id }, 'mock_secret');
  res.json({ student_id: newStudent.id, name: newStudent.name, token });
});

router.post('/login', (req, res) => {
  const { email } = req.body;
  const student = global.mockDb.students.find(s => s.email === email);
  if (!student) {
    // For demo purposes, auto-register if not found
    const newStudent = {
      id: crypto.randomUUID(),
      name: email.split('@')[0],
      branch: 'CSE',
      year: 1,
      subjects: ['Mock Subject'],
      phone: '1234567890',
      email: email,
      created_at: new Date().toISOString()
    };
    global.mockDb.students.push(newStudent);
    const token = jwt.sign({ id: newStudent.id }, 'mock_secret');
    return res.json({ student_id: newStudent.id, name: newStudent.name, token });
  }
  
  const token = jwt.sign({ id: student.id }, 'mock_secret');
  res.json({ student_id: student.id, name: student.name, token });
});

module.exports = router;
