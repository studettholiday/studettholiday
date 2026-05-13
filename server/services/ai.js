const Anthropic = require('@anthropic-ai/sdk');

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

async function routeToProvider(provider, messages) {
  switch (provider) {
    case 'anthropic':
      return callAnthropic(messages);
    case 'openai':
      throw new Error('OpenAI provider not yet implemented');
    case 'gemini':
      throw new Error('Gemini provider not yet implemented');
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

module.exports = { routeToProvider };
