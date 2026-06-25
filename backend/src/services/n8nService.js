const axios = require('axios');

// Default webhook fallback URL provided by user
const DEFAULT_WEBHOOK = 'https://hangover007.app.n8n.cloud/webhook/campusflow-task';

async function triggerDeadlineWebhook(payload) {
  const url = process.env.N8N_DEADLINE_WEBHOOK || DEFAULT_WEBHOOK;
  console.log('Triggering n8n Deadline Webhook ->', url);
  const res = await axios.post(url, payload);
  return res.data;
}

async function triggerNoticeWebhook(payload) {
  const url = process.env.N8N_NOTICE_WEBHOOK || DEFAULT_WEBHOOK;
  console.log('Triggering n8n Notice Webhook ->', url);
  const res = await axios.post(url, payload);
  return res.data;
}

module.exports = {
  triggerDeadlineWebhook,
  triggerNoticeWebhook
};
