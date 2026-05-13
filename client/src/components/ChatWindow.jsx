import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { RolePanel, PANEL_ACTIVE_CLS } from './RolePanels';

const API_URL = '/api/chat';

const THEMES = {
  admin: {
    avatar:     'bg-gradient-to-br from-purple-500 to-purple-700',
    userBubble: 'bg-gradient-to-br from-purple-600 to-purple-800 text-white',
    sendBtn:    'bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-900/40',
    ring:       'focus:ring-2 focus:ring-purple-500/40',
    glow:       'rgba(147,51,234,0.10)',
  },
  assistant: {
    avatar:     'bg-gradient-to-br from-orange-500 to-orange-700',
    userBubble: 'bg-gradient-to-br from-orange-600 to-orange-800 text-white',
    sendBtn:    'bg-orange-600 hover:bg-orange-500 shadow-lg shadow-orange-900/40',
    ring:       'focus:ring-2 focus:ring-orange-500/40',
    glow:       'rgba(234,88,12,0.10)',
  },
  teacher: {
    avatar:     'bg-gradient-to-br from-blue-500 to-blue-700',
    userBubble: 'bg-gradient-to-br from-blue-600 to-blue-800 text-white',
    sendBtn:    'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/40',
    ring:       'focus:ring-2 focus:ring-blue-500/40',
    glow:       'rgba(37,99,235,0.10)',
  },
  student: {
    avatar:     'bg-gradient-to-br from-emerald-500 to-emerald-700',
    userBubble: 'bg-gradient-to-br from-emerald-600 to-emerald-800 text-white',
    sendBtn:    'bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-900/40',
    ring:       'focus:ring-2 focus:ring-emerald-500/40',
    glow:       'rgba(5,150,105,0.10)',
  },
};

const SYSTEM_PROMPTS = {
  admin:     'You are Sherlock, an AI assistant for school admins. You help manage students, schedules, groups, events, invite codes, and broadcasts. Show what an admin can do: approve students, generate invite codes, set schedules, ban users, view audit logs, broadcast messages.',
  assistant: 'You are Sherlock, an AI assistant for school office assistants. You help with student management, group oversight, announcements, and sending invitations. Show what an assistant can do.',
  teacher:   'You are Sherlock, an AI assistant for teachers. You help with schedules, group announcements, student attendance, lesson notes, and broadcasting to groups. Show what a teacher can do.',
  student:   'You are Sherlock, an AI assistant for music school students. You help with schedules, upcoming events, practice notes, chord and scale library, and lesson reminders. Show what a student can do.',
};

const GREETINGS = {
  admin:     "Hello! I'm Sherlock, your admin assistant. I can help you manage students, approve registrations, generate invite codes, set schedules, broadcast messages, and view audit logs. What would you like to do?",
  assistant: "Hi! I'm Sherlock, your office assistant. I can help with student management, groups, announcements, and sending invitations. What do you need?",
  teacher:   "Hi! I'm Sherlock, your teaching assistant. I can help with group schedules, student attendance, lesson notes, and group announcements. How can I help today?",
  student:   "Hey! I'm Sherlock, your music school companion. Ask me about your schedule, upcoming events, practice tips, chords, or lesson reminders!",
};

const CHAT_STYLES = {
  default: {
    wrap:            'bg-[#0d0d18]',
    headerBorder:    'border-white/[0.08]',
    footerBorder:    'border-white/[0.08]',
    titleColor:      'text-white',
    assistantBubble: 'bg-white/[0.08] text-gray-100',
    inputCls:        'bg-white/[0.05] border border-white/15 text-white placeholder-gray-500',
    selectCls:       'bg-white/[0.05] border border-white/15 text-gray-300',
    thinkingColor:   'text-gray-500',
    colorScheme:     'dark',
  },
  neon: {
    wrap:            'bg-[#050510]',
    headerBorder:    'border-cyan-500/25',
    footerBorder:    'border-cyan-500/25',
    titleColor:      'text-cyan-300',
    assistantBubble: 'bg-[#0a0820] text-cyan-300 border border-cyan-500/20',
    inputCls:        'bg-[#0a0820] border border-cyan-500/30 text-cyan-200 placeholder-cyan-900',
    selectCls:       'bg-[#0a0820] border border-cyan-500/30 text-cyan-300',
    thinkingColor:   'text-cyan-600',
    colorScheme:     'dark',
  },
  minimal: {
    wrap:            'bg-gray-50',
    headerBorder:    'border-gray-200',
    footerBorder:    'border-gray-200',
    titleColor:      'text-gray-800',
    assistantBubble: 'bg-gray-200 text-gray-800',
    inputCls:        'bg-white border border-gray-300 text-gray-800 placeholder-gray-400',
    selectCls:       'bg-white border border-gray-300 text-gray-700',
    thinkingColor:   'text-gray-400',
    colorScheme:     'light',
  },
  glass: {
    wrap:            'bg-white/[0.03] backdrop-blur-2xl',
    headerBorder:    'border-white/15',
    footerBorder:    'border-white/15',
    titleColor:      'text-white',
    assistantBubble: 'bg-white/[0.08] text-white border border-white/10',
    inputCls:        'bg-white/[0.08] border border-white/20 text-white placeholder-white/30',
    selectCls:       'bg-white/[0.08] border border-white/20 text-white/80',
    thinkingColor:   'text-white/40',
    colorScheme:     'dark',
  },
};

const STYLE_OPTIONS = [
  { id: 'default', label: 'Default', desc: 'Dark & clean'   },
  { id: 'neon',    label: 'Neon',    desc: 'Cyberpunk glow' },
  { id: 'minimal', label: 'Minimal', desc: 'Light & simple' },
  { id: 'glass',   label: 'Glass',   desc: 'Frosted blur'   },
];

function MessageBubble({ message, theme, styleName }) {
  const s = CHAT_STYLES[styleName];
  const isUser = message.role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm leading-relaxed break-words ${
        isUser
          ? `${theme.userBubble} rounded-br-sm`
          : `${s.assistantBubble} rounded-bl-sm`
      }`}>
        {isUser ? message.content : <ReactMarkdown>{message.content}</ReactMarkdown>}
      </div>
    </div>
  );
}

const ROLE_SWITCHER = [
  { id: 'admin',     label: 'Admin',     activeCls: 'bg-purple-600 text-white'  },
  { id: 'assistant', label: 'Assistant', activeCls: 'bg-orange-600 text-white'  },
  { id: 'teacher',   label: 'Teacher',   activeCls: 'bg-blue-600 text-white'    },
  { id: 'student',   label: 'Student',   activeCls: 'bg-emerald-600 text-white' },
];

const BUTTON_GROUPS = {
  admin: [
    { id: 'people',    label: '👥 People',    children: [{ id: 'students', label: 'Students' }, { id: 'invite', label: 'Invite' }] },
    { id: 'manage',    label: '📋 Manage',    children: [{ id: 'groups', label: 'Groups' }, { id: 'admin-schedule', label: 'Schedule' }, { id: 'subjects', label: 'Subjects' }] },
    { id: 'broadcast', label: '📢 Notify', children: [{ id: 'broadcast', label: 'Notify' }, { id: 'admin-announce', label: 'Announce' }] },
    { id: 'events',    label: '🎪 Events',    children: [{ id: 'view-events', label: 'View Events' }, { id: 'add-event', label: 'Add Event' }, { id: 'delete-event', label: 'Delete Event' }] },
    { id: 'knowledge-library', label: '📚 Library' },
  ],
  assistant: [
    { id: 'people',   label: '👥 People',   children: [{ id: 'students', label: 'Students' }, { id: 'invite', label: 'Invite' }] },
    { id: 'manage',   label: '📋 Manage',   children: [{ id: 'groups', label: 'Groups' }, { id: 'subjects', label: 'Subjects' }] },
    { id: 'events',   label: '🎪 Events',   children: [{ id: 'view-events', label: 'View Events' }, { id: 'add-event', label: 'Add Event' }, { id: 'delete-event', label: 'Delete Event' }] },
    { id: 'requests', label: '📬 Requests', children: [{ id: 'requests', label: 'Pending Requests' }] },
    { id: 'announce', label: '📢 Announce', children: [{ id: 'announce', label: 'Announce' }] },
    { id: 'knowledge-library', label: '📚 Library' },
  ],
  teacher: [
    { id: 'my-work',           label: '📅 My Work',     children: [{ id: 'my-schedule', label: 'My Schedule' }, { id: 'my-groups', label: 'My Groups' }] },
    { id: 'announce',          label: '📢 Announce'    },
    { id: 'share-files',       label: '📁 Share Files' },
    { id: 'knowledge-library', label: '📚 Library'     },
  ],
  student: [
    { id: 'schedule', label: 'Schedule' },
    { id: 'events',   label: 'Events'   },
    { id: 'library',  label: 'Library'  },
    { id: 'plan',     label: '📋 Plan',     children: [{ id: 'change-group', label: 'Change Group' }, { id: 'add-subject', label: 'Add Subject' }, { id: 'remove-subject', label: 'Remove Subject' }] },
    { id: 'my-notes', label: '📓 My Notes', children: [{ id: 'notes', label: 'Notes' }, { id: 'practice-diary', label: 'Practice Diary' }] },
    { id: 'report',   label: '⚠️ Report',   children: [{ id: 'report-absence', label: 'Report Absence' }, { id: 'report-event-absence', label: 'Report Event Absence' }, { id: 'report-exam-absence', label: 'Report Exam Absence' }] },
  ],
};

const GROUP_OPEN_CLS = {
  admin:     'bg-purple-600/20 text-purple-300 border border-purple-500/40',
  assistant: 'bg-orange-600/20 text-orange-300 border border-orange-500/40',
  teacher:   'bg-blue-600/20 text-blue-300 border border-blue-500/40',
  student:   'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40',
};

export default function ChatWindow() {
  const [role, setRole] = useState('student');
  const [activePanel, setActivePanel] = useState(null);
  const [openGroup, setOpenGroup] = useState(null);
  const theme = THEMES[role];
  const [messages, setMessages] = useState([
    { role: 'assistant', content: GREETINGS[role] },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState('anthropic');
  const [styleName, setStyleName] = useState('default');
  const [styleOpen, setStyleOpen] = useState(false);
  const stylePanelRef = useRef(null);
  const s = CHAT_STYLES[styleName];

  useEffect(() => {
    setMessages([{ role: 'assistant', content: GREETINGS[role] }]);
    setInput('');
    setLoading(false);
    setActivePanel(null);
    setOpenGroup(null);
  }, [role]);

  // Close stylize panel on outside click
  useEffect(() => {
    if (!styleOpen) return;
    const handler = (e) => {
      if (stylePanelRef.current && !stylePanelRef.current.contains(e.target)) {
        setStyleOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [styleOpen]);

  async function sendMessage(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMessage = { role: 'user', content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    // Strip the leading assistant greeting so the API payload starts user→assistant→user→…
    const firstUserIdx = newMessages.findIndex((m) => m.role === 'user');
    const conversation = firstUserIdx >= 0 ? newMessages.slice(firstUserIdx) : newMessages;

    const apiMessages = [
      { role: 'user',      content: `[System context] ${SYSTEM_PROMPTS[role]}` },
      { role: 'assistant', content: 'Understood.' },
      ...conversation,
    ];

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages, provider }),
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
    <div className={`relative flex flex-col max-w-2xl mx-auto border border-white/[0.08] rounded-2xl overflow-hidden ${s.wrap}`}>

      {/* Per-role ambient glow */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: `radial-gradient(ellipse 80% 35% at 50% 0%, ${theme.glow}, transparent)` }}
      />

      {/* Header */}
      <header className={`flex items-center gap-3 px-4 py-3 border-b ${s.headerBorder} flex-shrink-0`}>
        <div className={`w-8 h-8 rounded-full ${theme.avatar} flex items-center justify-center text-white text-sm font-bold shadow-md`}>
          S
        </div>
        <h1 className={`text-base font-semibold ${s.titleColor}`}>Sherlock</h1>

        <div className="ml-auto flex items-center gap-2">
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            disabled={loading}
            style={{ colorScheme: s.colorScheme }}
            className={`text-sm rounded-lg px-2 py-1 focus:outline-none ${theme.ring} disabled:opacity-40 ${s.selectCls}`}
          >
            <option value="anthropic">Claude</option>
            <option value="openai">GPT-4</option>
            <option value="gemini">Gemini</option>
          </select>

          {/* Stylize */}
          <div className="relative" ref={stylePanelRef}>
            <button
              onClick={() => setStyleOpen((o) => !o)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors duration-150 ${
                styleOpen
                  ? 'border-white/30 text-white bg-white/10'
                  : 'border-white/15 text-gray-400 hover:text-white hover:border-white/30'
              }`}
            >
              Stylize
            </button>

            {styleOpen && (
              <div className="absolute right-0 top-full mt-2 w-44 rounded-xl border border-white/15 bg-[#0f0f1a] shadow-2xl z-20 overflow-hidden">
                {STYLE_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => { setStyleName(opt.id); setStyleOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 flex items-center justify-between transition-colors ${
                      styleName === opt.id
                        ? 'bg-white/10 text-white'
                        : 'text-gray-400 hover:bg-white/[0.05] hover:text-white'
                    }`}
                  >
                    <span className="text-sm font-medium">{opt.label}</span>
                    <span className="text-xs text-gray-500">{opt.desc}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {loading && (
            <span className={`text-xs animate-pulse ${s.thinkingColor}`}>Thinking…</span>
          )}
        </div>
      </header>

      {/* Role switcher */}
      <div className={`flex items-center gap-1 px-4 py-2 border-b ${s.headerBorder} flex-shrink-0`}>
        {ROLE_SWITCHER.map((r) => (
          <button
            key={r.id}
            onClick={() => setRole(r.id)}
            className={`px-4 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
              role === r.id
                ? r.activeCls
                : s.colorScheme === 'light'
                  ? 'text-gray-500 hover:text-gray-900'
                  : 'text-gray-400 hover:text-white'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Handler buttons */}
      {(() => {
        const inactiveCls = s.colorScheme === 'light'
          ? 'border border-gray-300 text-gray-500 hover:text-gray-900 hover:border-gray-400'
          : 'border border-white/15 text-gray-400 hover:text-white hover:border-white/30';
        const inactiveGroupCls = s.colorScheme === 'light'
          ? 'border border-gray-300 text-gray-600 hover:text-gray-900 hover:border-gray-400'
          : 'border border-white/15 text-gray-400 hover:text-white hover:border-white/30';
        const openGroupDef = openGroup ? BUTTON_GROUPS[role].find(g => g.id === openGroup) : null;
        return (
          <div className={`flex flex-col border-b ${s.headerBorder} flex-shrink-0`}>
            <div className="flex items-center gap-1.5 px-4 py-2 overflow-x-auto"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {BUTTON_GROUPS[role].map(item =>
                !item.children ? (
                  <button key={item.id}
                    onClick={() => setActivePanel(activePanel === item.id ? null : item.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all duration-200 ${activePanel === item.id ? PANEL_ACTIVE_CLS[role] : inactiveCls}`}>
                    {item.label}
                  </button>
                ) : (
                  <button key={item.id}
                    onClick={() => setOpenGroup(g => g === item.id ? null : item.id)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all duration-200 ${openGroup === item.id ? GROUP_OPEN_CLS[role] : inactiveGroupCls}`}>
                    {item.label} {openGroup === item.id ? '▲' : '▼'}
                  </button>
                )
              )}
            </div>
            {openGroupDef?.children && (
              <div className={`flex items-center gap-1.5 px-6 py-1.5 border-t ${s.headerBorder} overflow-x-auto`}
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {openGroupDef.children.map(child => (
                  <button key={child.id}
                    onClick={() => setActivePanel(activePanel === child.id ? null : child.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all duration-200 ${activePanel === child.id ? PANEL_ACTIVE_CLS[role] : inactiveCls}`}>
                    {child.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })()}

      {/* Messages + active panel */}
      <div className="h-[400px] overflow-y-auto px-4 py-4">
        {activePanel && (
          <div className="mb-4">
            <RolePanel role={role} panel={activePanel} onClose={() => setActivePanel(null)} />
          </div>
        )}
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} theme={theme} styleName={styleName} />
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={sendMessage}
        className={`flex items-end gap-2 px-4 py-3 border-t ${s.footerBorder} flex-shrink-0`}
      >
        <textarea
          rows={1}
          placeholder="Type a message…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) sendMessage(e); }}
          className={`flex-1 resize-none rounded-xl px-3 py-2 text-sm focus:outline-none ${theme.ring} max-h-32 ${s.inputCls}`}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className={`px-4 py-2 rounded-xl text-white text-sm font-medium disabled:opacity-40 active:scale-95 transition-all duration-150 ${theme.sendBtn}`}
        >
          Send
        </button>
      </form>
    </div>
  );
}
