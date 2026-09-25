import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import {
  Download,
  Share2,
  ArrowRight,
  Wind,
  NotebookPen,
  Sun,
  AlertTriangle,
  FileText,
  RotateCw,
  Moon,
  Sparkles,
} from 'lucide-react';
import { questions, sections } from '../data/questions';
import { SECTION_ICON, SECTION_INSIGHT } from '../data/insightContent';
import SectionTag from '../components/SectionTag';
import { RESULT_KEY } from './Reflect';

const MICRO_STEPS = [
  {
    icon: Wind,
    color: 'bg-sky-50 text-sky-600',
    title: 'The 4-7-8 Evening Unwind',
    desc: '3 minutes of rhythmic breathing before closing your eyes. Inhale for 4s, hold gently for 7s, exhale completely for 8s.',
    duration: '3 Mins',
    action: 'Try Now',
  },
  {
    icon: NotebookPen,
    color: 'bg-indigo-50 text-indigo-600',
    title: 'Brain Dump Journaling',
    desc: "Write down tomorrow's 3 tasks before 9 PM to quiet nighttime racing thoughts and transfer cognitive burden to paper.",
    duration: '4 Mins',
    action: 'Open Sheet',
  },
  {
    icon: Sun,
    color: 'bg-amber-50 text-amber-600',
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
  return <InsightsView answers={result.answers ?? null} assessment={result.assessment} />;
}

function InsightsView({ answers, assessment }) {
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

  const derived = useMemo(() => {
    if (!answers) {
      return {
        themes: [
          { key: 'focus', tier: 'attention' },
          { key: 'sleep', tier: 'strength' },
          { key: 'connection', tier: 'strength' },
        ],
      };
    }

    const bySection = {};
    Object.keys(sections).forEach((key) => {
      bySection[key] = { total: 0, count: 0 };
    });
    questions.forEach((q) => {
      const w = answers[q.id];
      if (w === undefined) return;
      bySection[q.section].total += w;
      bySection[q.section].count += 1;
    });

    const ranked = Object.entries(bySection)
      .filter(([, v]) => v.count > 0)
      .map(([key, v]) => ({ key, avg: v.total / v.count }))
      .sort((a, b) => b.avg - a.avg);

    const themes = [];
    if (ranked.length) {
      themes.push({ key: ranked[0].key, tier: 'attention' });
      ranked
        .slice(1)
        .reverse()
        .slice(0, 2)
        .forEach((r) => themes.push({ key: r.key, tier: 'strength' }));
    }
    while (themes.length < 3) {
      themes.push({ key: 'sleep', tier: 'strength' });
    }

    return { themes };
  }, [answers]);

  return (
    <div className="relative mx-auto max-w-6xl overflow-hidden px-6 pb-24 pt-12 lg:px-10">
      {/* Decorative ambient blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-16 h-72 w-72 animate-float-slow rounded-full bg-teal-200/30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 top-24 h-80 w-80 animate-float-slower rounded-full bg-indigo-200/30 blur-3xl"
      />

      {/* Header */}
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="animate-fade-up">
          <SectionTag icon={Sparkles}>WELLBEING SUMMARY</SectionTag>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Your Wellbeing Discovery
          </h1>
          <p className="mt-2 max-w-lg text-sm text-slate-500">
            A mindful snapshot synthesized from your contemplative check-in today.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <button className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-soft">
            <Download size={15} /> Export Report
          </button>
          <button className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-soft">
            <Share2 size={15} /> Share
          </button>
        </div>
      </div>

      {/* Score card */}
      <div className="animate-fade-up relative mt-8 grid gap-8 rounded-[28px] border border-slate-100 bg-white/90 p-6 shadow-card sm:p-8 lg:grid-cols-[280px_1fr]" style={{ animationDelay: '80ms' }}>
        <div className="flex flex-col items-center justify-center gap-3 border-b border-slate-100 pb-8 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8">
          <div className="relative grid h-44 w-44 place-items-center">
            <div className="animate-pulse-ring absolute inset-0 rounded-full bg-indigo-400/20" />
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

          <div className="mt-5 rounded-2xl bg-slate-50/80 p-5">
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
              <span className="text-left">
                Low
                <br />0–33
              </span>
              <span className="text-center">
                Moderate
                <br />
                34–66
              </span>
              <span className="text-right">
                High
                <br />
                67–100
              </span>
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
          {derived.themes.map(({ key, tier }, i) => {
            const Icon = SECTION_ICON[key];
            const content = SECTION_INSIGHT[key][tier];
            const badgeStyle =
              tier === 'attention'
                ? 'bg-amber-50 text-amber-600'
                : 'bg-emerald-50 text-emerald-600';
            return (
              <div
                key={key}
                className="animate-fade-up group rounded-3xl border border-slate-100 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-soft"
                style={{ animationDelay: `${120 + i * 90}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600 transition-transform group-hover:scale-110">
                    <Icon size={18} />
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${badgeStyle}`}>
                    {content.badge}
                  </span>
                </div>
                <p className="mt-4 text-base font-semibold text-slate-800">
                  {sections[key].label}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{content.desc}</p>
                <p className="mt-4 flex items-center gap-1.5 text-xs font-medium text-indigo-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                  Suggested: {content.suggestion}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Micro steps */}
      <div className="animate-fade-up relative mt-16 overflow-hidden rounded-[28px] bg-indigo-50/40 p-8" style={{ animationDelay: '160ms' }}>
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
              className="animate-fade-up flex flex-col rounded-3xl bg-white p-5 shadow-card transition hover:-translate-y-1 hover:shadow-soft"
              style={{ animationDelay: `${220 + i * 90}ms` }}
            >
              <div className={`grid h-10 w-10 place-items-center rounded-xl ${step.color}`}>
                <step.icon size={18} />
              </div>
              <p className="mt-4 text-sm font-semibold text-slate-800">{step.title}</p>
              <p className="mt-2 flex-1 text-xs leading-relaxed text-slate-500">{step.desc}</p>
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="text-slate-400">Duration: {step.duration}</span>
                <button className="flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-700">
                  {step.action} <ArrowRight size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="animate-fade-up relative flex min-h-[240px] items-end overflow-hidden rounded-[28px] bg-[radial-gradient(circle_at_25%_20%,#5a4632,transparent_60%),radial-gradient(circle_at_85%_0%,#3a4a3f,transparent_55%),linear-gradient(160deg,#2a241d,#14110d)] p-7 shadow-card">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-6 top-6 grid h-24 w-24 animate-float-slower place-items-center rounded-full bg-white/10 backdrop-blur-sm"
          >
            <Moon size={32} className="text-white/70" />
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute -left-8 bottom-10 h-16 w-16 animate-float-slow rounded-full bg-emerald-300/20 blur-xl"
          />
          <div className="relative text-white">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-white/60">
              Atmosphere
            </p>
            <p className="mt-2 max-w-xs text-base font-medium leading-snug">
              Room to exhale without expectation.
            </p>
          </div>
        </div>

        <div className="animate-fade-up flex flex-col justify-center rounded-[28px] border border-slate-100 bg-white p-8 shadow-card" style={{ animationDelay: '80ms' }}>
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
          <button className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-soft">
            <FileText size={15} /> Save Reflection Summary (PDF)
          </button>
          <button className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-soft">
            <RotateCw size={15} /> Retake in 30 Days
          </button>
        </div>
        <Link
          to="/reflect"
          className="flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-indigo-700"
        >
          Practice 2-min Box Breathing Now <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
