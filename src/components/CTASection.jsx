import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="mt-20 overflow-hidden rounded-[28px] bg-[radial-gradient(circle_at_20%_20%,#4d6b4a,transparent_60%),radial-gradient(circle_at_85%_0%,#2f4858,transparent_55%),linear-gradient(160deg,#1c2b21,#0f1b16)] px-6 py-12 text-center shadow-card sm:mt-24 sm:px-12 sm:py-14">
      <p className="flex items-center justify-center gap-2 text-[11px] font-bold tracking-wide text-white/60">
        <Sparkles size={12} /> READY WHEN YOU ARE
      </p>
      <h2 className="mx-auto mt-3 max-w-xl text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
        Give yourself five honest minutes today.
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/60">
        No sign-up, no judgment — just a quiet space to check in with yourself.
      </p>
      <Link
        to="/reflect"
        className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-slate-900 shadow-soft transition hover:bg-slate-100"
      >
        Start My Reflection <ArrowRight size={16} />
      </Link>
    </section>
  );
}
