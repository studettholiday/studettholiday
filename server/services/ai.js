const Anthropic = require('@anthropic-ai/sdk');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = 'You are a helpful AI assistant. Be concise and clear.';

async function callAnthropic(messages) {
  const stream = client.messages.stream({
    model: 'claude-opus-4-7',
    max_tokens: 8192,
    system: [
      {
        type: 'text',
        text: SYSTEM_PROMPT,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages,
  });

  const response = await stream.finalMessage();
  const textBlock = response.content.find((b) => b.type === 'text');
  return textBlock?.text ?? '';
}

async function callGemini(messages) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  // Convert messages to Gemini format
  // Gemini uses 'user' and 'model' roles (not 'assistant')
  const history = messages.slice(0, -1).map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  const lastMessage = messages[messages.length - 1];

  const chat = model.startChat({
    history,
    generationConfig: { maxOutputTokens: 2048 }
  });

  const result = await chat.sendMessage(lastMessage.content);
  return result.response.text();
}

async function routeToProvider(provider, messages) {
  switch (provider) {
    case 'anthropic':
      return callAnthropic(messages);
    case 'openai':
      throw new Error('OpenAI provider not yet implemented');
    case 'gemini':
      return callGemini(messages);
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

module.exports = { routeToProvider };
