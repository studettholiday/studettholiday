import { useState } from 'react';

const T = {
  EN: {
    title: 'Why Sherlock?',
    body: `I run a music school in Tbilisi. Scheduling chaos, students missing information, teachers sharing files through WhatsApp at midnight. I built Sherlock to fix my own problems. Now students get answers at 3am without texting anyone. Teachers send materials to exact groups. The AI stays on topic — it won't help a student write a love letter when they should be learning solfège. Everyone in the institution — admin, assistant, teacher, student — has exactly the tools they need, nothing more, nothing less. You decide how much AI power to use, because you pay for AI directly — we never touch your budget.`,
    pricingTitle: 'Pricing',
    pricing: '$4 per student per month. No setup fees. No hidden costs. You bring your own AI key.',
    back: '← Back',
  },
  GEO: {
    title: 'რატომ შერლოკი?',
    body: `მე ვარ მუსიკალური სკოლის ხელმძღვანელი თბილისში. გრაფიკი ქაოსია! მოსწავლეები ინფორმაციას ვერ იღებენ, მასწავლებლები ფაილებს WhatsApp-ის საშუალებით შუაღამისას აზიარებენ. შერლოკი ჩემი პრობლემების გადასაჭრელად შევქმენი. ახლა მოსწავლეები პასუხებს დილის 3 საათზეც კი იღებენ, ვინმეს შეწუხების გარეშე. მასწავლებლები მასალებს კონკრეტულ ჯგუფებს უგზავნიან. ხელოვნური ინტელექტი კონკრეტულ თემატიკას არ სცდება - ის არ დაეხმარება მოსწავლეს სასიყვარულო წერილის დაწერაში, როცა სოლფეჯიოს უნდა მეცადინეობდეს. დაწესებულების ყველა წევრს - ადმინისტრაციას, ასისტენტს, მასწავლებელს, მოსწავლეს - აქვს ზუსტად ის ინსტრუმენტები, რაც სჭირდება, არც მეტი, არც ნაკლები. თქვენ წყვეტთ, რამდენი ხელოვნური ინტელექტის ინტეგრაცია გინდათ - ჩვენ არასდროს ვეხებით თქვენს ბიუჯეტს.`,
    pricingTitle: 'ფასი',
    pricing: '4$ თითო მოსწავლეზე თვეში. გამოწერა საფასურს არ საჭიროებს. ფარული ხარჯები არ არის. თქვენ თან გაქვთ თქვენი საკუთარი ხელოვნური ინტელექტის გასაღები.',
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
            className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-br from-white via-gray-100 to-gray-500 bg-clip-text text-transparent leading-tight mb-10"
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
              className="text-gray-300 text-base leading-relaxed"
              style={{ fontFamily: "'Noto Sans Georgian', sans-serif" }}
            >
              {t.pricing}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
