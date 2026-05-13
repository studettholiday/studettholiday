import { useState, useEffect, useCallback } from 'react';
import ChatWindow from './components/ChatWindow';

const T = {
  EN: {
    sub1: 'AI-powered school management.',
    sub2: 'No code required.',
    getStarted: 'Get Started',
    tryDemo: 'Try Demo',
    featuresTitle: 'Everything your school needs',
    joinWaitlist: 'Join Waitlist',
    emailLabel: 'Email address',
    schoolLabel: 'School name',
    typeLabel: 'School type',
    schoolTypes: ['Music School', 'Language School', 'University', 'Gym', 'Other'],
    eventsTitle: 'Upcoming Events',
    scheduleTitle: 'Schedule',
    roleAdmin: 'Admin', roleTeacher: 'Teacher', roleStudent: 'Student',
    chatTitle: 'Try Sherlock',
    chatSubtitle: 'Ask anything. See how it works.',
    thankYou: "You're on the list! We'll be in touch soon.",
  },
  GEO: {
    sub1: 'AI-ზე დაფუძნებული სკოლის მართვა.',
    sub2: 'კოდი არ სჭირდება.',
    getStarted: 'დაწყება',
    tryDemo: 'სცადე',
    featuresTitle: 'ყველაფერი რაც თქვენს სკოლას სჭირდება',
    joinWaitlist: 'სიაში ჩაწერა',
    emailLabel: 'ელ-ფოსტა',
    schoolLabel: 'სკოლის სახელი',
    typeLabel: 'სკოლის ტიპი',
    schoolTypes: ['მუსიკალური სკოლა', 'ენის სკოლა', 'უნივერსიტეტი', 'სპორტ დარბაზი', 'სხვა'],
    eventsTitle: 'მომავალი ღონისძიებები',
    scheduleTitle: 'განრიგი',
    roleAdmin: 'ადმინი', roleTeacher: 'მასწავლებელი', roleStudent: 'მოსწავლე',
    chatTitle: 'სცადე შერლოკი',
    chatSubtitle: 'ნებისმიერი კითხვა. ნახეთ როგორ მუშაობს.',
    thankYou: 'თქვენ ჩაეწერეთ! მალე დაგიკავშირდებით.',
  },
};

const DAY_NAMES = {
  EN:  ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  GEO: ['ორშ', 'სამ', 'ოთხ', 'ხუთ', 'პარ', 'შაბ', 'კვი'],
};

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function groupSchedule(rows) {
  const map = {};
  for (const row of rows) {
    if (!map[row.group_name]) map[row.group_name] = new Map();
    const key = `${row.day_of_week}-${row.lesson_time}`;
    map[row.group_name].set(key, { day: row.day_of_week, time: row.lesson_time });
  }
  return Object.entries(map).map(([name, slots]) => ({
    name,
    slots: Array.from(slots.values()).sort((a, b) => a.day - b.day),
  }));
}

const FEATURES = [
  { id: 'chat',     icon: '🤖', EN: { title: 'AI Chat',           desc: 'Ask anything, get instant answers' }, GEO: { title: 'AI ჩატი',               desc: 'ნებისმიერი კითხვა'         } },
  { id: 'schedule', icon: '📅', EN: { title: 'Schedule',          desc: 'Weekly timetable for every group'  }, GEO: { title: 'განრიგი',                desc: 'კვირის განრიგი'             } },
  { id: 'events',   icon: '🎪', EN: { title: 'Events',            desc: 'Upcoming concerts and activities'  }, GEO: { title: 'ღონისძიებები',           desc: 'მომავალი ღონისძიებები'     } },
  { id: 'notes',    icon: '📒', EN: { title: 'Notes',             desc: 'Lesson notes and practice diary'   }, GEO: { title: 'ჩანაწერები',             desc: 'გაკვეთილის ჩანაწერები'     } },
  { id: 'library',  icon: '📚', EN: { title: 'Library',           desc: 'Chords, scales, diagrams'          }, GEO: { title: 'ბიბლიოთეკა',            desc: 'აკორდები, გამები'           } },
  { id: 'reminders',icon: '🔔', EN: { title: 'Reminders',         desc: 'Automatic lesson reminders'        }, GEO: { title: 'შეხსენებები',            desc: 'ავტომატური შეხსენებები'    } },
];

const FIELD_CLS =
  'w-full rounded-xl border border-white/15 bg-white/[0.05] px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-colors';

function SignupModal({ lang, onClose }) {
  const t = T[lang];
  const [form, setForm] = useState({ email: '', school: '', type: '' });
  const [done, setDone] = useState(false);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#0f0f1a] p-8 shadow-2xl">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 text-gray-500 hover:text-white transition-colors text-lg leading-none"
        >
          ✕
        </button>

        {done ? (
          <div className="py-8 text-center">
            <p className="text-3xl mb-4">🎉</p>
            <p className="text-white font-medium">{t.thankYou}</p>
          </div>
        ) : (
          <form
            onSubmit={(e) => { e.preventDefault(); setDone(true); }}
            className="flex flex-col gap-4"
          >
            <h2 className="text-lg font-bold text-white mb-1">{t.getStarted}</h2>

            <input
              required
              type="email"
              placeholder={t.emailLabel}
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className={FIELD_CLS}
            />
            <input
              required
              type="text"
              placeholder={t.schoolLabel}
              value={form.school}
              onChange={(e) => setForm((f) => ({ ...f, school: e.target.value }))}
              className={FIELD_CLS}
            />
            <select
              required
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              style={{ colorScheme: 'dark' }}
              className={FIELD_CLS + ' cursor-pointer'}
            >
              <option value="" disabled>{t.typeLabel}</option>
              {t.schoolTypes.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <button
              type="submit"
              className="mt-1 w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 active:scale-95 transition-all duration-150"
            >
              {t.joinWaitlist}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}


export default function App() {
  const [lang, setLang] = useState('EN');
  const [modalOpen, setModalOpen] = useState(false);

  const closeModal = useCallback(() => setModalOpen(false), []);
  const t = T[lang];

  const events = [
    { name: 'End of Year Concert', event_date: '2025-06-20T00:00:00.000Z', event_time: '19:00', place: 'City Concert Hall' },
    { name: 'Summer Workshop',     event_date: '2025-07-15T00:00:00.000Z', event_time: '11:00', place: 'Studio Main Hall' },
  ];

  const schedule = groupSchedule([
    { group_name: 'Guitar Beginners', day_of_week: 0, lesson_time: '16:00' },
    { group_name: 'Guitar Beginners', day_of_week: 2, lesson_time: '16:00' },
    { group_name: 'Guitar Advanced',  day_of_week: 1, lesson_time: '17:00' },
    { group_name: 'Guitar Advanced',  day_of_week: 3, lesson_time: '17:00' },
    { group_name: 'Vocals Group A',   day_of_week: 0, lesson_time: '18:00' },
    { group_name: 'Vocals Group A',   day_of_week: 4, lesson_time: '18:00' },
    { group_name: 'Band Practice',    day_of_week: 5, lesson_time: '12:00' },
  ]);

  useEffect(() => {
    document.body.style.overflow = modalOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [modalOpen]);

  return (
    <div className="min-h-screen bg-[#08080f] text-white">

      {modalOpen && (
        <SignupModal lang={lang} onClose={closeModal} />
      )}

      {/* Nav */}
      <nav className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#08080f]/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-6 flex items-center justify-between h-16">
          <span className="text-base font-bold tracking-tight">
            Sherlock Is Smart
          </span>
          <button
            onClick={() => setLang((l) => (l === 'EN' ? 'GEO' : 'EN'))}
            className="rounded-full border border-white/20 px-4 py-1.5 text-sm font-medium text-gray-400 hover:border-white/40 hover:text-white transition-colors duration-200"
          >
            {lang === 'EN' ? 'GEO' : 'EN'}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center px-6 pt-28 pb-32 text-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(99,102,241,0.12),transparent)]" />

        {/* Sherlock silhouette */}
        <div className="pointer-events-none select-none absolute -z-10 right-0 sm:right-4 lg:right-12 top-0 bottom-[-160px] flex items-start pt-8 opacity-[0.055] sm:opacity-[0.055] max-sm:opacity-[0.03]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 260 520"
            fill="white"
            width="340"
            height="520"
            aria-hidden="true"
          >
            {/* Deerstalker hat — front peak */}
            <path d="M 90 130 Q 85 105 95 88 Q 105 72 125 68 Q 145 64 160 72 Q 175 80 178 95 Q 182 110 175 130 Z" />
            {/* Deerstalker hat — rear peak (pointing left/back) */}
            <path d="M 90 130 Q 80 120 65 115 Q 52 112 50 120 Q 49 128 60 132 Q 72 136 90 138 Z" />
            {/* Deerstalker hat — crown */}
            <path d="M 90 138 Q 88 150 92 158 L 172 158 Q 178 150 175 138 Q 160 145 130 146 Q 105 145 90 138 Z" />
            {/* Hat band */}
            <rect x="90" y="155" width="82" height="10" rx="2" opacity="0.6" />
            {/* Head */}
            <path d="M 95 165 Q 90 185 92 205 Q 94 225 102 238 Q 112 252 125 256 Q 140 260 152 250 Q 165 240 168 222 Q 172 202 168 182 Q 164 165 155 162 L 108 162 Z" />
            {/* Prominent nose — side profile hint (right-facing) */}
            <path d="M 168 200 Q 176 204 178 212 Q 180 220 172 224 L 168 218 Z" />
            {/* Ear */}
            <path d="M 95 198 Q 86 200 84 210 Q 83 220 92 222 L 95 215 Z" />
            {/* Strong jaw / chin */}
            <path d="M 102 250 Q 108 268 118 275 Q 128 280 138 276 Q 150 270 155 255 L 125 258 Z" />
            {/* Neck */}
            <path d="M 110 272 L 108 295 L 148 295 L 145 272 Q 135 278 125 278 Q 115 278 110 272 Z" />
            {/* Shirt collar / cravat */}
            <path d="M 105 293 L 100 308 L 128 318 L 155 308 L 150 293 L 128 300 Z" />
            {/* Inverness cape — outer layer, sweeping wide */}
            <path d="M 100 308 Q 60 330 30 380 Q 15 415 20 450 Q 25 470 45 475 Q 70 480 95 460 Q 110 448 118 430 L 128 318 Z" />
            <path d="M 155 308 Q 195 330 220 385 Q 235 420 228 455 Q 222 475 200 478 Q 175 482 155 462 Q 140 448 138 430 L 128 318 Z" />
            {/* Cape inner — darker overlap suggesting depth */}
            <path d="M 108 310 Q 85 345 75 390 Q 68 420 78 448 Q 88 460 105 455 Q 118 450 122 435 L 128 320 Z" opacity="0.7" />
            <path d="M 148 310 Q 170 345 178 390 Q 185 420 175 448 Q 165 460 150 455 Q 137 450 133 435 L 128 320 Z" opacity="0.7" />
            {/* Body beneath cape — coat */}
            <path d="M 108 295 L 104 380 L 128 385 L 152 380 L 148 295 Z" opacity="0.5" />
            {/* Left arm (viewer's right) along side */}
            <path d="M 104 310 Q 88 340 82 380 Q 78 405 85 425 Q 90 438 98 432 Q 108 424 110 405 Q 114 380 115 350 L 112 310 Z" />
            {/* Right arm */}
            <path d="M 150 310 Q 165 338 170 375 Q 174 400 168 420 Q 163 433 155 430 Q 145 425 143 405 Q 140 378 142 350 L 145 310 Z" />
            {/* Lower coat / legs */}
            <path d="M 104 378 L 100 460 L 116 462 L 128 460 L 140 462 L 156 460 L 152 378 Z" opacity="0.6" />
            {/* Left leg */}
            <path d="M 100 455 L 96 510 Q 96 520 106 520 L 118 520 L 120 462 Z" />
            {/* Right leg */}
            <path d="M 156 455 L 160 510 Q 160 520 150 520 L 138 520 L 136 462 Z" />
            {/* Left shoe */}
            <path d="M 96 512 Q 88 516 84 520 L 118 520 L 118 512 Z" />
            {/* Right shoe */}
            <path d="M 160 512 Q 168 516 172 520 L 138 520 L 138 512 Z" />
          </svg>
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight bg-gradient-to-br from-white via-gray-100 to-gray-500 bg-clip-text text-transparent leading-tight">
          Sherlock Is Smart
        </h1>

        <p className="mt-5 max-w-lg text-lg text-gray-400 leading-relaxed">
          {t.sub1}{' '}
          <span className="text-gray-300">{t.sub2}</span>
        </p>

        <div className="mt-10 flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => setModalOpen(true)}
            className="rounded-xl bg-indigo-600 px-7 py-3 text-sm font-semibold text-white hover:bg-indigo-500 active:scale-95 transition-all duration-150 shadow-lg shadow-indigo-900/40"
          >
            {t.getStarted}
          </button>
          <button
            onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
            className="rounded-xl border border-white/15 px-7 py-3 text-sm font-semibold text-gray-300 hover:border-white/30 hover:text-white active:scale-95 transition-all duration-150"
          >
            {t.tryDemo}
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 pb-28">
        <h2 className="text-center text-3xl sm:text-4xl font-bold tracking-tight mb-12">
          {t.featuresTitle}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.id}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-6 flex flex-col gap-4"
            >
              <span className="text-3xl leading-none">{f.icon}</span>
              <div>
                <p className="font-semibold text-white text-sm">{f[lang].title}</p>
                <p className="mt-1 text-sm text-gray-400 leading-relaxed">{f[lang].desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Events */}
      {events.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pb-24">
          <h2 className="text-center text-3xl sm:text-4xl font-bold tracking-tight mb-10">
            {t.eventsTitle}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((ev, i) => (
              <div key={i} className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-6 flex flex-col gap-3">
                <p className="font-semibold text-white">{ev.name}</p>
                <div className="text-sm text-gray-400 space-y-1">
                  <p>📅 {formatDate(ev.event_date)} · {ev.event_time}</p>
                  <p>📍 {ev.place}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Schedule */}
      {schedule.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pb-24">
          <h2 className="text-center text-3xl sm:text-4xl font-bold tracking-tight mb-10">
            {t.scheduleTitle}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {schedule.map((group) => (
              <div key={group.name} className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-6">
                <p className="font-semibold text-white text-sm mb-4">
                  {group.name.replace(/_/g, ' ')}
                </p>
                <div className="space-y-2">
                  {group.slots.map((slot, i) => (
                    <div key={i} className="flex justify-between text-sm border-b border-white/[0.05] pb-2 last:border-0 last:pb-0">
                      <span className="text-gray-400">{DAY_NAMES[lang][slot.day]}</span>
                      <span className="text-gray-300 font-medium tabular-nums">{slot.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Demo / Chat */}
      <section id="demo" className="pb-20">
        <div className="mx-auto max-w-6xl px-6 pt-4 pb-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {t.chatTitle}
          </h2>
          <p className="mt-3 text-gray-400">{t.chatSubtitle}</p>
        </div>

        <div className="mx-auto max-w-2xl px-4">
          <ChatWindow />
        </div>
      </section>

      {/* Quote */}
      <section className="border-t border-white/[0.06] py-24">
        <div className="mx-auto max-w-[700px] px-8 text-center">
          <div className="text-7xl leading-none text-purple-500/30 font-serif mb-6 select-none">&ldquo;</div>
          <p className="italic text-lg leading-loose text-gray-400">
            I consider that a man&rsquo;s brain originally is like a little empty attic, and you have to stock it with such furniture as you choose. A fool takes in all the lumber of every sort that he comes across, so that the knowledge which might be useful to him gets crowded out, or at best is jumbled up with a lot of other things, so that he has a difficulty in laying his hands upon it. Now the skilful workman is very careful indeed as to what he takes into his brain-attic.
          </p>
          <p className="mt-6 text-sm text-gray-600 not-italic tracking-wide">
            &mdash; Arthur Conan Doyle, <em className="text-gray-500">A Study in Scarlet</em> (1887) &middot; Sherlock Holmes
          </p>
        </div>
      </section>

    </div>
  );
}
