import { useState } from 'react';

const T = {
  EN: {
    title: 'About',
    body: `I run a music school in Tbilisi. Scheduling chaos, students missing information, teachers sharing files on WhatsApp at midnight. I built Sherlock to fix my own problems. Now students get answers at 3am without texting anyone. Teachers share materials with specific groups. The AI stays on topic — it won't help a student write a love letter when they should be learning solfège. Everyone in the institution — admin, assistant, teacher, student — has exactly the tools they need, nothing more, nothing less.

— From the founder of Sherlock Is Smart`,
    pricingTitle: 'Pricing',
    pricing: `Sherlock plans for you. Each plan includes a number of AI conversations per month (1 conversation = 1 question + 1 answer). All other features — schedule, library, file uploads, invites — are unlimited.

Starter — $11/month — 200 conversations
Standard — $29/month — 700 conversations
Pro — $75/month — 2000 conversations

When your AI conversation limit runs out, the rest of the app keeps working normally. The AI resets at the start of the next month (you'll be able to chat with Sherlock again).

Free trial: 14 days (30 conversations).

Given recent concerns about AI in education, you can restrict the AI for students and use it only for yourself — they still get full access to every other feature.`,
    privacy: 'Privacy',
    terms: 'Terms',
    back: '← Back',
  },
  GEO: {
    title: 'ჩვენს შესახებ',
    body: `მე ვარ მუსიკალური სკოლის ხელმძღვანელი თბილისში. გრაფიკი ქაოსია, მოსწავლეები ინფორმაციას ვერ იღებენ, მასწავლებლები ფაილებს WhatsApp-ით შუაღამისას აზიარებენ. შერლოკი ჩემი პრობლემების გადასაჭრელად შევქმენი. ახლა მოსწავლეები პასუხებს დილის 3 საათზე იღებენ შეტყობინებების გარეშე. მასწავლებლები მასალებს კონკრეტულ ჯგუფებს უგზავნიან. ხელოვნური ინტელექტი თემატიკას არ სცდება — ის არ დაეხმარება მოსწავლეს სასიყვარულო წერილის დაწერაში, როცა სოლფეჯიოს უნდა მეცადინეობდეს. დაწესებულების ყველა წევრს — ადმინისტრაციას, ასისტენტს, მასწავლებელს, მოსწავლეს — ზუსტად ის ხელსაწყოები აქვთ, რაც სჭირდებათ.

— Sherlock Is Smart-ის შემქმნელისგან`,
    pricingTitle: 'ფასი',
    pricing: `შერლოკის გეგმები თქვენთვის. თითოეული მოიცავს AI საუბრების გარკვეულ რაოდენობას თვეში (1 საუბარი = 1 კითხვა + 1 პასუხი). დანარჩენი ფუნქციები — განრიგი, ბიბლიოთეკა, ფაილების ატვირთვა, მოწვევები — შეუზღუდავია.

Starter — ₾29/თვეში — 200 საუბარი
Standard — ₾79/თვეში — 700 საუბარი
Pro — ₾199/თვეში — 2000 საუბარი

როდესაც საუბრის ლიმიტი ამოიწურება, აპის დანარჩენი ფუნქციები ჩვეულებრივად აგრძელებს მუშაობას. ხოლო ხელოვნური ინტელექტი შემდეგი თვიდან განახლდება (შეძლებთ კვლავ ესაუბროთ შერლოკს).

უფასო საცდელი პერიოდი: 14 დღე (30 საუბარი).

რადგან ამ ბოლო პერიოდში გაჩნდა ნეგატიური დამოკიდებულება ხელოვნური ინტელექტის მიმართ, შეგიძლიათ შეზღუდოთ მოსწავლეებისთვის და გამოიყენოთ მხოლოდ თქვენთვის, ხოლო ისინი ისარგებლებენ ყველა დანარჩენი ფუნქციით.`,
    privacy: 'კონფიდენციალურობა',
    terms: 'წესები',
    back: '← უკან',
  },
};

export default function About() {
  const [lang, setLang] = useState(() => localStorage.getItem('sherlock_lang') || 'EN');
  const t = T[lang];

  function toggleLang() {
    const next = lang === 'EN' ? 'GEO' : 'EN';
    localStorage.setItem('sherlock_lang', next);
    setLang(next);
  }

  return (
    <div className="min-h-screen text-white" style={{ overflowX: 'hidden', position: 'relative' }}>
      {/* Background overlay */}
      <div style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.45)',
        zIndex: 0, pointerEvents: 'none',
      }} />

      {/* Nav */}
      <nav className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#08080f]/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-6 flex items-center justify-between h-16">
          <a
            href="/"
            className="text-sm font-medium text-gray-400 hover:text-white transition-colors duration-200"
          >
            {t.back}
          </a>
          <button
            onClick={toggleLang}
            className="rounded-full border border-white/20 px-4 py-1.5 text-sm font-medium text-gray-400 hover:border-white/40 hover:text-white transition-colors duration-200"
          >
            {lang === 'EN' ? 'GEO' : 'EN'}
          </button>
        </div>
      </nav>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(99,102,241,0.12),transparent)]" />

        <section className="mx-auto max-w-2xl px-6 pt-20 pb-32">
          <h1
            className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-br from-white via-gray-100 to-gray-500 bg-clip-text text-transparent leading-tight pb-2 mb-10"
            style={{ fontFamily: "'Noto Sans Georgian', sans-serif" }}
          >
            {t.title}
          </h1>

          <p
            className="text-gray-300 text-lg leading-relaxed mb-14 whitespace-pre-line"
            style={{ fontFamily: "'Noto Sans Georgian', sans-serif" }}
          >
            {t.body}
          </p>

          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.04] p-8">
            <h2
              className="text-xl font-bold text-white mb-4"
              style={{ fontFamily: "'Noto Sans Georgian', sans-serif" }}
            >
              {t.pricingTitle}
            </h2>
            <p
              className="text-gray-300 text-base leading-relaxed whitespace-pre-line"
              style={{ fontFamily: "'Noto Sans Georgian', sans-serif" }}
            >
              {t.pricing}
            </p>
          </div>

          <footer className="text-center text-xs text-gray-500 mt-8">
            <a
              href="https://app.sherlock.school/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300 transition-colors duration-200"
            >
              {t.privacy}
            </a>
            {' · '}
            <a
              href="https://app.sherlock.school/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300 transition-colors duration-200"
            >
              {t.terms}
            </a>
          </footer>
        </section>
      </div>
    </div>
  );
}
