const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

const crypto = require('crypto');

// Setup Mock DB in memory (since no Supabase variables)
const studentId = '11111111-2222-3333-4444-555555555555';
global.mockDb = {
  students: [{
    id: studentId,
    name: 'Allan Developer',
    branch: 'CSE',
    year: 1,
    subjects: ['OS', 'DBMS', 'CN'],
    phone: '917906514497',
    email: 'allan@example.com',
    created_at: new Date().toISOString()
  }],
  tasks: [
    {
      id: crypto.randomUUID(),
      student_id: studentId,
      title: 'B-Tree Implementation in C++',
      subject: 'DBMS',
      deadline: new Date(Date.now() + 5 * 3600 * 1000).toISOString(), // due in 5 hours
      reminder_24h: true,
      reminder_1h: true,
      add_to_calendar: true,
      priority: 'high',
      status: 'pending',
      created_at: new Date().toISOString()
    },
    {
      id: crypto.randomUUID(),
      student_id: studentId,
      title: 'OS Process Scheduling Assignment',
      subject: 'OS',
      deadline: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString(), // due in 2 days
      reminder_24h: true,
      reminder_1h: true,
      add_to_calendar: true,
      priority: 'medium',
      status: 'pending',
      created_at: new Date().toISOString()
    },
    {
      id: crypto.randomUUID(),
      student_id: studentId,
      title: 'Computer Networks Lab Record',
      subject: 'CN',
      deadline: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(), // overdue 1 day
      reminder_24h: true,
      reminder_1h: false,
      add_to_calendar: true,
      priority: 'low',
      status: 'pending',
      created_at: new Date().toISOString()
    }
  ],
  logs: [
    {
      id: crypto.randomUUID(),
      student_id: studentId,
      workflow_name: 'Deadline Reminder',
      status: 'success',
      triggered_at: new Date(Date.now() - 3600 * 1000).toISOString(),
      payload: { taskTitle: 'B-Tree Implementation in C++' }
    }
  ],
  attendance: []
};

// Routes
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const aiRoutes = require('./routes/ai');
const noticeRoutes = require('./routes/notices');
const logRoutes = require('./routes/logs');

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/logs', logRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok', n8nLive: true }));

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
