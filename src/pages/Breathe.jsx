import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Pause, Play, RotateCcw, ArrowRight } from 'lucide-react';
import AnimatedEmoji from '../components/AnimatedEmoji';
import SectionTag from '../components/SectionTag';

// Box breathing: four equal phases. `scale` is the circle size at the end of the phase.
const PHASES = [
  { label: 'Breathe in', hint: 'Slowly fill your lungs through your nose', scale: 1, emoji: 'relieved' },
  { label: 'Hold', hint: 'Keep the air in, gently', scale: 1, emoji: 'sparkles' },
  { label: 'Breathe out', hint: 'Release slowly through your mouth', scale: 0.6, emoji: 'exhale' },
  { label: 'Hold', hint: 'Rest with empty lungs', scale: 0.6, emoji: 'leaf' },
];
const PHASE_SECONDS = 4;
const DURATIONS = [1, 2, 5];

function formatTime(total) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function Breathe() {
  const [minutes, setMinutes] = useState(2);
  const [status, setStatus] = useState('idle'); // idle | running | paused
  const [elapsed, setElapsed] = useState(0);

  const total = minutes * 60;
  const phaseIndex = Math.floor(elapsed / PHASE_SECONDS) % PHASES.length;
  const phase = PHASES[phaseIndex];
  const countdown = PHASE_SECONDS - (elapsed % PHASE_SECONDS);
  const cycles = Math.floor(elapsed / (PHASE_SECONDS * PHASES.length));

  const done = elapsed >= total;

  useEffect(() => {
    if (status !== 'running' || done) return undefined;
    const tick = setTimeout(() => setElapsed((e) => e + 1), 1000);
    return () => clearTimeout(tick);
  }, [status, elapsed, done]);

  const reset = () => {
    setStatus('idle');
    setElapsed(0);
  };

  const running = status === 'running';
  const active = running || status === 'paused';
  const circleScale = active ? phase.scale : 0.7;

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
          Box <span className="text-gradient">Breathing</span>
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
          Four seconds in, hold, out, hold. A simple rhythm to slow your heart rate and settle your
          thoughts.
        </p>
      </div>

      <div className="relative mt-8 overflow-hidden rounded-[32px] bg-white/85 p-6 shadow-soft ring-1 ring-violet-100 backdrop-blur-sm sm:p-10">
        <span aria-hidden className="bar-gradient absolute inset-x-0 top-0 h-1.5" />
        {done ? (
          <div className="flex flex-col items-center py-10">
            <div className="animate-pop-in">
              <AnimatedEmoji name="party" size={96} label="Well done" />
            </div>
            <h2 className="animate-fade-up mt-5 text-2xl font-extrabold text-slate-900">Nicely done</h2>
            <p className="animate-fade-up mt-2 text-sm text-slate-500">
              {minutes} minute{minutes > 1 ? 's' : ''} of calm, {cycles} full breaths. Notice how you feel now.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={reset}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:-translate-y-0.5 hover:shadow-soft"
              >
                <RotateCcw size={15} /> Go again
              </button>
              <Link
                to="/"
                className="btn-gradient flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
              >
                Back to Home <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Breathing circle */}
            <div className="relative mx-auto grid h-64 w-64 place-items-center sm:h-72 sm:w-72">
              <div
                className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-300 via-violet-300 to-fuchsia-300 opacity-70 blur-xl"
                style={{
                  transform: `scale(${circleScale})`,
                  transition: `transform ${running ? PHASE_SECONDS : 0.6}s ease-in-out`,
                }}
              />
              <div
                className="absolute inset-4 rounded-full border-4 border-white/80 bg-gradient-to-br from-teal-50 via-white to-fuchsia-100 shadow-soft"
                style={{
                  transform: `scale(${circleScale})`,
                  transition: `transform ${running ? PHASE_SECONDS : 0.6}s ease-in-out`,
                }}
              />
              <div className="relative flex flex-col items-center">
                <span key={active ? phaseIndex : 'idle'} className="animate-pop-in">
                  <AnimatedEmoji name={active ? phase.emoji : 'lotus'} size={56} />
                </span>
                <p className="mt-2 text-lg font-bold text-slate-800" aria-live="polite">
                  {active ? phase.label : 'Ready when you are'}
                </p>
                {active && <p className="text-gradient text-3xl font-extrabold tabular-nums">{countdown}</p>}
              </div>
            </div>

            <p className="mt-6 min-h-[1.25rem] text-sm text-slate-500">
              {active ? phase.hint : 'Find a comfortable seat and relax your shoulders.'}
            </p>

            {/* Phase steps */}
            <div className="mx-auto mt-5 grid max-w-sm grid-cols-4 gap-2">
              {PHASES.map((p, i) => (
                <div
                  key={i}
                  className={
                    'rounded-full py-1 text-[11px] font-semibold transition-colors ' +
                    (active && i === phaseIndex ? 'btn-gradient hover:!translate-y-0' : 'bg-violet-50 text-violet-300')
                  }
                >
                  {p.label.replace('Breathe ', '')}
                </div>
              ))}
            </div>

            {/* Controls */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {status === 'idle' && (
                <div className="flex rounded-full bg-violet-50 p-1" role="radiogroup" aria-label="Session length">
                  {DURATIONS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      role="radio"
                      aria-checked={minutes === d}
                      onClick={() => setMinutes(d)}
                      className={
                        'rounded-full px-4 py-1.5 text-sm font-medium transition ' +
                        (minutes === d ? 'bg-white text-violet-700 shadow-sm' : 'text-slate-500 hover:text-slate-800')
                      }
                    >
                      {d} min
                    </button>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={() => setStatus(running ? 'paused' : 'running')}
                className="btn-gradient flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold"
              >
                {running ? <Pause size={16} /> : <Play size={16} />}
                {running ? 'Pause' : status === 'paused' ? 'Resume' : 'Start'}
              </button>

              {active && (
                <button
                  type="button"
                  onClick={reset}
                  className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  <RotateCcw size={15} /> Reset
                </button>
              )}
            </div>

            {active && (
              <div className="mx-auto mt-8 max-w-xs">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>{cycles} breaths</span>
                  <span className="tabular-nums">{formatTime(total - elapsed)} left</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="bar-gradient h-full rounded-full transition-[width] duration-1000 ease-linear"
                    style={{ width: `${(elapsed / total) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
