# AI Chat App

A monorepo chat application with a React + Vite frontend and a Node.js + Express backend, designed to support multiple AI providers (Anthropic, OpenAI, Gemini).

## Project Structure

```
ai-chat-app/
├── client/          # React + Vite + Tailwind CSS
│   └── src/
│       └── components/
│           └── ChatWindow.jsx
├── server/          # Node.js + Express
│   ├── routes/
│   │   └── chat.js
│   ├── services/
│   │   └── ai.js
│   ├── .env.example
│   └── index.js
├── railway.toml
└── .gitignore
```

## Setup

### 1. Install dependencies

```bash
# Server
cd server && npm install

# Client
cd client && npm install
```

### 2. Configure environment variables

```bash
cp server/.env.example server/.env
# Fill in your API keys in server/.env
```

### 3. Run locally

Open two terminals:

```bash
# Terminal 1 — server
cd server && npm run dev

# Terminal 2 — client
cd client && npm run dev
```

- Client: http://localhost:5173
- Server: http://localhost:3001

## Deployment (Railway)

This project uses `railway.toml` for monorepo deployment. Connect the repo to Railway and it will detect both services automatically.

Set these environment variables in the Railway dashboard for the server service:

| Variable           | Description                  |
|--------------------|------------------------------|
| `ANTHROPIC_API_KEY`| Anthropic Claude API key     |
| `OPENAI_API_KEY`   | OpenAI API key               |
| `GEMINI_API_KEY`   | Google Gemini API key        |
| `DATABASE_URL`     | PostgreSQL connection string |
| `PORT`             | Automatically set by Railway |
