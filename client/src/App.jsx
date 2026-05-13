import { useState } from 'react';
import ChatWindow from './components/ChatWindow';

const FEATURES = [
  { id: 'chat',    icon: '🤖', title: 'AI Chat',       desc: 'Ask anything, get instant answers' },
  { id: 'schedule',icon: '📅', title: 'Schedule',      desc: 'Weekly timetable for every group' },
  { id: 'events',  icon: '🎪', title: 'Events',        desc: 'Upcoming concerts and activities' },
  { id: 'notes',   icon: '📒', title: 'Notes',         desc: 'Lesson notes and practice diary' },
  { id: 'library', icon: '🎸', title: 'Music Library', desc: 'Chords, scales, diagrams' },
  { id: 'reminders',icon:'🔔', title: 'Reminders',     desc: 'Automatic lesson reminders' },
];

function Toggle({ on, onToggle }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={onToggle}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 rounded-full transition-colors duration-200 focus:outline-none ${
        on ? 'bg-indigo-600' : 'bg-white/10'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 mt-0.5 ${
          on ? 'translate-x-4' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}

export default function App() {
  const [lang, setLang] = useState('EN');
  const [enabled, setEnabled] = useState(
    () => Object.fromEntries(FEATURES.map(f => [f.id, true]))
  );

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

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 pb-28">
        <h2 className="text-center text-3xl sm:text-4xl font-bold tracking-tight mb-12">
          Everything your school needs
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(f => (
            <div
              key={f.id}
              className={`rounded-2xl border p-6 flex flex-col gap-4 transition-all duration-200 ${
                enabled[f.id]
                  ? 'bg-white/[0.04] border-white/[0.08]'
                  : 'bg-white/[0.02] border-white/[0.04] opacity-40'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-3xl leading-none">{f.icon}</span>
                <Toggle
                  on={enabled[f.id]}
                  onToggle={() => setEnabled(prev => ({ ...prev, [f.id]: !prev[f.id] }))}
                />
              </div>
              <div>
                <p className="font-semibold text-white text-sm">{f.title}</p>
                <p className="mt-1 text-sm text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Chat — kept as-is */}
      <ChatWindow />

    </div>
  );
}
