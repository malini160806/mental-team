import { useState } from 'react';
import AnimatedEmoji from './AnimatedEmoji';

const MOODS = [
  { emoji: 'weary', label: 'Drained', tone: 'bg-rose-50 ring-rose-200 text-rose-600', reply: 'Thank you for being honest. Let’s go gently — there’s no rush here.' },
  { emoji: 'worried', label: 'Uneasy', tone: 'bg-amber-50 ring-amber-200 text-amber-600', reply: 'That’s okay. A few quiet questions can help untangle what’s weighing on you.' },
  { emoji: 'neutral', label: 'Okay', tone: 'bg-sky-50 ring-sky-200 text-sky-600', reply: 'Steady is a fine place to start. Let’s see what’s under the surface.' },
  { emoji: 'smile', label: 'Good', tone: 'bg-emerald-50 ring-emerald-200 text-emerald-600', reply: 'Lovely to hear. A check-in can help you notice what’s working.' },
  { emoji: 'starstruck', label: 'Great', tone: 'bg-violet-50 ring-violet-200 text-violet-600', reply: 'Wonderful! Let’s capture what’s fuelling this good energy.' },
];

export default function MoodCheck() {
  const [selected, setSelected] = useState(null);
  const mood = selected === null ? null : MOODS[selected];

  return (
    <div className="mt-5 w-full max-w-lg rounded-3xl border border-white bg-white/75 p-3 shadow-soft ring-1 ring-violet-100 backdrop-blur-sm">
      <p className="text-sm font-semibold text-slate-700">How are you feeling right now?</p>
      <div className="mt-4 flex justify-between gap-1 sm:gap-2" role="radiogroup" aria-label="Current mood">
        {MOODS.map((m, i) => {
          const active = selected === i;
          return (
            <button
              key={m.label}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setSelected(i)}
              className={
                'group flex flex-1 flex-col items-center gap-1.5 rounded-2xl px-1 py-2 transition duration-200 ' +
                (active ? `ring-1 ${m.tone}` : 'text-slate-400 hover:bg-slate-50')
              }
            >
              <span
                className={
                  'transition duration-300 ' +
                  (active
                    ? 'scale-110'
                    : selected === null
                      ? 'group-hover:-translate-y-1 group-hover:scale-110'
                      : 'opacity-50 grayscale-[40%] group-hover:opacity-100 group-hover:grayscale-0')
                }
              >
                <AnimatedEmoji name={m.emoji} size={40} />
              </span>
              <span className="text-[11px] font-semibold">
                {m.label}
              </span>
            </button>
          );
        })}
      </div>
      <p
        key={selected ?? 'none'}
        className="animate-fade-up mt-4 min-h-[2.5rem] text-center text-xs leading-relaxed text-slate-500"
        aria-live="polite"
      >
        {mood?.reply}
      </p>
    </div>
  );
}
