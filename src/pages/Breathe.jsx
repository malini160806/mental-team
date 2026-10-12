import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Pause, Play, RotateCcw, ArrowRight, Clock, Wind } from 'lucide-react';
import AnimatedEmoji from '../components/AnimatedEmoji';
import SectionTag from '../components/SectionTag';

// `scale` is the orb size at the END of the phase; the orb eases toward it over the phase.
const TECHNIQUES = [
  {
    id: 'box',
    name: 'Box',
    pattern: '4 · 4 · 4 · 4',
    blurb: 'Equal four-second phases to steady your focus and slow your heart rate.',
    phases: [
      { label: 'Breathe in', hint: 'Slowly fill your lungs through your nose', seconds: 4, scale: 1, emoji: 'relieved' },
      { label: 'Hold', hint: 'Keep the air in, gently', seconds: 4, scale: 1, emoji: 'sparkles' },
      { label: 'Breathe out', hint: 'Release slowly through your mouth', seconds: 4, scale: 0.6, emoji: 'exhale' },
      { label: 'Hold', hint: 'Rest with empty lungs', seconds: 4, scale: 0.6, emoji: 'leaf' },
    ],
  },
  {
    id: '478',
    name: '4-7-8',
    pattern: '4 · 7 · 8',
    blurb: 'A longer exhale to unwind before sleep or after a tense moment.',
    phases: [
      { label: 'Breathe in', hint: 'Quietly through your nose', seconds: 4, scale: 1, emoji: 'relieved' },
      { label: 'Hold', hint: 'Keep the breath, stay soft', seconds: 7, scale: 1, emoji: 'sparkles' },
      { label: 'Breathe out', hint: 'Fully, with a gentle whoosh', seconds: 8, scale: 0.6, emoji: 'exhale' },
    ],
  },
  {
    id: 'calm',
    name: 'Calm',
    pattern: '4 · 6',
    blurb: 'A simple in-and-out rhythm. Good for a quick reset anywhere.',
    phases: [
      { label: 'Breathe in', hint: 'Easy and unforced', seconds: 4, scale: 1, emoji: 'relieved' },
      { label: 'Breathe out', hint: 'Slow and complete', seconds: 6, scale: 0.6, emoji: 'exhale' },
    ],
  },
];

const DURATIONS = [1, 2, 5];
const RING = 2 * Math.PI * 48; // circumference of the progress ring (r = 48)
const TICK_MS = 100;

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function Breathe() {
  const [techniqueId, setTechniqueId] = useState('box');
  const [minutes, setMinutes] = useState(2);
  const [status, setStatus] = useState('idle'); // idle | running | paused
  const [tenths, setTenths] = useState(0); // elapsed time in 0.1s steps

  const technique = TECHNIQUES.find((t) => t.id === techniqueId);
  const { phases } = technique;
  const cycleTenths = phases.reduce((sum, p) => sum + p.seconds, 0) * 10;
  const totalTenths = minutes * 600;

  // Locate the current phase inside the repeating cycle.
  const inCycle = tenths % cycleTenths;
  let phaseIndex = 0;
  let phaseStart = 0;
  for (let i = 0; i < phases.length; i += 1) {
    const end = phaseStart + phases[i].seconds * 10;
    if (inCycle < end) {
      phaseIndex = i;
      break;
    }
    phaseStart = end;
  }
  const phase = phases[phaseIndex];
  const intoPhase = inCycle - phaseStart;
  const phaseProgress = intoPhase / (phase.seconds * 10);
  const countdown = Math.max(1, Math.ceil((phase.seconds * 10 - intoPhase) / 10));
  const cycles = Math.floor(tenths / cycleTenths);
  const secondsLeft = Math.max(0, Math.ceil((totalTenths - tenths) / 10));

  const done = tenths >= totalTenths;
  const running = status === 'running' && !done;
  const active = status !== 'idle';

  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => setTenths((t) => t + 1), TICK_MS);
    return () => clearInterval(id);
  }, [running]);

  const reset = useCallback(() => {
    setStatus('idle');
    setTenths(0);
  }, []);

  const toggle = useCallback(() => setStatus((s) => (s === 'running' ? 'paused' : 'running')), []);

  // Space toggles start/pause unless a control is focused.
  useEffect(() => {
    const onKey = (e) => {
      if (e.code !== 'Space' || done) return;
      const tag = e.target?.tagName;
      if (tag === 'BUTTON' || tag === 'A' || tag === 'INPUT') return;
      e.preventDefault();
      toggle();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggle, done]);

  const circleScale = active ? phase.scale : 0.72;
  const scaleDuration = running ? phase.seconds : 0.6;
  const orbTransition = `transform ${scaleDuration}s ease-in-out`;

  return (
    <div className="relative mx-auto max-w-3xl overflow-hidden px-4 pb-24 pt-10 text-center sm:px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-10 h-72 w-72 animate-float-slow rounded-full bg-teal-200/50 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 top-40 h-72 w-72 animate-float-slower rounded-full bg-fuchsia-200/40 blur-3xl"
      />

      <div className="relative animate-fade-up">
        <SectionTag className="justify-center">GUIDED BREATHING</SectionTag>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Find your <span className="text-gradient">rhythm</span>
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
          Pick a pattern, press start, and let the circle lead your breath.
        </p>
      </div>

      <div className="relative mt-8 overflow-hidden rounded-[28px] bg-white/90 shadow-soft ring-1 ring-violet-100 backdrop-blur-sm sm:rounded-[32px]">
        <span aria-hidden className="bar-gradient absolute inset-x-0 top-0 h-1.5" />

        {done ? (
          <div className="flex flex-col items-center px-6 py-16">
            <div className="animate-pop-in">
              <AnimatedEmoji name="party" size={96} label="Well done" />
            </div>
            <h2 className="animate-fade-up mt-5 text-2xl font-extrabold text-slate-900">Nicely done</h2>
            <p className="animate-fade-up mt-2 max-w-sm text-sm text-slate-500">
              {minutes} minute{minutes > 1 ? 's' : ''} of {technique.name.toLowerCase()} breathing,{' '}
              {cycles} full cycle{cycles === 1 ? '' : 's'}. Notice how you feel now.
            </p>
            <div className="mt-8 flex w-full max-w-xs flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={reset}
                className="flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-600 transition hover:-translate-y-0.5 hover:shadow-soft"
              >
                <RotateCcw size={15} /> Go again
              </button>
              <Link
                to="/"
                className="btn-gradient flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
              >
                Back to Home <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        ) : (
          <div className="px-4 pb-8 pt-8 sm:px-10 sm:pb-10">
            {/* Technique picker (locked while a session is in progress) */}
            <div
              className={'mx-auto grid max-w-md grid-cols-3 gap-2 transition-opacity ' + (active ? 'opacity-50' : '')}
              role="radiogroup"
              aria-label="Breathing technique"
            >
              {TECHNIQUES.map((t) => {
                const selected = t.id === techniqueId;
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    disabled={active}
                    onClick={() => setTechniqueId(t.id)}
                    className={
                      'rounded-2xl px-2 py-2.5 text-center transition disabled:cursor-not-allowed ' +
                      (selected
                        ? 'bg-slate-900 text-white shadow-card'
                        : 'bg-violet-50/80 text-slate-600 hover:bg-violet-100/70')
                    }
                  >
                    <span className="block text-sm font-bold">{t.name}</span>
                    <span className={'block text-[11px] tabular-nums ' + (selected ? 'text-white/70' : 'text-slate-400')}>
                      {t.pattern}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mx-auto mt-3 max-w-sm text-xs leading-relaxed text-slate-400">{technique.blurb}</p>

            {/* Breathing circle */}
            <div className="relative mx-auto mt-6 aspect-square w-[min(78vw,20rem)]">
              <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden>
                <circle cx="50" cy="50" r="48" fill="none" strokeWidth="1.2" className="stroke-violet-100" />
                <circle
                  cx="50"
                  cy="50"
                  r="48"
                  fill="none"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  stroke="url(#breathe-ring)"
                  strokeDasharray={RING}
                  strokeDashoffset={RING * (1 - (active ? phaseProgress : 0))}
                  style={{ transition: running ? `stroke-dashoffset ${TICK_MS}ms linear` : 'none' }}
                />
                <defs>
                  <linearGradient id="breathe-ring" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#2dd4bf" />
                    <stop offset="55%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#d946ef" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="absolute inset-[7%] grid place-items-center">
                <div
                  className="breathe-orb absolute inset-0 rounded-full bg-gradient-to-br from-teal-300 via-violet-300 to-fuchsia-300 opacity-60 blur-2xl"
                  style={{ transform: `scale(${circleScale})`, transition: orbTransition }}
                />
                <div
                  className="breathe-orb absolute inset-[6%] rounded-full border-[3px] border-white/90 bg-gradient-to-br from-teal-50 via-white to-fuchsia-100 shadow-soft"
                  style={{ transform: `scale(${circleScale})`, transition: orbTransition }}
                />
                <div className="relative flex flex-col items-center px-4">
                  <span key={active ? `${cycles}-${phaseIndex}` : 'idle'} className="animate-pop-in">
                    <AnimatedEmoji name={active ? phase.emoji : 'lotus'} size={48} />
                  </span>
                  <p className="mt-2 text-base font-bold text-slate-800 sm:text-lg" aria-live="polite">
                    {active ? phase.label : 'Ready when you are'}
                  </p>
                  {active && (
                    <p className="text-gradient text-4xl font-extrabold tabular-nums leading-none sm:text-5xl">
                      {countdown}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <p className="mx-auto mt-5 min-h-[2.5rem] max-w-sm text-sm leading-relaxed text-slate-500">
              {active ? phase.hint : 'Find a comfortable seat and relax your shoulders.'}
            </p>

            {/* Phase timeline: segment width follows phase length */}
            <div className="mx-auto mt-3 flex max-w-md gap-1.5">
              {phases.map((p, i) => {
                const current = active && i === phaseIndex;
                const filled = current ? phaseProgress : active && i < phaseIndex ? 1 : 0;
                return (
                  <div key={i} style={{ flexGrow: p.seconds, flexBasis: 0 }} className="min-w-0">
                    <div className="h-1.5 overflow-hidden rounded-full bg-violet-100">
                      <div
                        className="bar-gradient h-full rounded-full"
                        style={{ width: `${filled * 100}%`, transition: running ? `width ${TICK_MS}ms linear` : 'none' }}
                      />
                    </div>
                    <p
                      className={
                        'mt-1.5 truncate text-[11px] font-semibold transition-colors sm:text-xs ' +
                        (current ? 'text-slate-900' : 'text-slate-400')
                      }
                    >
                      {p.label.replace('Breathe ', '')} <span className="font-medium opacity-60">{p.seconds}s</span>
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Controls */}
            <div className="mt-8 flex flex-col items-center gap-4">
              {!active && (
                <div className="flex rounded-full bg-violet-50 p-1" role="radiogroup" aria-label="Session length">
                  {DURATIONS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      role="radio"
                      aria-checked={minutes === d}
                      onClick={() => setMinutes(d)}
                      className={
                        'rounded-full px-5 py-2 text-sm font-medium transition ' +
                        (minutes === d ? 'bg-white text-violet-700 shadow-sm' : 'text-slate-500 hover:text-slate-800')
                      }
                    >
                      {d} min
                    </button>
                  ))}
                </div>
              )}

              <div className="flex w-full max-w-xs flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
                <button
                  type="button"
                  onClick={toggle}
                  className="btn-gradient flex min-w-[9rem] items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-semibold"
                >
                  {running ? <Pause size={16} /> : <Play size={16} />}
                  {running ? 'Pause' : status === 'paused' ? 'Resume' : 'Start'}
                </button>
                {active && (
                  <button
                    type="button"
                    onClick={reset}
                    className="flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                  >
                    <RotateCcw size={15} /> Reset
                  </button>
                )}
              </div>
              {!active && <p className="hidden text-xs text-slate-400 sm:block">Tip: press Space to start or pause</p>}
            </div>

            {/* Session stats */}
            {active && (
              <div className="mx-auto mt-8 max-w-sm">
                <div className="grid grid-cols-2 gap-3 text-left">
                  <div className="rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100">
                    <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                      <Wind size={12} /> Cycles
                    </p>
                    <p className="mt-0.5 text-xl font-extrabold tabular-nums text-slate-900">{cycles}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100">
                    <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                      <Clock size={12} /> Time left
                    </p>
                    <p className="mt-0.5 text-xl font-extrabold tabular-nums text-slate-900">
                      {formatTime(secondsLeft)}
                    </p>
                  </div>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="bar-gradient h-full rounded-full"
                    style={{
                      width: `${Math.min(100, (tenths / totalTenths) * 100)}%`,
                      transition: running ? `width ${TICK_MS}ms linear` : 'none',
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
