import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import AnimatedEmoji from './AnimatedEmoji';

export default function CTASection() {
  return (
    <section className="relative mt-20 overflow-hidden rounded-[28px] bg-[radial-gradient(circle_at_15%_20%,#2dd4bf_0%,transparent_45%),radial-gradient(circle_at_85%_10%,#f472b6_0%,transparent_45%),radial-gradient(circle_at_60%_110%,#fb923c_0%,transparent_45%),linear-gradient(135deg,#4f46e5,#7c3aed_50%,#c026d3)] px-6 py-14 text-center shadow-soft sm:mt-24 sm:px-12 sm:py-16">
      <span aria-hidden className="pointer-events-none absolute left-6 top-6 hidden animate-emoji-bob sm:block">
        <AnimatedEmoji name="sparkles" size={40} />
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute bottom-6 right-8 hidden animate-emoji-bob sm:block"
        style={{ animationDelay: '1.5s' }}
      >
        <AnimatedEmoji name="heart" size={44} />
      </span>

      <p className="relative flex items-center justify-center gap-2 text-[11px] font-bold tracking-[0.12em] text-white/80">
        <Sparkles size={12} /> READY WHEN YOU ARE
      </p>
      <h2 className="relative mx-auto mt-3 max-w-xl text-2xl font-extrabold tracking-tight text-white sm:text-4xl">
        Give yourself five honest minutes today.
      </h2>
      <p className="relative mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/80">
        No sign-up, no judgment. Just a quiet space to check in with yourself.
      </p>
      <Link
        to="/reflect"
        className="group relative mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-violet-700 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
      >
        Start My Reflection <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
      </Link>
    </section>
  );
}
