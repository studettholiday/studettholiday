require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const chatRouter = require('./routes/chat');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/chat', chatRouter);
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use(express.static(path.join(__dirname, '../client/dist')));
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
