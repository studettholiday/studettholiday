import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

const API_URL = '/api/chat';

function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div
        className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm leading-relaxed break-words ${
          isUser
            ? 'bg-indigo-600 text-white rounded-br-sm'
            : 'bg-white/[0.08] text-gray-100 rounded-bl-sm'
        }`}
      >
        {isUser ? message.content : <ReactMarkdown>{message.content}</ReactMarkdown>}
      </div>
    </div>
  );
}

export default function ChatWindow() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! How can I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState('anthropic');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function sendMessage(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMessage = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage], provider }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.message ?? 'No response.' },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Error: could not reach the server.' },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-screen bg-[#0d0d18] max-w-2xl mx-auto border-t border-white/[0.06]">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.08] bg-[#0d0d18]">
        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold">
          S
        </div>
        <h1 className="text-base font-semibold text-white">Sherlock</h1>
        <select
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
          disabled={loading}
          style={{ colorScheme: 'dark' }}
          className="ml-auto text-sm border border-white/15 rounded-lg px-2 py-1 bg-white/[0.05] text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 disabled:opacity-40"
        >
          <option value="anthropic">Claude</option>
          <option value="openai">GPT-4</option>
          <option value="gemini">Gemini</option>
        </select>
        {loading && (
          <span className="text-xs text-gray-500 animate-pulse">Thinking...</span>
        )}
      </header>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <form
        onSubmit={sendMessage}
        className="flex items-end gap-2 px-4 py-3 border-t border-white/[0.08] bg-[#0d0d18]"
      >
        <textarea
          className="flex-1 resize-none rounded-xl border border-white/15 bg-white/[0.05] px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 max-h-32"
          rows={1}
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) sendMessage(e);
          }}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium disabled:opacity-40 hover:bg-indigo-500 transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}
