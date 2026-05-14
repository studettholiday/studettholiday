const express = require('express');
const router = express.Router();
const pool = require('../services/db');

// Run migration on startup
pool.query(`
  CREATE TABLE IF NOT EXISTS knowledge_library (
    id SERIAL PRIMARY KEY,
    filename TEXT NOT NULL,
    content TEXT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT NOW()
  )
`).catch(err => console.error('Library migration failed:', err.message));

router.post('/library', async (req, res) => {
  const { filename, content } = req.body;
  if (!filename || !content) {
    return res.status(400).json({ error: 'filename and content are required' });
  }
  try {
    const result = await pool.query(
      'INSERT INTO knowledge_library (filename, content) VALUES ($1, $2) RETURNING id, filename, uploaded_at',
      [filename, content]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Library insert error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get('/library', async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, filename, uploaded_at, LEFT(content, 200) AS preview
       FROM knowledge_library
       ORDER BY uploaded_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Library fetch error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.delete('/library/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM knowledge_library WHERE id = $1', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    console.error('Library delete error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
