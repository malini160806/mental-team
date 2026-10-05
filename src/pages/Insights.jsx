import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import {
  Download,
  Share2,
  ArrowRight,
  AlertTriangle,
  FileText,
  RotateCw,
  Sparkles,
} from 'lucide-react';
import { sections } from '../data/questions';
import { LEVELS } from '../../shared/stressModel.js';
import { SECTION_INSIGHT } from '../data/insightContent';
import { SECTION_EMOJI, LEVEL_EMOJI } from '../data/emoji';
import AnimatedEmoji from '../components/AnimatedEmoji';
import SectionTag from '../components/SectionTag';
import { RESULT_KEY } from './Reflect';

const MICRO_STEPS = [
  {
    emoji: 'exhale',
    color: 'bg-sky-50',
    bar: 'from-sky-400 to-cyan-400',
    to: '/breathe',
    title: 'The 4-7-8 Evening Unwind',
    desc: '3 minutes of rhythmic breathing before closing your eyes. Inhale for 4s, hold gently for 7s, exhale completely for 8s.',
    duration: '3 Mins',
    action: 'Try Now',
  },
  {
    emoji: 'writing',
    color: 'bg-violet-50',
    bar: 'from-indigo-400 to-violet-500',
    title: 'Brain Dump Journaling',
    desc: "Write down tomorrow's 3 tasks before 9 PM to quiet nighttime racing thoughts and transfer cognitive burden to paper.",
    duration: '4 Mins',
    action: 'Open Sheet',
  },
  {
    emoji: 'sun',
    color: 'bg-amber-50',
    bar: 'from-amber-400 to-orange-500',
    title: 'A 10-minute Screen-free Stroll',
    desc: 'Natural daylight in the morning to recalibrate your circadian rhythm and provide a sensory boundary between sleep and work.',
    duration: '10 Mins',
    action: 'Schedule',
  },
];

const LEVEL_STYLE = {
  Low: {
    ring: '#10b981',
    text: 'text-emerald-600',
    pill: 'bg-emerald-50 text-emerald-700',
    note: 'Reported pressure is light across most areas right now.',
  },
  Moderate: {
    ring: '#f59e0b',
    text: 'text-amber-600',
    pill: 'bg-amber-50 text-amber-700',
    note: 'Some areas are carrying noticeable pressure worth keeping an eye on.',
  },
  High: {
    ring: '#e11d48',
    text: 'text-rose-600',
    pill: 'bg-rose-50 text-rose-700',
    note: 'Several areas are under strain — a good moment to lighten the load where you can.',
  },
};

function barColor(percent) {
  if (percent <= 33) return 'bg-emerald-500';
  if (percent <= 66) return 'bg-amber-400';
  return 'bg-rose-500';
}

// Shown when the page is opened directly, without completing the check-in.
function loadResult() {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(RESULT_KEY));
    return parsed?.assessment ? parsed : null;
  } catch {
    return null;
  }
}

// Insights only opens once the Reflect check-in has been completed.
export default function Insights() {
  const { state } = useLocation();
  const result = state?.assessment ? state : loadResult();
  if (!result) return <Navigate to="/reflect" replace />;
  return <InsightsView assessment={result.assessment} />;
}

// Level bands for the spectrum, e.g. [{ level: 'Low', from: 0, to: 33 }, …].
const LEVEL_BANDS = LEVELS.map((l, i) => ({ ...l, from: i ? LEVELS[i - 1].max + 1 : 0, to: l.max }));

function InsightsView({ assessment }) {
  const score = Math.round(assessment.stressScore);
  const level = assessment.stressLevel;
  const levelStyle = LEVEL_STYLE[level];

  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    setAnimatedScore(0);
    const duration = 1100;
    const start = performance.now();
    let frame;

    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setAnimatedScore(Math.round(eased * score));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  // Themes follow the model's per-section pressure, so they agree with the score:
  // the highest-pressure section needs attention, the two lowest are strengths.
  const themes = useMemo(() => {
    const ranked = (assessment.categories ?? [])
      .filter((c) => SECTION_INSIGHT[c.key])
      .sort((a, b) => b.percent - a.percent);
    const picked = [];
    if (ranked.length) {
      picked.push({ key: ranked[0].key, tier: 'attention' });
      ranked
        .slice(1)
        .reverse()
        .slice(0, 2)
        .forEach((c) => picked.push({ key: c.key, tier: 'strength' }));
    }
    ['sleep', 'connection', 'focus'].forEach((key) => {
      if (picked.length < 3 && !picked.some((t) => t.key === key)) picked.push({ key, tier: 'strength' });
    });
    return picked;
  }, [assessment]);

  const isPartial = assessment.completeness === 'partial';
  const hasBreakdown = Boolean(assessment.adjustedFeatures);

  return (
    <div className="relative mx-auto max-w-6xl overflow-hidden px-6 pb-24 pt-12 lg:px-10">
      {/* Decorative ambient blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-16 h-72 w-72 animate-float-slow rounded-full bg-teal-200/40 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 top-24 h-80 w-80 animate-float-slower rounded-full bg-violet-200/40 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-1/3 top-[42rem] h-72 w-72 animate-float-slow rounded-full bg-fuchsia-200/30 blur-3xl"
      />

      {/* Header */}
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="animate-fade-up flex items-start gap-4">
          <span className="hidden shrink-0 sm:block">
            <AnimatedEmoji name="hug" size={64} />
          </span>
          <div>
            <SectionTag icon={Sparkles}>WELLBEING SUMMARY</SectionTag>
            <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Your Wellbeing <span className="text-gradient">Discovery</span>
            </h1>
            <p className="mt-2 max-w-lg text-sm text-slate-500">
              Thanks for checking in. Here&apos;s a mindful snapshot of how things feel today.
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <button className="flex items-center gap-2 rounded-full border border-violet-100 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:-translate-y-0.5 hover:bg-violet-50 hover:text-violet-700 hover:shadow-soft">
            <Download size={15} /> Export Report
          </button>
          <button className="flex items-center gap-2 rounded-full border border-violet-100 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:-translate-y-0.5 hover:bg-violet-50 hover:text-violet-700 hover:shadow-soft">
            <Share2 size={15} /> Share
          </button>
        </div>
      </div>

      {/* Score card */}
      <div className="animate-fade-up relative mt-8 grid gap-8 overflow-hidden rounded-[28px] bg-white/95 p-6 shadow-soft ring-1 ring-violet-100 sm:p-8 lg:grid-cols-[280px_1fr]" style={{ animationDelay: '80ms' }}>
        <span aria-hidden className="bar-gradient absolute inset-x-0 top-0 h-1.5" />
        <div className="flex flex-col items-center justify-center gap-3 border-b border-slate-100 pb-8 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8">
          <div className="relative grid h-44 w-44 place-items-center">
            <div className="animate-pulse-ring absolute inset-0 rounded-full bg-indigo-400/20" />
            <span
              className="animate-pop-in absolute -right-3 -top-2 z-10 grid h-14 w-14 place-items-center rounded-full bg-white shadow-card"
              style={{ animationDelay: '500ms' }}
            >
              <AnimatedEmoji name={LEVEL_EMOJI[level]} size={40} label={`${level} stress`} />
            </span>
            <div
              className="animate-pop-in relative grid h-44 w-44 place-items-center rounded-full transition-[background]"
              style={{
                background: `conic-gradient(${levelStyle.ring} ${animatedScore * 3.6}deg, #e2e8f0 0deg)`,
              }}
            >
              <div className="grid h-36 w-36 place-items-center rounded-full bg-white text-center">
                <div>
                  <p className="text-[10px] font-semibold tracking-wide text-slate-400">STRESS SCORE</p>
                  <p className="text-4xl font-extrabold text-slate-900">
                    {animatedScore}
                    <span className="text-lg font-semibold text-slate-400">/100</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${levelStyle.pill}`}>
            Stress Level: {level}
          </span>
          <p className="max-w-[220px] text-center text-xs leading-relaxed text-slate-400">
            {levelStyle.note}
          </p>
        </div>

        <div>
          <SectionTag>SNAPSHOT</SectionTag>
          <p className="mt-1 text-lg font-bold text-slate-900">
            Stress Level: <span className={levelStyle.text}>{level}</span>
          </p>
          <p className="mt-1 text-sm text-slate-500">{assessment.explanation}</p>

          {isPartial && (
            <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-amber-100 bg-amber-50/70 px-4 py-3">
              <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-500" />
              <p className="text-xs leading-relaxed text-slate-600">
                <span className="font-semibold text-slate-700">Partial result.</span> Based on{' '}
                {assessment.answeredCount} of {assessment.answeredCount + assessment.missingQuestions.length}{' '}
                questions — the score is scaled to the questions you answered, not counted as zero.
              </p>
            </div>
          )}

          {hasBreakdown && (
            <dl className="mt-4 grid grid-cols-3 gap-3">
              {[
                { label: 'Raw score', value: assessment.rawStressScore, suffix: `/${assessment.maximumScore}` },
                { label: 'Behaviours counted', value: assessment.includedFeatureCount },
                {
                  label: 'Responses',
                  value: isPartial ? 'Partial' : 'Complete',
                  accent: isPartial ? 'text-amber-600' : 'text-emerald-600',
                },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl bg-slate-50 px-3 py-3 ring-1 ring-slate-100">
                  <dt className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{stat.label}</dt>
                  <dd className={`mt-1 text-lg font-extrabold tabular-nums ${stat.accent ?? 'text-slate-900'}`}>
                    {stat.value}
                    {stat.suffix && <span className="text-xs font-semibold text-slate-400">{stat.suffix}</span>}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          <div className="mt-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-amber-50 to-rose-50 p-5">
            <div className="flex items-center justify-between text-sm">
              <p className="font-medium text-slate-600">Stress Level Spectrum</p>
              <span className={`rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold shadow-sm ${levelStyle.text}`}>
                Current: {level}
              </span>
            </div>
            <div className="relative mt-4 h-2 w-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500">
              <div
                className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-slate-700 bg-white shadow"
                style={{ left: `${Math.min(98, Math.max(2, score))}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-[11px] font-medium text-slate-400">
              {LEVEL_BANDS.map((band, i) => (
                <span
                  key={band.level}
                  className={`${i === 0 ? 'text-left' : i === LEVEL_BANDS.length - 1 ? 'text-right' : 'text-center'} ${band.level === level ? levelStyle.text : ''}`}
                >
                  {band.level}
                  <br />
                  {band.from}–{band.to}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <p className="text-sm font-medium text-slate-600">Behavioural Breakdown</p>
            <p className="text-xs text-slate-400">Reported pressure in each area — higher means more strain.</p>
            <ul className="mt-3 space-y-3">
              {[...assessment.categories]
                .sort((a, b) => b.percent - a.percent)
                .map((c) => (
                  <li key={c.key}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-600">{c.label}</span>
                      <span className="font-semibold tabular-nums text-slate-700">{c.percent}%</span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                      <div
                        className={`h-full rounded-full transition-[width] duration-700 ${barColor(c.percent)}`}
                        style={{ width: `${c.percent}%` }}
                      />
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Thematic Reflections */}
      <div className="relative mt-16">
        <SectionTag>PERSONALIZED PILLARS</SectionTag>
        <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">
          Thematic Reflections
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Derived from your introspective patterns and cadence responses.
        </p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {themes.map(({ key, tier }, i) => {
            const content = SECTION_INSIGHT[key][tier];
            const tone =
              tier === 'attention'
                ? { badge: 'bg-amber-100 text-amber-700', bar: 'from-amber-400 to-orange-500', tile: 'from-amber-50 to-orange-100', link: 'text-orange-600', dot: 'bg-orange-400' }
                : { badge: 'bg-emerald-100 text-emerald-700', bar: 'from-emerald-400 to-teal-500', tile: 'from-emerald-50 to-teal-100', link: 'text-teal-600', dot: 'bg-teal-400' };
            return (
              <div
                key={key}
                className="animate-fade-up group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-soft"
                style={{ animationDelay: `${120 + i * 90}ms` }}
              >
                <span aria-hidden className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${tone.bar}`} />
                <div className="flex items-center justify-between">
                  <div className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${tone.tile} transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110`}>
                    <AnimatedEmoji name={SECTION_EMOJI[key]} size={32} />
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${tone.badge}`}>
                    {content.badge}
                  </span>
                </div>
                <p className="mt-4 text-base font-semibold text-slate-800">
                  {sections[key].label}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{content.desc}</p>
                <p className={`mt-4 flex items-center gap-1.5 text-xs font-semibold ${tone.link}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
                  Suggested: {content.suggestion}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Micro steps */}
      <div className="animate-fade-up relative mt-16 overflow-hidden rounded-[28px] bg-gradient-to-br from-sky-50 via-violet-50 to-fuchsia-50 p-8 ring-1 ring-violet-100" style={{ animationDelay: '160ms' }}>
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 animate-float-slow rounded-full bg-white/50 blur-2xl"
        />
        <div className="relative flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <SectionTag>LOW-PRESSURE INVITATIONS</SectionTag>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">
              One Small Thing You Can Try
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Simple, tender experiments designed to recalibrate without adding to your to-do list.
            </p>
          </div>
          <p className="text-xs font-medium text-slate-400">
            No streak pressure <span className="text-slate-300">•</span> Gentle exploration
          </p>
        </div>

        <div className="relative mt-6 grid gap-5 sm:grid-cols-3">
          {MICRO_STEPS.map((step, i) => (
            <div
              key={step.title}
              className="animate-fade-up relative flex flex-col overflow-hidden rounded-3xl bg-white p-5 shadow-card transition hover:-translate-y-1 hover:shadow-soft"
              style={{ animationDelay: `${220 + i * 90}ms` }}
            >
              <span aria-hidden className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${step.bar}`} />
              <div className={`grid h-12 w-12 place-items-center rounded-2xl ${step.color}`}>
                <AnimatedEmoji name={step.emoji} size={32} />
              </div>
              <p className="mt-4 text-sm font-semibold text-slate-800">{step.title}</p>
              <p className="mt-2 flex-1 text-xs leading-relaxed text-slate-500">{step.desc}</p>
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="text-slate-400">Duration: {step.duration}</span>
                {step.to ? (
                  <Link to={step.to} className="group/link flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-700">
                    {step.action} <ArrowRight size={13} className="transition-transform group-hover/link:translate-x-0.5" />
                  </Link>
                ) : (
                  <button className="flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-700">
                    {step.action} <ArrowRight size={13} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="animate-fade-up mt-16 flex flex-col justify-center rounded-[28px] border border-slate-100 bg-white p-8 shadow-card" style={{ animationDelay: '80ms' }}>
        <SectionTag>CONTINUOUS REFLECTION</SectionTag>
        <h3 className="mt-1 text-xl font-extrabold tracking-tight text-slate-900">
          Self-inquiry is a practice, not a destination.
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-slate-500">
          Every state you inhabit contains value. Today&apos;s score represents a single wave in an
          ocean of daily transitions. By noticing your patterns early, you have already created
          space to support yourself.
        </p>
        <p className="mt-4 flex items-center gap-2 text-xs font-medium text-indigo-500">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
          Session recorded to your private vault
        </p>
      </div>

      <div className="animate-fade-up mt-10 flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50/60 p-5">
        <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-500" />
        <div>
          <p className="text-sm font-semibold text-slate-700">Gentle Notice &amp; Context</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            This is a self-reflection wellbeing score created to support personal insight and
            mindfulness, not a clinical psychiatric diagnosis. If you are feeling overwhelmed or
            experiencing acute distress, compassionate professional support is always available
            through certified care navigators.
          </p>
        </div>
      </div>

      <div className="animate-fade-up mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between" style={{ animationDelay: '80ms' }}>
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center gap-2 rounded-full border border-violet-100 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:-translate-y-0.5 hover:bg-violet-50 hover:text-violet-700 hover:shadow-soft">
            <FileText size={15} /> Save Reflection Summary (PDF)
          </button>
          <button className="flex items-center gap-2 rounded-full border border-violet-100 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:-translate-y-0.5 hover:bg-violet-50 hover:text-violet-700 hover:shadow-soft">
            <RotateCw size={15} /> Retake in 30 Days
          </button>
        </div>
        <Link
          to="/breathe"
          className="btn-gradient flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
        >
          Practice 2-min Box Breathing Now <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
