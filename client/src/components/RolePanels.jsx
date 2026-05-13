import { useState } from 'react';

// ─── Fake data ────────────────────────────────────────────────────────────────

const FAKE_SCHEDULE = [
  { day: 'Monday',    time: '16:00', subject: 'Guitar — Beginners' },
  { day: 'Wednesday', time: '16:00', subject: 'Guitar — Beginners' },
  { day: 'Thursday',  time: '17:00', subject: 'Music Theory'       },
  { day: 'Friday',    time: '18:00', subject: 'Vocals'             },
  { day: 'Saturday',  time: '12:00', subject: 'Band Practice'      },
];

const FAKE_EVENTS = [
  { name: 'End of Year Concert', date: '20 Jun 2025', time: '19:00', place: 'City Concert Hall' },
  { name: 'Summer Workshop',     date: '15 Jul 2025', time: '11:00', place: 'Studio Main Hall'  },
  { name: 'Open Mic Night',      date: '30 Aug 2025', time: '20:00', place: 'The Music Bar'     },
];

const FAKE_STUDENTS = [
  { name: 'Ana Beridze',        group: 'Guitar Beginners', status: 'active'  },
  { name: 'Giorgi Kasreli',     group: 'Vocals A',          status: 'active'  },
  { name: 'Mariam Joria',       group: 'Band Practice',     status: 'active'  },
  { name: 'Luka Tvauri',        group: 'Guitar Advanced',   status: 'pending' },
  { name: 'Nino Kvaratskhelia', group: 'Vocals B',          status: 'active'  },
  { name: 'David Elisashvili',  group: 'Guitar Beginners',  status: 'pending' },
];

const INIT_GROUPS = [
  { id: 1, name: 'Guitar Beginners', count: 8 },
  { id: 2, name: 'Guitar Advanced',  count: 5 },
  { id: 3, name: 'Vocals A',         count: 6 },
  { id: 4, name: 'Vocals B',         count: 4 },
  { id: 5, name: 'Band Practice',    count: 5 },
];

const TEACHER_GROUPS = [
  { name: 'Guitar Beginners', count: 8 },
  { name: 'Vocals A',         count: 6 },
  { name: 'Band Practice',    count: 5 },
];

const ALL_GROUP_NAMES = INIT_GROUPS.map((g) => g.name);

const LIBRARY_CATS = [
  { label: 'Beginner Chords', icon: '🎸', desc: 'Am, Em, G, C, D'      },
  { label: 'Advanced Chords', icon: '🎵', desc: 'Bm7, Cmaj7, Dm9…'     },
  { label: 'Beginner Scales', icon: '🎼', desc: 'Pentatonic, Major'     },
  { label: 'Advanced Scales', icon: '🎹', desc: 'Modes, Jazz scales'   },
];

const MOODS = ['😤', '😐', '😊', '🔥'];

// ─── Per-role theme tokens ────────────────────────────────────────────────────

const TH = {
  admin:   { border: 'border-purple-500/20', hdr: 'bg-purple-500/10', accent: 'text-purple-400',  btn: 'bg-purple-600 hover:bg-purple-500',   ring: 'focus:ring-purple-500/40',  conf: 'text-purple-400'  },
  teacher: { border: 'border-blue-500/20',   hdr: 'bg-blue-500/10',   accent: 'text-blue-400',    btn: 'bg-blue-600 hover:bg-blue-500',       ring: 'focus:ring-blue-500/40',    conf: 'text-blue-400'    },
  student: { border: 'border-emerald-500/20',hdr: 'bg-emerald-500/10',accent: 'text-emerald-400', btn: 'bg-emerald-600 hover:bg-emerald-500', ring: 'focus:ring-emerald-500/40', conf: 'text-emerald-400' },
};

// ─── Reusable sub-components ─────────────────────────────────────────────────

function Input({ role, value, onChange, placeholder, type = 'text' }) {
  const th = TH[role];
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full rounded-xl border border-white/15 bg-white/[0.05] px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${th.ring}`}
    />
  );
}

function Textarea({ role, value, onChange, placeholder, rows = 3 }) {
  const th = TH[role];
  return (
    <textarea
      rows={rows}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full rounded-xl border border-white/15 bg-white/[0.05] px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${th.ring} resize-none`}
    />
  );
}

function Select({ role, value, onChange, children }) {
  const th = TH[role];
  return (
    <select
      value={value}
      onChange={onChange}
      style={{ colorScheme: 'dark' }}
      className={`w-full rounded-xl border border-white/15 bg-white/[0.05] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 ${th.ring}`}
    >
      {children}
    </select>
  );
}

function PrimaryBtn({ role, onClick, disabled, children }) {
  const th = TH[role];
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-5 py-2 rounded-xl text-white text-sm font-medium disabled:opacity-40 active:scale-95 transition-all duration-150 ${th.btn}`}
    >
      {children}
    </button>
  );
}

function GhostBtn({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-xl border border-white/15 text-gray-400 hover:text-white text-sm transition-colors"
    >
      {children}
    </button>
  );
}

function ScheduleTable({ rows, onDelete }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-white/10">
          {['Day', 'Time', 'Subject'].map((h) => (
            <th key={h} className="text-left py-2 pr-4 text-gray-400 font-medium text-xs uppercase tracking-wide">{h}</th>
          ))}
          {onDelete && <th />}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={row.id ?? i} className="border-b border-white/[0.05] last:border-0">
            <td className="py-2.5 pr-4 text-gray-300">{row.day}</td>
            <td className="py-2.5 pr-4 text-white font-medium tabular-nums">{row.time}</td>
            <td className="py-2.5 text-gray-200 flex-1">{row.subject}</td>
            {onDelete && (
              <td className="py-2.5 pl-2 text-right">
                <button onClick={() => onDelete(row.id ?? i)} className="text-gray-600 hover:text-red-400 text-xs transition-colors">✕</button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function DashedAddBtn({ onClick, label }) {
  return (
    <button
      onClick={onClick}
      className="w-full py-2.5 rounded-xl border border-dashed border-white/15 text-gray-400 hover:text-white hover:border-white/30 text-sm transition-colors"
    >
      {label}
    </button>
  );
}

function ConfirmMsg({ role, children }) {
  return <p className={`text-center py-6 text-sm ${TH[role].conf}`}>{children}</p>;
}

// ─── Student panels ───────────────────────────────────────────────────────────

function StudentSchedule() {
  return <ScheduleTable rows={FAKE_SCHEDULE} />;
}

function StudentEvents() {
  return (
    <div className="space-y-3">
      {FAKE_EVENTS.map((ev, i) => (
        <div key={i} className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
          <p className="font-semibold text-white text-sm">{ev.name}</p>
          <p className="text-xs text-gray-400 mt-1">📅 {ev.date} · {ev.time}</p>
          <p className="text-xs text-gray-500 mt-0.5">📍 {ev.place}</p>
        </div>
      ))}
    </div>
  );
}

function StudentLibrary() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {LIBRARY_CATS.map((cat, i) => (
        <button key={i} className="rounded-xl border border-white/10 bg-white/[0.04] p-4 text-left hover:bg-white/[0.08] transition-colors">
          <span className="text-2xl">{cat.icon}</span>
          <p className="text-sm font-semibold text-white mt-2">{cat.label}</p>
          <p className="text-xs text-gray-500 mt-0.5">{cat.desc}</p>
        </button>
      ))}
    </div>
  );
}

function StudentNotes({ role }) {
  const [notes, setNotes] = useState([]);
  const [adding, setAdding] = useState(false);
  const [text, setText] = useState('');

  return (
    <div className="space-y-3">
      {notes.length === 0 && !adding && (
        <p className="text-gray-500 text-sm text-center py-4">No notes yet.</p>
      )}
      {notes.map((n, i) => (
        <div key={i} className="rounded-xl border border-white/10 bg-white/[0.04] p-4 flex justify-between items-start gap-3">
          <p className="text-sm text-gray-200 whitespace-pre-wrap flex-1">{n}</p>
          <button onClick={() => setNotes((p) => p.filter((_, j) => j !== i))} className="text-gray-600 hover:text-red-400 text-xs transition-colors flex-shrink-0">✕</button>
        </div>
      ))}
      {adding ? (
        <div className="space-y-2">
          <Textarea role={role} value={text} onChange={(e) => setText(e.target.value)} placeholder="Write your note…" />
          <div className="flex gap-2">
            <PrimaryBtn role={role} onClick={() => { if (text.trim()) { setNotes((p) => [...p, text.trim()]); setText(''); setAdding(false); } }}>Save</PrimaryBtn>
            <GhostBtn onClick={() => { setAdding(false); setText(''); }}>Cancel</GhostBtn>
          </div>
        </div>
      ) : (
        <DashedAddBtn onClick={() => setAdding(true)} label="+ Add Note" />
      )}
    </div>
  );
}

function StudentPracticeDiary({ role }) {
  const [mood, setMood] = useState(null);
  const [practiced, setPracticed] = useState('');
  const [hard, setHard] = useState('');
  const [done, setDone] = useState(false);

  if (done) return <ConfirmMsg role={role}>✓ Practice diary saved!</ConfirmMsg>;

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">How did it go?</p>
        <div className="flex gap-3">
          {MOODS.map((m) => (
            <button key={m} onClick={() => setMood(m)} className={`text-2xl w-10 h-10 rounded-xl transition-all ${mood === m ? 'bg-white/20 scale-110' : 'hover:bg-white/10'}`}>{m}</button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">What I practiced</p>
        <Textarea role={role} rows={2} value={practiced} onChange={(e) => setPracticed(e.target.value)} placeholder="e.g. C major scale, Am chord transitions…" />
      </div>
      <div>
        <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">What was hard</p>
        <Textarea role={role} rows={2} value={hard} onChange={(e) => setHard(e.target.value)} placeholder="e.g. Switching from G to D quickly…" />
      </div>
      <PrimaryBtn role={role} disabled={!mood || !practiced.trim()} onClick={() => setDone(true)}>Save Entry</PrimaryBtn>
    </div>
  );
}

function StudentReportAbsence({ role }) {
  const [group, setGroup] = useState('');
  const [reason, setReason] = useState('');
  const [done, setDone] = useState(false);

  if (done) return <ConfirmMsg role={role}>✓ Absence reported!</ConfirmMsg>;

  return (
    <div className="space-y-3">
      <Select role={role} value={group} onChange={(e) => setGroup(e.target.value)}>
        <option value="">Select group…</option>
        {ALL_GROUP_NAMES.map((g) => <option key={g} value={g}>{g}</option>)}
      </Select>
      <Textarea role={role} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason for absence…" />
      <PrimaryBtn role={role} disabled={!group || !reason.trim()} onClick={() => setDone(true)}>Submit</PrimaryBtn>
    </div>
  );
}

// ─── Teacher panels ───────────────────────────────────────────────────────────

function TeacherGroups() {
  return (
    <div className="space-y-3">
      {TEACHER_GROUPS.map((g, i) => (
        <div key={i} className="rounded-xl border border-white/10 bg-white/[0.04] p-4 flex items-center justify-between">
          <div>
            <p className="font-semibold text-white text-sm">{g.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">{g.count} students</p>
          </div>
          <span className="text-xs text-blue-400 font-medium">View →</span>
        </div>
      ))}
    </div>
  );
}

function TeacherAnnounce({ role }) {
  const [group, setGroup] = useState('');
  const [msg, setMsg] = useState('');
  const [file, setFile] = useState(null);
  const [sent, setSent] = useState(false);

  if (sent) return <ConfirmMsg role={role}>✓ Sent!</ConfirmMsg>;

  return (
    <div className="space-y-3">
      <Select role={role} value={group} onChange={(e) => setGroup(e.target.value)}>
        <option value="">Select group…</option>
        {TEACHER_GROUPS.map((g) => <option key={g.name} value={g.name}>{g.name}</option>)}
      </Select>
      <Textarea role={role} value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Your message…" />
      <div className="flex items-center gap-3">
        <label className="px-4 py-2 rounded-xl border border-white/15 text-gray-400 hover:text-white text-sm cursor-pointer transition-colors">
          📎 {file ? file.name : 'Attach file'}
          <input type="file" className="hidden" onChange={(e) => setFile(e.target.files[0] ?? null)} />
        </label>
        <PrimaryBtn role={role} disabled={!group || !msg.trim()} onClick={() => setSent(true)}>Send</PrimaryBtn>
      </div>
    </div>
  );
}

// ─── Admin panels ─────────────────────────────────────────────────────────────

function AdminStudents() {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-white/10">
          {['Name', 'Group', 'Status'].map((h) => (
            <th key={h} className="text-left py-2 pr-4 text-gray-400 font-medium text-xs uppercase tracking-wide">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {FAKE_STUDENTS.map((s, i) => (
          <tr key={i} className="border-b border-white/[0.05] last:border-0">
            <td className="py-2.5 pr-4 text-white">{s.name}</td>
            <td className="py-2.5 pr-4 text-gray-400 text-xs">{s.group}</td>
            <td className="py-2.5">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${s.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                {s.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function AdminGroups({ role }) {
  const [groups, setGroups] = useState(INIT_GROUPS);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');

  return (
    <div className="space-y-2">
      {groups.map((g) => (
        <div key={g.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
          <div>
            <span className="text-sm text-white font-medium">{g.name}</span>
            <span className="text-xs text-gray-500 ml-2">{g.count} students</span>
          </div>
          <button onClick={() => setGroups((p) => p.filter((x) => x.id !== g.id))} className="text-gray-600 hover:text-red-400 text-xs transition-colors">Delete</button>
        </div>
      ))}
      {adding ? (
        <div className="flex gap-2 pt-1">
          <input autoFocus value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Group name…" className={`flex-1 rounded-lg border border-white/15 bg-white/[0.05] px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${TH[role].ring}`} />
          <PrimaryBtn role={role} onClick={() => { if (newName.trim()) { setGroups((p) => [...p, { id: Date.now(), name: newName.trim(), count: 0 }]); setNewName(''); setAdding(false); } }}>Add</PrimaryBtn>
          <GhostBtn onClick={() => { setAdding(false); setNewName(''); }}>✕</GhostBtn>
        </div>
      ) : (
        <DashedAddBtn onClick={() => setAdding(true)} label="+ Add Group" />
      )}
    </div>
  );
}

function AdminSchedule({ role }) {
  const [rows, setRows] = useState(FAKE_SCHEDULE.map((r, i) => ({ ...r, id: i })));

  return (
    <div className="space-y-2">
      <ScheduleTable rows={rows} onDelete={(id) => setRows((p) => p.filter((r) => r.id !== id))} />
      <DashedAddBtn onClick={() => setRows((p) => [...p, { id: Date.now(), day: 'Monday', time: '—', subject: 'New Class' }])} label="+ Add Row" />
    </div>
  );
}

function AdminEvents({ role }) {
  const [events, setEvents] = useState(FAKE_EVENTS.map((e, i) => ({ ...e, id: i })));
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: '', date: '', time: '', place: '' });

  return (
    <div className="space-y-2">
      {events.map((ev) => (
        <div key={ev.id} className="flex items-start justify-between rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
          <div>
            <p className="text-sm text-white font-medium">{ev.name}</p>
            <p className="text-xs text-gray-500 mt-0.5">{ev.date} · {ev.time} · {ev.place}</p>
          </div>
          <button onClick={() => setEvents((p) => p.filter((e) => e.id !== ev.id))} className="text-gray-600 hover:text-red-400 text-xs transition-colors ml-4 flex-shrink-0">Delete</button>
        </div>
      ))}
      {adding ? (
        <div className="rounded-xl border border-white/15 bg-white/[0.04] p-4 space-y-2">
          {['name', 'date', 'time', 'place'].map((f) => (
            <input key={f} value={form[f]} onChange={(e) => setForm((p) => ({ ...p, [f]: e.target.value }))} placeholder={f.charAt(0).toUpperCase() + f.slice(1)} className={`w-full rounded-lg border border-white/15 bg-white/[0.05] px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${TH[role].ring}`} />
          ))}
          <div className="flex gap-2 pt-1">
            <PrimaryBtn role={role} onClick={() => { if (form.name.trim()) { setEvents((p) => [...p, { ...form, id: Date.now() }]); setForm({ name: '', date: '', time: '', place: '' }); setAdding(false); } }}>Add</PrimaryBtn>
            <GhostBtn onClick={() => setAdding(false)}>Cancel</GhostBtn>
          </div>
        </div>
      ) : (
        <DashedAddBtn onClick={() => setAdding(true)} label="+ Add Event" />
      )}
    </div>
  );
}

function AdminBroadcast({ role }) {
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState(false);

  if (sent) return <ConfirmMsg role={role}>📢 Broadcast sent!</ConfirmMsg>;

  return (
    <div className="space-y-3">
      <Textarea role={role} rows={4} value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Message to all students…" />
      <PrimaryBtn role={role} disabled={!msg.trim()} onClick={() => setSent(true)}>Send to Everyone</PrimaryBtn>
    </div>
  );
}

function AdminAnnounce({ role }) {
  const [group, setGroup] = useState('');
  const [msg, setMsg] = useState('');
  const [announced, setAnnounced] = useState('');

  if (announced) return <ConfirmMsg role={role}>✓ Announced to {announced}!</ConfirmMsg>;

  return (
    <div className="space-y-3">
      <Select role={role} value={group} onChange={(e) => setGroup(e.target.value)}>
        <option value="">Select group…</option>
        {ALL_GROUP_NAMES.map((g) => <option key={g} value={g}>{g}</option>)}
      </Select>
      <Textarea role={role} value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Your message…" />
      <PrimaryBtn role={role} disabled={!group || !msg.trim()} onClick={() => setAnnounced(group)}>Send to Group</PrimaryBtn>
    </div>
  );
}

function AdminInvite({ role }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState('');

  if (sent) return <ConfirmMsg role={role}>✉️ Invitation sent to {sent}!</ConfirmMsg>;

  return (
    <div className="space-y-3">
      <Input role={role} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address…" />
      <PrimaryBtn role={role} disabled={!email.trim()} onClick={() => setSent(email.trim())}>Send Invitation</PrimaryBtn>
    </div>
  );
}

// ─── Panel routing ────────────────────────────────────────────────────────────

const PANEL_TITLES = {
  schedule:        'Schedule',
  events:          'Events',
  library:         'Library',
  notes:           'Notes',
  'practice-diary':'Practice Diary',
  'report-absence':'Report Absence',
  'my-schedule':   'My Schedule',
  'my-groups':     'My Groups',
  announce:        'Announce',
  students:        'Students',
  groups:          'Groups',
  'admin-schedule':'Schedule',
  'admin-events':  'Events',
  broadcast:       'Broadcast',
  'admin-announce':'Announce',
  invite:          'Invite',
};

function panelContent(role, panel) {
  switch (panel) {
    case 'schedule':        return <StudentSchedule />;
    case 'events':          return <StudentEvents />;
    case 'library':         return <StudentLibrary />;
    case 'notes':           return <StudentNotes role={role} />;
    case 'practice-diary':  return <StudentPracticeDiary role={role} />;
    case 'report-absence':  return <StudentReportAbsence role={role} />;
    case 'my-schedule':     return <StudentSchedule />;
    case 'my-groups':       return <TeacherGroups />;
    case 'announce':        return <TeacherAnnounce role={role} />;
    case 'students':        return <AdminStudents />;
    case 'groups':          return <AdminGroups role={role} />;
    case 'admin-schedule':  return <AdminSchedule role={role} />;
    case 'admin-events':    return <AdminEvents role={role} />;
    case 'broadcast':       return <AdminBroadcast role={role} />;
    case 'admin-announce':  return <AdminAnnounce role={role} />;
    case 'invite':          return <AdminInvite role={role} />;
    default:                return null;
  }
}

// ─── Exports ──────────────────────────────────────────────────────────────────

export const ROLE_BUTTONS = {
  student: [
    { id: 'schedule',        label: 'Schedule'       },
    { id: 'events',          label: 'Events'         },
    { id: 'library',         label: 'Library'        },
    { id: 'notes',           label: 'Notes'          },
    { id: 'practice-diary',  label: 'Practice Diary' },
    { id: 'report-absence',  label: 'Report Absence' },
  ],
  teacher: [
    { id: 'my-schedule', label: 'My Schedule' },
    { id: 'my-groups',   label: 'My Groups'   },
    { id: 'announce',    label: 'Announce'    },
  ],
  admin: [
    { id: 'students',        label: 'Students'  },
    { id: 'groups',          label: 'Groups'    },
    { id: 'admin-schedule',  label: 'Schedule'  },
    { id: 'admin-events',    label: 'Events'    },
    { id: 'broadcast',       label: 'Broadcast' },
    { id: 'admin-announce',  label: 'Announce'  },
    { id: 'invite',          label: 'Invite'    },
  ],
};

export const PANEL_ACTIVE_CLS = {
  admin:   'bg-purple-600 text-white shadow-sm shadow-purple-900/60',
  teacher: 'bg-blue-600 text-white shadow-sm shadow-blue-900/60',
  student: 'bg-emerald-600 text-white shadow-sm shadow-emerald-900/60',
};

export function RolePanel({ role, panel, onClose }) {
  const th = TH[role];
  return (
    <div className={`rounded-2xl border ${th.border} bg-[#0d0d18] overflow-hidden flex flex-col max-h-[300px]`}>
      <div className={`flex items-center justify-between px-4 py-2.5 border-b ${th.border} ${th.hdr} flex-shrink-0`}>
        <span className={`text-sm font-semibold ${th.accent}`}>{PANEL_TITLES[panel] ?? panel}</span>
        <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors text-sm leading-none">✕</button>
      </div>
      <div className="p-4 overflow-y-auto flex-1">
        {panelContent(role, panel)}
      </div>
    </div>
  );
}
