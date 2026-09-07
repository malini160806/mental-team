import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  ShieldCheck,
} from 'lucide-react';
import { questions, sections } from '../data/questions';
import { SECTION_ICON, SECTION_INSIGHT } from '../data/insightContent';

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

function statusFor(score) {
  if (score >= 70) return 'Harmonious';
  if (score >= 50) return 'Balanced';
  if (score >= 30) return 'Strained';
  return 'Overwhelmed';
}

export default function Insights() {
  const { state } = useLocation();
  const answers = state?.answers ?? null;
  const score = state?.score ?? 72;
  const status = statusFor(score);

  const derived = useMemo(() => {
    if (!answers) {
      return {
        stressPercent: 28,
        stressLabel: 'Moderate',
        somatic: 88,
        clarity: 64,
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

    const avgOf = (keys) => {
      let total = 0;
      let count = 0;
      keys.forEach((k) => {
        total += bySection[k].total;
        count += bySection[k].count;
      });
      return count ? total / count : 0;
    };

    const stressAvg = avgOf(Object.keys(sections));
    const stressPercent = Math.round((stressAvg / 3) * 100);
    const stressLabel = stressPercent <= 33 ? 'Low' : stressPercent <= 66 ? 'Moderate' : 'Elevated';

    const somatic = Math.round(100 - (avgOf(['body', 'sleep']) / 3) * 100);
    const clarity = Math.round(100 - (avgOf(['focus', 'mind']) / 3) * 100);

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

    return { stressPercent, stressLabel, somatic, clarity, themes };
  }, [answers]);

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-12 lg:px-10">
      {/* Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-[11px] font-bold tracking-wide text-emerald-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            REFLECTION COMPLETED <span className="text-slate-300">•</span> PERSONAL PORTRAIT
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Your Wellbeing Discovery
          </h1>
          <p className="mt-2 max-w-lg text-sm text-slate-500">
            A mindful snapshot synthesized from your contemplative check-in today.
          </p>
        </div>
        <div className="flex shrink-0 gap-3">
          <button className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
            <Download size={15} /> Export Report
          </button>
          <button className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
            <Share2 size={15} /> Share
          </button>
        </div>
      </div>

      {/* Score card */}
      <div className="mt-8 grid gap-8 rounded-[28px] border border-slate-100 bg-white/90 p-8 shadow-card lg:grid-cols-[280px_1fr]">
        <div className="flex flex-col items-center justify-center gap-3 border-b border-slate-100 pb-8 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8">
          <div
            className="relative grid h-44 w-44 place-items-center rounded-full"
            style={{
              background: `conic-gradient(#4f46e5 ${score * 3.6}deg, #e2e8f0 0deg)`,
            }}
          >
            <div className="grid h-36 w-36 place-items-center rounded-full bg-white text-center">
              <div>
                <p className="text-[10px] font-semibold tracking-wide text-slate-400">
                  SYNTHESIZED INDEX
                </p>
                <p className="text-4xl font-extrabold text-slate-900">
                  {score}
                  <span className="text-lg font-semibold text-slate-400">/100</span>
                </p>
                <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                  {status}
                </span>
              </div>
            </div>
          </div>
          <p className="max-w-[220px] text-center text-xs leading-relaxed text-slate-400">
            A balanced equilibrium between energetic processing and physical recuperation.
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold tracking-wide text-slate-400">
              ACTIVE INDICATOR
            </p>
            <p className="text-[11px] font-medium text-slate-400">Evaluated Today</p>
          </div>
          <p className="mt-1 text-lg font-bold text-slate-900">
            Wellbeing Balance: <span className="text-indigo-600">{status}</span>
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Your physiological inputs reflect elevated mental activation accompanied by grounded
            somatic stability.
          </p>

          <div className="mt-5 rounded-2xl bg-slate-50/80 p-5">
            <div className="flex items-center justify-between text-sm">
              <p className="font-medium text-slate-600">Stress Level Spectrum</p>
              <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-indigo-600 shadow-sm">
                Current: {derived.stressLabel}
              </span>
            </div>
            <div className="relative mt-4 h-2 w-full rounded-full bg-gradient-to-r from-teal-400 via-indigo-400 to-violet-400">
              <div
                className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-4 border-indigo-600 bg-white shadow"
                style={{ left: `${Math.min(96, Math.max(2, derived.stressPercent))}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-[11px] font-medium text-slate-400">
              <span className="text-left">
                Low
                <br />
                Grounded
              </span>
              <span className="text-center">
                Moderate
                <br />
                Responsive
              </span>
              <span className="text-right">
                Elevated
                <br />
                Overloaded
              </span>
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50/80 p-4">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                <ShieldCheck size={16} />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900">{derived.somatic}%</p>
                <p className="text-xs text-slate-400">Somatic Grounding</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50/80 p-4">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                <Sun size={16} />
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900">{derived.clarity}%</p>
                <p className="text-xs text-slate-400">Clarity Index</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Thematic Reflections */}
      <div className="mt-16">
        <p className="text-[11px] font-bold tracking-wide text-indigo-500">PERSONALIZED PILLARS</p>
        <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">
          Thematic Reflections
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Derived from your introspective patterns and cadence responses.
        </p>

        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          {derived.themes.map(({ key, tier }) => {
            const Icon = SECTION_ICON[key];
            const content = SECTION_INSIGHT[key][tier];
            const badgeStyle =
              tier === 'attention'
                ? 'bg-amber-50 text-amber-600'
                : 'bg-emerald-50 text-emerald-600';
            return (
              <div key={key} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-card">
                <div className="flex items-center justify-between">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
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
      <div className="mt-16 rounded-[28px] bg-indigo-50/40 p-8">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] font-bold tracking-wide text-indigo-500">
              LOW-PRESSURE INVITATIONS
            </p>
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

        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          {MICRO_STEPS.map((step) => (
            <div key={step.title} className="flex flex-col rounded-3xl bg-white p-5 shadow-card">
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

      {/* Atmosphere + practice note */}
      <div className="mt-16 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="relative flex min-h-[240px] items-end overflow-hidden rounded-[28px] bg-[radial-gradient(circle_at_25%_20%,#5a4632,transparent_60%),radial-gradient(circle_at_85%_0%,#3a4a3f,transparent_55%),linear-gradient(160deg,#2a241d,#14110d)] p-7 shadow-card">
          <div className="relative text-white">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-white/60">
              Atmosphere
            </p>
            <p className="mt-2 max-w-xs text-base font-medium leading-snug">
              Room to exhale without expectation.
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center rounded-[28px] border border-slate-100 bg-white p-8 shadow-card">
          <p className="text-[11px] font-bold tracking-wide text-indigo-500">
            CONTINUOUS REFLECTION
          </p>
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

      {/* Gentle notice */}
      <div className="mt-10 flex items-start gap-3 rounded-2xl border border-amber-100 bg-amber-50/60 p-5">
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

      {/* Bottom actions */}
      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <button className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
            <FileText size={15} /> Save Reflection Summary (PDF)
          </button>
          <button className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
            <RotateCw size={15} /> Retake in 30 Days
          </button>
        </div>
        <Link
          to="/reflect"
          className="flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-indigo-700"
        >
          Practice 2-min Box Breathing Now <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
