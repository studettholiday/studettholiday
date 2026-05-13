import { useState } from 'react';
import ChatWindow from './components/ChatWindow';

export default function App() {
  const [lang, setLang] = useState('EN');

  return (
    <div className="min-h-screen bg-[#08080f] text-white">

      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#08080f]/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-6 flex items-center justify-between h-16">
          <span className="text-base font-bold tracking-tight">
            Sherlock Is Smart
          </span>
          <button
            onClick={() => setLang(l => l === 'EN' ? 'GEO' : 'EN')}
            className="rounded-full border border-white/20 px-4 py-1.5 text-sm font-medium text-gray-400 hover:border-white/40 hover:text-white transition-colors duration-200"
          >
            {lang}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center px-6 pt-28 pb-32 text-center overflow-hidden">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(99,102,241,0.12),transparent)]" />

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight bg-gradient-to-br from-white via-gray-100 to-gray-500 bg-clip-text text-transparent leading-tight">
          Sherlock Is Smart
        </h1>

        <p className="mt-5 max-w-lg text-lg text-gray-400 leading-relaxed">
          AI-powered school management.{' '}
          <span className="text-gray-300">No code required.</span>
        </p>

        <div className="mt-10 flex flex-wrap gap-3 justify-center">
          <button className="rounded-xl bg-indigo-600 px-7 py-3 text-sm font-semibold text-white hover:bg-indigo-500 active:scale-95 transition-all duration-150 shadow-lg shadow-indigo-900/40">
            Get Started
          </button>
          <button className="rounded-xl border border-white/15 px-7 py-3 text-sm font-semibold text-gray-300 hover:border-white/30 hover:text-white active:scale-95 transition-all duration-150">
            Try Demo
          </button>
        </div>
      </section>

      {/* Chat — kept as-is */}
      <ChatWindow />

    </div>
  );
}
