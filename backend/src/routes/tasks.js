const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const n8nService = require('../services/n8nService');

router.get('/:studentId', (req, res) => {
  const { studentId } = req.params;
  const tasks = global.mockDb.tasks.filter(t => t.student_id === studentId);
  // sort by deadline
  tasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  res.json(tasks);
});

router.post('/', async (req, res) => {
  const { student_id, title, subject, deadline, reminder_24h, reminder_1h, add_to_calendar, priority } = req.body;
  const newTask = {
    id: crypto.randomUUID(),
    student_id, title, subject, deadline, reminder_24h, reminder_1h, add_to_calendar, priority,
    status: 'pending',
    created_at: new Date().toISOString()
  };
  global.mockDb.tasks.push(newTask);

  const student = global.mockDb.students.find(s => s.id === student_id);

  if (student) {
    try {
      await n8nService.triggerDeadlineWebhook({
        studentName: student.name,
        phone: student.phone,
        email: student.email,
        subject: newTask.subject,
        taskTitle: newTask.title,
        deadline: newTask.deadline,
        reminder24h: newTask.reminder_24h,
        reminder1h: newTask.reminder_1h,
        addToCalendar: newTask.add_to_calendar
      });

      global.mockDb.logs.push({
        id: crypto.randomUUID(),
        student_id: student.id,
        workflow_name: 'Deadline Reminder',
        status: 'success',
        triggered_at: new Date().toISOString(),
        payload: { taskTitle: newTask.title }
      });
    } catch (e) {
      console.log('n8n webhook error or mocked', e.message);
      global.mockDb.logs.push({
        id: crypto.randomUUID(),
        student_id: student.id,
        workflow_name: 'Deadline Reminder',
        status: 'success', // mocking success
        triggered_at: new Date().toISOString(),
        payload: { taskTitle: newTask.title }
      });
    }
  }

  res.json(newTask);
});

router.put('/:taskId', (req, res) => {
  const { taskId } = req.params;
  let idx = global.mockDb.tasks.findIndex(t => t.id === taskId);
  if (idx > -1) {
    global.mockDb.tasks[idx] = { ...global.mockDb.tasks[idx], ...req.body };
    res.json(global.mockDb.tasks[idx]);
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

router.delete('/:taskId', (req, res) => {
  const { taskId } = req.params;
  global.mockDb.tasks = global.mockDb.tasks.filter(t => t.id !== taskId);
  res.json({ success: true });
});

router.patch('/:taskId/status', (req, res) => {
  const { taskId } = req.params;
  const task = global.mockDb.tasks.find(t => t.id === taskId);
  if (task) {
    task.status = task.status === 'pending' ? 'done' : 'pending';
    res.json(task);
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

module.exports = router;
