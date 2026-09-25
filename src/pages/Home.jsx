import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Lock, MapPin, Waves, Leaf, Heart } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import FeatureGrid from '../components/FeatureGrid';
import Testimonials from '../components/Testimonials';
import FAQAccordion from '../components/FAQAccordion';
import CTASection from '../components/CTASection';

const metrics = [
  { label: 'Mind Clarity', value: 78, note: 'Lucid & present. Minimal cognitive drag today.', bar: 'bg-indigo-500' },
  { label: 'Sleep Rhythm', value: 64, note: 'Gentle circadian cycles. Restored upon waking.', bar: 'bg-sky-500' },
  { label: 'Emotional Load', value: 42, note: 'Grounded balance. Moderate adaptive bandwidth.', bar: 'bg-emerald-500' },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-10">
      {/* Hero */}
      <section className="mx-auto flex min-h-[calc(100svh-73px)] max-w-3xl flex-col items-center justify-center py-12 text-center sm:py-16">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-1.5 text-[11px] font-semibold tracking-wide text-slate-500">
          <Sparkles size={12} className="text-amber-500" />
          2025 SELF-REFLECTION JOURNEY <span className="text-slate-300">•</span> 5 MINUTES
        </div>

        <h1 className="text-3xl font-extrabold leading-[1.15] tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
          How are you really doing?
          <br />
          <span className="bg-gradient-to-r from-indigo-600 via-sky-600 to-teal-500 bg-clip-text text-transparent">
            Explore Your Mental Wellbeing.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
          Answer a few honest questions and discover your current wellbeing score. A warm,
          mindful space engineered for self-discovery, deliberately free from clinical judgment.
        </p>

        <Link
          to="/reflect"
          className="mt-8 inline-flex items-center gap-3 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-indigo-700 sm:px-7 sm:py-3.5"
        >
          Explore Myself
          <ArrowRight size={16} />
        </Link>

        <p className="mt-4 flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-400">
          <ShieldCheck size={13} className="text-emerald-500" />
          How your score is calculated <span className="text-slate-300">•</span> 100% Private &amp;
          Anonymous
        </p>
      </section>

      {/* Sandbox panel */}
      <section className="relative mx-auto mt-16 max-w-4xl sm:mt-20">
        <div className="pointer-events-none absolute -left-16 top-10 z-10 hidden max-w-[210px] rounded-2xl border border-slate-100 bg-white p-4 shadow-card xl:block">
          <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-wide text-indigo-600">
            <Leaf size={12} /> COMPASSION FIRST
          </p>
          <p className="mt-1.5 text-[13px] leading-snug text-slate-500">
            Take a deep breath. There are no right or wrong answers here.
          </p>
        </div>

        <div className="pointer-events-none absolute -right-16 top-0 z-10 hidden max-w-[210px] rounded-2xl border border-slate-100 bg-white p-4 shadow-card xl:block">
          <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-wide text-slate-600">
            <Lock size={12} /> CONFIDENTIAL
          </p>
          <p className="mt-1.5 text-[13px] leading-snug text-slate-500">
            Zero tracking, zero cookies. Everything stays on this browser session.
          </p>
        </div>

        <div className="rounded-[28px] border border-slate-100 bg-white/90 p-5 shadow-card sm:p-8">
          <p className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <Waves size={16} className="text-indigo-500" /> Daily Resonance Sandbox
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Tweak your present state to feel how the assessment reflects your emotional
            architecture.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {metrics.map((m) => (
              <MetricCard key={m.label} {...m} />
            ))}
          </div>

          <div className="mt-6 rounded-2xl bg-slate-50/80 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Waves size={15} className="text-slate-400" /> Overall Internal Resonance
              </p>
              <span className="text-sm font-semibold text-indigo-600">Tranquil &amp; Grounded</span>
            </div>
            <div className="relative mt-4 h-2 w-full rounded-full bg-gradient-to-r from-teal-500 via-indigo-400 to-indigo-600">
              <div
                className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-4 border-indigo-600 bg-white shadow"
                style={{ left: '68%' }}
              />
            </div>
            <div className="mt-2 flex justify-between text-[11px] font-medium text-slate-400">
              <span>Turbulent</span>
              <span>Contemplative</span>
              <span>Harmonious</span>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute -bottom-6 -left-16 z-10 hidden max-w-[210px] rounded-2xl border border-slate-100 bg-white p-4 shadow-card xl:block">
          <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-wide text-teal-600">
            <MapPin size={12} /> MINDFUL ARCHITECTURE
          </p>
          <p className="mt-1.5 text-[13px] leading-snug text-slate-500">
            25 gentle questions curated for genuine emotional clarity &amp; perspective.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="mt-12 flex flex-wrap items-center justify-center gap-2 text-center text-sm text-slate-400">
        <Heart size={14} className="text-rose-400" />
        <span className="font-semibold text-slate-600">84,219 reflections</span>
        <span className="text-slate-300">•</span>
        <span>Completed this month by people seeking inner clarity</span>
        <span className="text-slate-300">•</span>
        <span className="font-medium tracking-wide text-slate-500">VALIDATED INDICES</span>
      </section>

      <FeatureGrid />
      <Testimonials />
      <FAQAccordion />
      <CTASection />
    </div>
  );
}
