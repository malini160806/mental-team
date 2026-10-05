import { Quote } from 'lucide-react';
import SectionTag from './SectionTag';
import Reveal from './Reveal';
import AnimatedEmoji from './AnimatedEmoji';

const TESTIMONIALS = [
  {
    quote: 'Five honest minutes gave me language for what I was feeling all week.',
    name: 'Priya R.',
    role: 'Graduate Student',
    emoji: 'relieved',
    tone: { card: 'from-teal-50', avatar: 'from-teal-100 to-emerald-100', quote: 'text-teal-400' },
  },
  {
    quote: 'No diagnosis, no pressure — just a mirror that helped me notice my own patterns.',
    name: 'Daniel K.',
    role: 'Software Engineer',
    emoji: 'thinking',
    tone: { card: 'from-violet-50', avatar: 'from-indigo-100 to-violet-100', quote: 'text-violet-400' },
  },
  {
    quote: 'The breathing pauses between questions genuinely slowed my racing thoughts down.',
    name: 'Meera S.',
    role: 'Product Designer',
    emoji: 'exhale',
    tone: { card: 'from-fuchsia-50', avatar: 'from-pink-100 to-fuchsia-100', quote: 'text-fuchsia-400' },
  },
];

export default function Testimonials() {
  return (
    <section className="mt-20 sm:mt-24">
      <Reveal className="mx-auto max-w-2xl text-center">
        <SectionTag className="justify-center">VOICES FROM THE SANCTUARY</SectionTag>
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          People leave a little lighter
        </h2>
      </Reveal>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <Reveal key={t.name} delay={i * 110} className="h-full">
            <div className={`flex h-full flex-col rounded-3xl border border-white bg-gradient-to-b to-white p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft ${t.tone.card}`}>
              <Quote size={22} className={t.tone.quote} />
              <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-600">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-5 flex items-center gap-3">
                <span className={`grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br ${t.tone.avatar}`}>
                  <AnimatedEmoji name={t.emoji} size={28} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.role}</p>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
