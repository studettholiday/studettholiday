const express = require('express');
const router = express.Router();
const { routeToProvider } = require('../services/ai');

router.post('/', async (req, res) => {
  const { messages, provider = 'anthropic' } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  // Anthropic requires the conversation to start with a user message.
  // Strip any leading assistant turns (e.g. the client's greeting bubble).
  const trimmed = messages.slice(
    messages.findIndex((m) => m.role === 'user')
  );

  if (trimmed.length === 0) {
    return res.status(400).json({ error: 'At least one user message is required' });
  }

  try {
    const reply = await routeToProvider(provider, trimmed);
    res.json({ message: reply });
  } catch (err) {
    console.error('AI error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
