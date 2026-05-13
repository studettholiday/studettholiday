const express = require('express');
const router = express.Router();
const { routeToProvider } = require('../services/ai');

const MAX_MESSAGES_PER_HOUR = 10;
const MAX_MESSAGE_LENGTH = 500;
const WINDOW_MS = 60 * 60 * 1000;

// { ip -> { count, resetAt } }
const rateLimitStore = new Map();

// Prune expired entries every hour so the map doesn't grow unboundedly
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitStore) {
    if (now >= entry.resetAt) rateLimitStore.delete(ip);
  }
}, WINDOW_MS);

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now >= entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (entry.count >= MAX_MESSAGES_PER_HOUR) return false;

  entry.count += 1;
  return true;
}

router.post('/', async (req, res) => {
  const ip = req.ip;
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  const { messages, provider = 'anthropic' } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  const lastUser = messages.findLast((m) => m.role === 'user');
  if (lastUser && typeof lastUser.content === 'string' && lastUser.content.length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({ error: `Message too long. Maximum ${MAX_MESSAGE_LENGTH} characters allowed.` });
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
