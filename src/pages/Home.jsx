import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Lock,
  MapPin,
  Waves,
  Leaf,
  LineChart,
  Heart,
} from 'lucide-react';

const metrics = [
  { label: 'Mind Clarity', value: 78, note: 'Lucid & present. Minimal cognitive drag today.', bar: 'bg-indigo-500' },
  { label: 'Sleep Rhythm', value: 64, note: 'Gentle circadian cycles. Restored upon waking.', bar: 'bg-sky-500' },
  { label: 'Emotional Load', value: 42, note: 'Grounded balance. Moderate adaptive bandwidth.', bar: 'bg-emerald-500' },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-6 pb-24 pt-16 lg:px-10">
      {/* Hero */}
      <section className="mx-auto max-w-3xl text-center">
        <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-1.5 text-[11px] font-semibold tracking-wide text-slate-500">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
          <Sparkles size={12} className="text-amber-500" />
          2025 SELF-REFLECTION JOURNEY <span className="text-slate-300">•</span> 5 MINUTES
        </div>

        <h1 className="text-4xl font-extrabold leading-[1.15] tracking-tight text-slate-900 sm:text-5xl">
          How are you really doing?
          <br />
          <span className="bg-gradient-to-r from-indigo-600 via-sky-600 to-teal-500 bg-clip-text text-transparent">
            Explore Your Mental Wellbeing.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-500">
          Answer a few honest questions and discover your current wellbeing score. A warm,
          mindful space engineered for self-discovery, deliberately free from clinical judgment.
        </p>

        <Link
          to="/reflect"
          className="mt-8 inline-flex items-center gap-3 rounded-full bg-indigo-600 px-7 py-3.5 text-sm font-semibold text-white shadow-soft transition hover:bg-indigo-700"
        >
          Explore Myself
          <ArrowRight size={16} />
          <span className="rounded-md bg-white/15 px-2 py-0.5 text-[11px] font-medium">
            Space ↵
          </span>
        </Link>

        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <ShieldCheck size={13} className="text-emerald-500" />
          How your score is calculated <span className="text-slate-300">•</span> 100% Private &amp;
          Anonymous
        </p>
      </section>

      {/* Sandbox panel */}
      <section className="relative mx-auto mt-20 max-w-4xl">
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

        <div className="rounded-[28px] border border-slate-100 bg-white/90 p-6 shadow-card sm:p-8">
          <p className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <Waves size={16} className="text-indigo-500" /> Daily Resonance Sandbox
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Tweak your present state to feel how the assessment reflects your emotional
            architecture.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {metrics.map((m) => (
              <div key={m.label} className="rounded-2xl bg-slate-50/80 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-700">{m.label}</p>
                  <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-slate-600 shadow-sm">
                    {m.value}%
                  </span>
                </div>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    className={`h-full rounded-full ${m.bar}`}
                    style={{ width: `${m.value}%` }}
                  />
                </div>
                <p className="mt-3 text-xs leading-relaxed text-slate-400">{m.note}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl bg-slate-50/80 p-5">
            <div className="flex items-center justify-between">
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

      {/* Atmosphere + features */}
      <section className="mt-24 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="relative flex min-h-[280px] items-end overflow-hidden rounded-[28px] bg-[radial-gradient(circle_at_30%_20%,#4d6b4a,transparent_60%),radial-gradient(circle_at_80%_0%,#2f4858,transparent_55%),linear-gradient(160deg,#1c2b21,#0f1b16)] p-8 shadow-card">
          <div className="absolute inset-0 opacity-40 mix-blend-soft-light [background-image:repeating-linear-gradient(115deg,rgba(255,255,255,0.06)_0px,rgba(255,255,255,0.06)_2px,transparent_2px,transparent_10px)]" />
          <div className="relative text-white">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-white/60">
              Spatial Atmosphere
            </p>
            <p className="mt-2 max-w-sm text-lg font-medium leading-snug">
              A sanctuary designed with intentional silence and zero hurry.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex-1 rounded-3xl border border-slate-100 bg-white p-6 shadow-card">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
              <Leaf size={18} />
            </div>
            <p className="mt-4 text-base font-semibold text-slate-800">Empathetic Micro-Steps</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Navigate prompts at your own speed with adaptive breathing pauses built directly
              between introspective tiers.
            </p>
          </div>
          <div className="flex-1 rounded-3xl border border-slate-100 bg-white p-6 shadow-card">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-sky-50 text-sky-600">
              <LineChart size={18} />
            </div>
            <p className="mt-4 text-base font-semibold text-slate-800">Non-Diagnostic Synthesis</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Gain immediate personal insights rooted in positive psychology and cognitive
              resonance models without sterile clinical jargon.
            </p>
          </div>
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
    </div>
  );
}
