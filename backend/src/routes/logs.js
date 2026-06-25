const express = require('express');
const router = express.Router();

router.get('/:studentId', (req, res) => {
  const { studentId } = req.params;
  const logs = global.mockDb.logs
    .filter(l => l.student_id === studentId)
    .sort((a, b) => new Date(b.triggered_at) - new Date(a.triggered_at))
    .slice(0, 20);
  res.json(logs);
});

module.exports = router;
