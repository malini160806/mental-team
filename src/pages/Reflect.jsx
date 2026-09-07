import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Keyboard, Wind, ChevronRight } from 'lucide-react';
import { questions, sections, TOTAL_STEPS, MAX_WEIGHT_PER_QUESTION } from '../data/questions';

const SECTION_DOT = {
  indigo: 'bg-indigo-500 text-indigo-600 bg-indigo-50',
  violet: 'bg-violet-500 text-violet-600 bg-violet-50',
  sky: 'bg-sky-500 text-sky-600 bg-sky-50',
  blue: 'bg-blue-500 text-blue-600 bg-blue-50',
  emerald: 'bg-emerald-500 text-emerald-600 bg-emerald-50',
  rose: 'bg-rose-500 text-rose-600 bg-rose-50',
  amber: 'bg-amber-500 text-amber-600 bg-amber-50',
  teal: 'bg-teal-500 text-teal-600 bg-teal-50',
};

const SOUNDSCAPE_NOTE = {
  life: 'Your responses will adapt the midday grounding rhythm.',
  focus: 'Your responses will adapt the deep-focus ambient layer.',
  digital: 'Your responses will adapt the digital detox interval chime.',
  sleep: 'Your responses will adapt the 4-7-8 twilight resonance frequency.',
  body: 'Your responses will adapt the somatic recovery soundscape.',
  connection: 'Your responses will adapt the warm-connection ambient tone.',
  mind: 'Your responses will adapt the quiet-mind drift frequency.',
  future: 'Your responses will adapt the steady-horizon resonance track.',
};

const ENCOURAGEMENT = [
  "You're doing great, take your time.",
  'Every honest answer sharpens the picture.',
  'No rush — this is your space.',
  'Halfway there, keep breathing easy.',
  'Almost through, stay gentle with yourself.',
];

export default function Reflect() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const question = questions[index];
  const step = index + 1;
  const percent = Math.round((step / TOTAL_STEPS) * 100);
  const selected = answers[question.id];
  const sectionMeta = sections[question.section];
  const dotClasses = SECTION_DOT[sectionMeta.color] ?? SECTION_DOT.indigo;
  const [dotBg, dotText, pillBg] = dotClasses.split(' ');
  const Icon = question.icon;

  const encouragement = ENCOURAGEMENT[Math.min(Math.floor((index / TOTAL_STEPS) * ENCOURAGEMENT.length), ENCOURAGEMENT.length - 1)];

  const finish = (finalAnswers) => {
    const totalWeight = Object.values(finalAnswers).reduce((sum, w) => sum + w, 0);
    const answeredCount = Object.keys(finalAnswers).length || 1;
    const maxPossible = answeredCount * MAX_WEIGHT_PER_QUESTION;
    const score = Math.max(0, Math.round(100 - (totalWeight / maxPossible) * 100));
    navigate('/insights', { state: { answers: finalAnswers, score } });
  };

  const goNext = () => {
    if (step >= TOTAL_STEPS) {
      finish(answers);
      return;
    }
    setIndex((i) => i + 1);
  };

  const selectOption = (optIndex) => {
    setAnswers((prev) => ({ ...prev, [question.id]: question.options[optIndex].weight }));
  };

  useEffect(() => {
    const handler = (e) => {
      if (['1', '2', '3', '4'].includes(e.key)) {
        const i = Number(e.key) - 1;
        if (question.options[i]) selectOption(i);
      }
      if (e.key === 'Enter') goNext();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question, index]);

  const selectedOptionIndex = useMemo(
    () => question.options.findIndex((o) => o.weight === selected),
    [question, selected],
  );

  return (
    <div className="mx-auto max-w-5xl px-6 pb-24 pt-10 lg:px-10">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => (index > 0 ? setIndex((i) => i - 1) : navigate('/'))}
          className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
        >
          <ArrowLeft size={16} /> Previous
        </button>

        <span
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold tracking-wide ${pillBg} ${dotText}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${dotBg}`} />
          {sectionMeta.label.toUpperCase()}
        </span>

        <span className="text-sm text-slate-400">
          Step <span className="font-semibold text-indigo-600">{String(step).padStart(2, '0')}</span> /{' '}
          {TOTAL_STEPS}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mt-6">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal-500 to-indigo-600 transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
          <span>✨ {encouragement}</span>
          <span>{percent}% Completed</span>
        </div>
      </div>

      {/* Question */}
      <div className="mt-12 text-center">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold tracking-wide ${pillBg} ${dotText}`}>
          <Icon size={12} />
          {question.tag.toUpperCase()}
        </span>
        <h1 className="mx-auto mt-5 max-w-2xl text-3xl font-extrabold leading-snug tracking-tight text-slate-900 sm:text-4xl">
          {question.title}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-500">
          {question.subtitle}
        </p>
      </div>

      {/* Options */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {question.options.map((opt, i) => {
          const isSelected = selectedOptionIndex === i;
          return (
            <button
              key={opt.label}
              type="button"
              onClick={() => selectOption(i)}
              className={
                'group flex flex-col rounded-3xl border p-6 text-left transition ' +
                (isSelected
                  ? 'border-indigo-600 bg-white shadow-soft ring-1 ring-indigo-600'
                  : 'border-slate-100 bg-white/70 hover:border-indigo-200 hover:bg-white')
              }
            >
              <div className="flex items-start justify-between">
                <div
                  className={
                    'grid h-11 w-11 place-items-center rounded-2xl ' +
                    (isSelected ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-500')
                  }
                >
                  <Icon size={19} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">
                    {i + 1}
                  </span>
                  <span
                    className={
                      'grid h-6 w-6 place-items-center rounded-full border-2 ' +
                      (isSelected
                        ? 'border-indigo-600 bg-indigo-600 text-white'
                        : 'border-slate-200 bg-white')
                    }
                  >
                    {isSelected && <Check size={13} strokeWidth={3} />}
                  </span>
                </div>
              </div>
              <p className="mt-5 text-lg font-semibold text-slate-800">{opt.label}</p>
              <p className="mt-1 text-sm text-slate-500">{opt.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Soundscape banner */}
      <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white/80 p-5">
        <div className="flex items-center gap-4">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
            <Wind size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">Adaptive Soundscape Ready</p>
            <p className="text-xs text-slate-500">{SOUNDSCAPE_NOTE[question.section]}</p>
          </div>
        </div>
        <button
          type="button"
          className="flex shrink-0 items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
        >
          Preview Soundscape <ChevronRight size={15} />
        </button>
      </div>

      {/* Bottom bar */}
      <div className="mt-10 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="flex items-center gap-2 text-xs text-slate-400">
          <span className="grid h-6 w-6 place-items-center rounded-md bg-slate-100 text-slate-500">
            <Keyboard size={13} />
          </span>
          Tip: Press <span className="rounded bg-slate-100 px-1.5 py-0.5 font-semibold text-slate-600">1</span> -{' '}
          <span className="rounded bg-slate-100 px-1.5 py-0.5 font-semibold text-slate-600">4</span> on keyboard to
          select
        </p>

        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={goNext}
            className="text-sm font-medium text-slate-400 hover:text-slate-600"
          >
            Skip Question
          </button>
          <button
            type="button"
            onClick={goNext}
            className="flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-indigo-700"
          >
            {step >= TOTAL_STEPS ? 'See My Results' : 'Continue'}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
