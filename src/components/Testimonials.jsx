import { Quote } from 'lucide-react';
import SectionTag from './SectionTag';

const TESTIMONIALS = [
  {
    quote: 'Five honest minutes gave me language for what I was feeling all week.',
    name: 'Priya R.',
    role: 'Graduate Student',
  },
  {
    quote: 'No diagnosis, no pressure — just a mirror that helped me notice my own patterns.',
    name: 'Daniel K.',
    role: 'Software Engineer',
  },
  {
    quote: 'The breathing pauses between questions genuinely slowed my racing thoughts down.',
    name: 'Meera S.',
    role: 'Product Designer',
  },
];

export default function Testimonials() {
  return (
    <section className="mt-20 sm:mt-24">
      <div className="mx-auto max-w-2xl text-center">
        <SectionTag className="justify-center">VOICES FROM THE SANCTUARY</SectionTag>
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          People leave a little lighter
        </h2>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <div
            key={t.name}
            className="flex flex-col rounded-3xl border border-slate-100 bg-white p-6 shadow-card"
          >
            <Quote size={20} className="text-indigo-300" />
            <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-600">&ldquo;{t.quote}&rdquo;</p>
            <p className="mt-5 text-sm font-semibold text-slate-800">{t.name}</p>
            <p className="text-xs text-slate-400">{t.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
