const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

router.get('/schedule', async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT g.name AS group_name, s.day_of_week, s.lesson_time, s.subject
       FROM schedule s
       JOIN groups g ON s.group_id = g.id
       ORDER BY g.name, s.day_of_week, s.lesson_time`
    );
    res.json(rows);
  } catch (err) {
    console.error('schedule query error:', err.message);
    res.status(500).json({ error: 'Failed to fetch schedule' });
  }
});

router.get('/events', async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT name, event_date, event_time, place
       FROM events
       WHERE event_date >= CURRENT_DATE
       ORDER BY event_date, event_time`
    );
    res.json(rows);
  } catch (err) {
    console.error('events query error:', err.message);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

module.exports = router;
