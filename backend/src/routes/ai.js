const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');

router.post('/summarize', async (req, res) => {
  const { text } = req.body;
  try {
    const prompt = `Summarise this college notice in exactly 3 bullet points. Return JSON: { "bullets": ["string", "string", "string"] }\n\nNotice: ${text}`;
    const result = await aiService.callAI(prompt);
    res.json(result);
  } catch (e) {
    console.error(e);
    res.json({ bullets: ["Mocked bullet 1", "Mocked bullet 2", "Mocked bullet 3"] });
  }
});

router.post('/flashcards', async (req, res) => {
  const { notes, subject } = req.body;
  try {
    const prompt = `From these lecture notes on ${subject}, generate 8 flashcard pairs. Return JSON: { "cards": [{ "question": "string", "answer": "string" }] }\n\nNotes: ${notes}`;
    const result = await aiService.callAI(prompt);
    res.json(result);
  } catch (e) {
    console.error(e);
    res.json({ cards: [ { question: "What is AI?", answer: "Artificial Intelligence" }, { question: "Who is the mock?", answer: "I am." } ] });
  }
});

router.post('/quiz', async (req, res) => {
  const { notes, subject } = req.body;
  try {
    const prompt = `Generate 5 MCQ questions from these notes on ${subject}. Return JSON: { "questions": [{ "question": "string", "options": ["A", "B", "C", "D"], "answer": "string" }] }\n\nNotes: ${notes}`;
    const result = await aiService.callAI(prompt);
    res.json(result);
  } catch (e) {
    res.json({ questions: [{ question: "Mock question?", options: ["A", "B", "C", "D"], answer: "A" }] });
  }
});

router.post('/study-plan', async (req, res) => {
  const { taskTitle, subject, deadline, currentDate } = req.body;
  try {
    const prompt = `Create a day-by-day study plan for '${taskTitle}' in ${subject}. Deadline: ${deadline}. Today: ${currentDate}. Return JSON: { "plan": [{ "day": "Mon 20 Jun", "task": "string" }] }`;
    const result = await aiService.callAI(prompt);
    res.json(result);
  } catch (e) {
    res.json({ plan: [{ day: "Today", task: "Start researching" }, { day: "Tomorrow", task: "Write code" }] });
  }
});

router.post('/attendance', async (req, res) => {
  const { attendance } = req.body;
  try {
    const prompt = `Analyse attendance and return risk level per subject + advice. Return JSON: { "analysis": [{ "subject": "string", "percent": 0, "risk": "High/Medium/Low", "classesNeeded": 0, "advice": "string" }] }\n\nAttendance: ${JSON.stringify(attendance)}`;
    const result = await aiService.callAI(prompt);
    res.json(result);
  } catch (e) {
    res.json({ analysis: [{ subject: "Mock Subject", percent: 65, risk: "High", classesNeeded: 5, advice: "Attend next 5 classes." }] });
  }
});

router.get('/tip', async (req, res) => {
  try {
    const prompt = `Give one actionable study productivity tip for a B.Tech student. Max 2 sentences. Be specific, not generic. Return JSON: { "tip": "string" }`;
    const result = await aiService.callAI(prompt);
    res.json(result);
  } catch (e) {
    res.json({ tip: "The Pomodoro technique (25 min study, 5 min break) improves focus and retention. Try it during your next study session." });
  }
});

router.post('/placement', async (req, res) => {
  const { companyName, role } = req.body;
  try {
    const prompt = `Create a placement preparation roadmap, interview tips, and weekly study plan for target company '${companyName}' and role '${role}'. Return JSON format: { "roadmap": ["string"], "tips": ["string"], "weeklyPlan": [{ "week": "Week 1", "topic": "string" }] }`;
    const result = await aiService.callAI(prompt);
    res.json(result);
  } catch (e) {
    res.json({
      roadmap: [
        `Understand ${companyName}'s online assessment format (often HackerRank or CodeSignal for ${role} roles).`,
        "Master data structures (Trees, Graphs, Hash Maps) and algorithms (Dynamic Programming, BFS/DFS).",
        "Prepare core subjects: System Design, DBMS, and Operating Systems.",
        "Perform mock behavioral interviews using the STAR method."
      ],
      tips: [
        "Focus on time complexity optimization during the coding rounds.",
        "Talk through your thought process while coding; communication is key.",
        "Ask clarifying questions about constraints before starting."
      ],
      weeklyPlan: [
        { week: "Week 1", topic: "Data Structures & LeetCode easy/medium problems" },
        { week: "Week 2", topic: "System Design basics & Object-Oriented Programming" },
        { week: "Week 3", topic: "Mock coding sessions & company-specific previous questions" },
        { week: "Week 4", topic: "Behavioral interview prep & resume dry-run" }
      ]
    });
  }
});

module.exports = router;
