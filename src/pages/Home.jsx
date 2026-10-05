import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Lock, MapPin, Waves, Leaf, Heart, RotateCcw } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import FeatureGrid from '../components/FeatureGrid';
import Testimonials from '../components/Testimonials';
import FAQAccordion from '../components/FAQAccordion';
import CTASection from '../components/CTASection';
import MoodCheck from '../components/MoodCheck';
import AnimatedEmoji from '../components/AnimatedEmoji';
import Reveal from '../components/Reveal';
import CountUp from '../components/CountUp';

const METRICS = [
  { key: 'clarity', label: 'Mind Clarity', color: '#6366f1', note: 'How lucid and present your thoughts feel today.' },
  { key: 'sleep', label: 'Sleep Rhythm', color: '#0ea5e9', note: 'How restored you felt when you woke up.' },
  { key: 'load', label: 'Emotional Load', color: '#d946ef', note: 'How much you are carrying emotionally right now.' },
];

const DEFAULT_METRICS = { clarity: 78, sleep: 64, load: 42 };

function resonanceFor({ clarity, sleep, load }) {
  const value = Math.round((clarity + sleep + (100 - load)) / 3);
  if (value < 35) return { value, label: 'Turbulent', emoji: 'weary', tone: 'text-rose-600' };
  if (value < 50) return { value, label: 'Stretched Thin', emoji: 'worried', tone: 'text-amber-600' };
  if (value < 65) return { value, label: 'Contemplative', emoji: 'neutral', tone: 'text-sky-600' };
  if (value < 80) return { value, label: 'Tranquil & Grounded', emoji: 'relieved', tone: 'text-indigo-600' };
  return { value, label: 'Harmonious', emoji: 'starstruck', tone: 'text-emerald-600' };
}

// Floating emoji around the hero, desktop only.
const HERO_EMOJI = [
  { name: 'smile', size: 56, className: 'left-[4%] top-[18%]', delay: '0s' },
  { name: 'seedling', size: 48, className: 'right-[6%] top-[14%]', delay: '1.2s' },
  { name: 'sparkles', size: 40, className: 'left-[12%] bottom-[22%]', delay: '0.6s' },
  { name: 'heart', size: 44, className: 'right-[10%] bottom-[26%]', delay: '1.8s' },
  { name: 'lotus', size: 52, className: 'left-[22%] top-[6%]', delay: '2.4s' },
];

export default function Home() {
  const [metrics, setMetrics] = useState(DEFAULT_METRICS);
  const resonance = resonanceFor(metrics);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-10">
      {/* Hero */}
      <section className="relative flex min-h-[calc(100svh-73px)] flex-col items-center justify-center py-12 text-center sm:py-16">
        {HERO_EMOJI.map((e) => (
          <span
            key={e.name}
            aria-hidden
            className={`pointer-events-none absolute hidden animate-emoji-bob lg:block ${e.className}`}
            style={{ animationDelay: e.delay }}
          >
            <AnimatedEmoji name={e.name} size={e.size} />
          </span>
        ))}

        <div className="animate-fade-up mx-auto flex max-w-3xl flex-col items-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-gradient-to-r from-teal-50 via-white to-fuchsia-50 py-1 pl-1.5 pr-4 text-[11px] font-semibold tracking-wide text-violet-600 shadow-sm">
            <AnimatedEmoji name="wave" size={22} />
            SELF-REFLECTION JOURNEY <span className="text-fuchsia-300">•</span> 5 MINUTES
          </div>

          <h1 className="text-3xl font-extrabold leading-[1.15] tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
            How are you really doing?
            <br />
            <span className="text-gradient text-shimmer">
              Explore Your Mental Wellbeing.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-base">
            Answer a few honest questions and discover your current wellbeing score. A warm,
            mindful space built for self-discovery, deliberately free from clinical judgment.
          </p>
        </div>

        <div className="animate-fade-up flex w-full flex-col items-center" style={{ animationDelay: '120ms' }}>
          <MoodCheck />

          <Link
            to="/reflect"
            className="btn-gradient group mt-8 inline-flex items-center gap-3 rounded-full px-7 py-3.5 text-sm font-semibold"
          >
            Explore Myself
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>

          <p className="mt-4 flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck size={13} className="text-emerald-500" />
            25 questions <span className="text-slate-300">•</span> 100% Private &amp; Anonymous
          </p>
        </div>
      </section>

      {/* Sandbox panel */}
      <Reveal as="section" className="relative mx-auto mt-8 max-w-4xl sm:mt-12">
        <div className="pointer-events-none absolute -left-16 top-10 z-10 hidden max-w-[210px] rounded-2xl border border-indigo-100 bg-gradient-to-br from-white to-indigo-50 p-4 shadow-card xl:block">
          <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-wide text-indigo-600">
            <Leaf size={12} /> COMPASSION FIRST
          </p>
          <p className="mt-1.5 text-[13px] leading-snug text-slate-500">
            Take a deep breath. There are no right or wrong answers here.
          </p>
        </div>

        <div className="pointer-events-none absolute -right-16 top-0 z-10 hidden max-w-[210px] rounded-2xl border border-fuchsia-100 bg-gradient-to-br from-white to-fuchsia-50 p-4 shadow-card xl:block">
          <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-wide text-fuchsia-600">
            <Lock size={12} /> CONFIDENTIAL
          </p>
          <p className="mt-1.5 text-[13px] leading-snug text-slate-500">
            No accounts, no ads. Your answers are stored anonymously.
          </p>
        </div>

        <div className="gradient-border rounded-[30px] shadow-soft">
          <div className="rounded-[28.5px] bg-white/95 p-5 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white">
                    <Waves size={14} />
                  </span>
                  Daily Resonance Sandbox
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  Drag the sliders to feel how your state shifts the overall picture.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMetrics(DEFAULT_METRICS)}
                className="flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
              >
                <RotateCcw size={12} /> Reset
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {METRICS.map((m) => (
                <MetricCard
                  key={m.key}
                  label={m.label}
                  note={m.note}
                  color={m.color}
                  value={metrics[m.key]}
                  onChange={(v) => setMetrics((prev) => ({ ...prev, [m.key]: v }))}
                />
              ))}
            </div>

            <div className="mt-6 flex items-center gap-4 rounded-2xl bg-gradient-to-r from-indigo-50 via-violet-50 to-fuchsia-50 p-5">
              <div key={resonance.emoji} className="animate-pop-in hidden shrink-0 sm:block">
                <AnimatedEmoji name={resonance.emoji} size={56} label={resonance.label} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-medium text-slate-700">Overall Internal Resonance</p>
                  <span className={`text-sm font-semibold transition-colors ${resonance.tone}`}>
                    {resonance.label} · {resonance.value}
                  </span>
                </div>
                <div
                  className="relative mt-4 h-2 w-full rounded-full"
                  style={{ background: 'linear-gradient(to right, #fb7185, #fcd34d, #38bdf8, #10b981)' }}
                >
                  <div
                    className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-violet-600 bg-white shadow transition-[left] duration-300 ease-out"
                    style={{ left: `${Math.min(98, Math.max(2, resonance.value))}%` }}
                  />
                </div>
                <div className="mt-2 flex justify-between text-[11px] font-medium text-slate-400">
                  <span>Turbulent</span>
                  <span>Contemplative</span>
                  <span>Harmonious</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute -bottom-6 -left-16 z-10 hidden max-w-[210px] rounded-2xl border border-teal-100 bg-gradient-to-br from-white to-teal-50 p-4 shadow-card xl:block">
          <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-wide text-teal-600">
            <MapPin size={12} /> MINDFUL ARCHITECTURE
          </p>
          <p className="mt-1.5 text-[13px] leading-snug text-slate-500">
            25 gentle questions curated for genuine emotional clarity &amp; perspective.
          </p>
        </div>
      </Reveal>

      {/* Stats */}
      <Reveal as="section" className="mt-12 flex flex-wrap items-center justify-center gap-2 text-center text-sm text-slate-400">
        <Heart size={14} className="text-rose-400" />
        <span className="font-semibold text-slate-600">
          <CountUp value={84219} /> reflections
        </span>
        <span className="text-slate-300">•</span>
        <span>Completed this month by people seeking inner clarity</span>
      </Reveal>

      <FeatureGrid />
      <Testimonials />
      <Reveal>
        <FAQAccordion />
      </Reveal>
      <Reveal>
        <CTASection />
      </Reveal>
    </div>
  );
}
