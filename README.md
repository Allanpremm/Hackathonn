# CampusFlow 🎓

AI-powered student productivity platform built for **CampusAI Hackathon 2025**.

## Features
- 📅 Smart Deadline Manager with WhatsApp + Google Calendar automation via n8n
- 🧠 AI Study Buddy — generates flashcards & MCQ quizzes from lecture notes
- 📣 Notice Summarizer — AI TL;DR broadcast to WhatsApp groups
- 📊 Attendance Alerter with risk analysis
- 💼 Placement Tracker
- 🤝 Study Group Scheduler
- ⚙️ Live n8n Automation Logs

## Tech Stack
- **Frontend**: React 18 + Vite + Tailwind CSS v4
- **Backend**: Node.js + Express
- **AI**: Groq API (Llama 3)
- **Automation**: n8n (WhatsApp via Twilio + Google Calendar)
- **DB**: Supabase (PostgreSQL) — in-memory mock for demo

## Setup

### Backend
```bash
cd campusflow/backend
npm install
# Copy .env.example and fill in your keys
node src/index.js
```

### Frontend
```bash
cd campusflow/frontend
npm install
npm run dev
```

### Environment Variables (backend/.env)
```
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
GROQ_API_KEY=your_groq_api_key
N8N_DEADLINE_WEBHOOK=https://your-n8n-instance/webhook/deadline-reminder
N8N_NOTICE_WEBHOOK=https://your-n8n-instance/webhook/notice-broadcast
JWT_SECRET=your_jwt_secret_here
```

## Demo
1. Run backend on port 5000
2. Run frontend on port 5173
3. Visit `http://localhost:5173`
4. Click **Demo Login** to enter with pre-seeded data

*Built for CampusAI Hackathon 2025 | Dept. of CSE*
