const axios = require('axios');

async function callAI(prompt) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY not set");
  }
  const response = await axios.post(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      model: 'llama3-8b-8192',
      messages: [
        { role: 'system', content: 'You are a helpful AI assistant for college students. Always respond with valid JSON only — no markdown, no explanation, just the JSON object.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    },
    { headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` } }
  );
  
  const raw = response.data.choices[0].message.content;
  return JSON.parse(raw);
}

module.exports = { callAI };
