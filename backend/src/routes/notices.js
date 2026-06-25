const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const aiService = require('../services/aiService');
const n8nService = require('../services/n8nService');

router.post('/broadcast', async (req, res) => {
  const { noticeText, eventTitle, eventDate, phoneList, studentId } = req.body;
  let bullets = ["Mock 1", "Mock 2", "Mock 3"];
  try {
    const prompt = `Summarise this college notice in exactly 3 bullet points. Return JSON: { "bullets": ["string", "string", "string"] }\n\nNotice: ${noticeText}`;
    const result = await aiService.callAI(prompt);
    if (result && result.bullets) bullets = result.bullets;
  } catch (e) {
    console.log("AI fallback for broadcast");
  }

  const aiSummary = bullets.map(b => '• ' + b).join('\n');

  try {
    await n8nService.triggerNoticeWebhook({
      noticeText,
      aiSummary,
      eventTitle,
      eventDate,
      phoneList
    });
    global.mockDb.logs.push({
      id: crypto.randomUUID(),
      student_id: studentId,
      workflow_name: 'Notice Broadcast',
      status: 'success',
      triggered_at: new Date().toISOString(),
      payload: { eventTitle }
    });
  } catch (e) {
    global.mockDb.logs.push({
      id: crypto.randomUUID(),
      student_id: studentId,
      workflow_name: 'Notice Broadcast',
      status: 'failed',
      triggered_at: new Date().toISOString(),
      payload: { eventTitle, error: e.message }
    });
  }

  res.json({ summary: aiSummary, status: 'Broadcasted' });
});

module.exports = router;
