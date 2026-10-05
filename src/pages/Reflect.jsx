import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Keyboard } from 'lucide-react';
import { questions, sections, TOTAL_STEPS } from '../data/questions';
import { assess } from '../../shared/stressModel.js';
import { submitSurveyResponse } from '../lib/api';
import { getSessionId } from '../lib/session';
import AnimatedEmoji from '../components/AnimatedEmoji';
import { SECTION_EMOJI } from '../data/emoji';

// Per-section colours. Full class strings so Tailwind can see them.
const SECTION_THEME = {
  indigo: { dot: 'bg-indigo-500', text: 'text-indigo-600', pill: 'bg-indigo-50', selected: 'border-indigo-500 ring-indigo-500 bg-indigo-50/60', hover: 'hover:border-indigo-200', solid: 'border-indigo-500 bg-indigo-500', glow: '#818cf8' },
  violet: { dot: 'bg-violet-500', text: 'text-violet-600', pill: 'bg-violet-50', selected: 'border-violet-500 ring-violet-500 bg-violet-50/60', hover: 'hover:border-violet-200', solid: 'border-violet-500 bg-violet-500', glow: '#a78bfa' },
  sky: { dot: 'bg-sky-500', text: 'text-sky-600', pill: 'bg-sky-50', selected: 'border-sky-500 ring-sky-500 bg-sky-50/60', hover: 'hover:border-sky-200', solid: 'border-sky-500 bg-sky-500', glow: '#38bdf8' },
  blue: { dot: 'bg-blue-500', text: 'text-blue-600', pill: 'bg-blue-50', selected: 'border-blue-500 ring-blue-500 bg-blue-50/60', hover: 'hover:border-blue-200', solid: 'border-blue-500 bg-blue-500', glow: '#60a5fa' },
  emerald: { dot: 'bg-emerald-500', text: 'text-emerald-600', pill: 'bg-emerald-50', selected: 'border-emerald-500 ring-emerald-500 bg-emerald-50/60', hover: 'hover:border-emerald-200', solid: 'border-emerald-500 bg-emerald-500', glow: '#34d399' },
  rose: { dot: 'bg-rose-500', text: 'text-rose-600', pill: 'bg-rose-50', selected: 'border-rose-500 ring-rose-500 bg-rose-50/60', hover: 'hover:border-rose-200', solid: 'border-rose-500 bg-rose-500', glow: '#fb7185' },
  amber: { dot: 'bg-amber-500', text: 'text-amber-600', pill: 'bg-amber-50', selected: 'border-amber-500 ring-amber-500 bg-amber-50/60', hover: 'hover:border-amber-200', solid: 'border-amber-500 bg-amber-500', glow: '#fbbf24' },
  teal: { dot: 'bg-teal-500', text: 'text-teal-600', pill: 'bg-teal-50', selected: 'border-teal-500 ring-teal-500 bg-teal-50/60', hover: 'hover:border-teal-200', solid: 'border-teal-500 bg-teal-500', glow: '#2dd4bf' },
};

const ENCOURAGEMENT = [
  "You're doing great, take your time.",
  'Every honest answer sharpens the picture.',
  'No rush — this is your space.',
  'Halfway there, keep breathing easy.',
  'Almost through, stay gentle with yourself.',
];

// Little emoji that floats up from a card when it's picked.
const REACTIONS = ['sparkles', 'heart', 'clap', 'star'];

const PROGRESS_KEY = 'mindful-wellbeing:reflect-progress';
export const RESULT_KEY = 'mindful-wellbeing:reflect-result';

function loadProgress() {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(PROGRESS_KEY));
    if (!parsed || typeof parsed.answers !== 'object') return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveProgress(index, answers) {
  try {
    sessionStorage.setItem(PROGRESS_KEY, JSON.stringify({ index, answers }));
  } catch {
    // sessionStorage unavailable (private mode, etc.) — progress just won't survive a refresh.
  }
}

function clearProgress() {
  try {
    sessionStorage.removeItem(PROGRESS_KEY);
  } catch {
    // no-op
  }
}

export default function Reflect() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(() => {
    const saved = loadProgress();
    return saved && saved.index >= 0 && saved.index < TOTAL_STEPS ? saved.index : 0;
  });
  const [answers, setAnswers] = useState(() => loadProgress()?.answers ?? {});
  const [reaction, setReaction] = useState(null);
  const [finishing, setFinishing] = useState(false);
  const advanceTimeout = useRef(null);
  const finishTimeout = useRef(null);
  const direction = useRef(1);

  useEffect(
    () => () => {
      clearTimeout(advanceTimeout.current);
      clearTimeout(finishTimeout.current);
    },
    [],
  );

  useEffect(() => {
    saveProgress(index, answers);
  }, [index, answers]);

  useEffect(() => {
    setReaction(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [index]);

  const question = questions[index];
  const step = index + 1;
  const percent = Math.round((step / TOTAL_STEPS) * 100);
  const selectedOptionIndex = answers[question.id];
  const sectionMeta = sections[question.section];
  const theme = SECTION_THEME[sectionMeta.color] ?? SECTION_THEME.indigo;
  const Icon = question.icon;

  const encouragement = ENCOURAGEMENT[Math.min(Math.floor((index / TOTAL_STEPS) * ENCOURAGEMENT.length), ENCOURAGEMENT.length - 1)];

  const finish = (finalAnswers) => {
    const letters = {};
    const perQuestion = [];
    questions.forEach((q) => {
      const option = q.options[finalAnswers[q.id]];
      if (!option) return;
      letters[q.id] = option.letter;
      perQuestion.push({ id: q.id, letter: option.letter, label: option.label });
    });

    // Scored locally for an instant result; the API re-scores from the letters.
    const assessment = assess(letters);

    submitSurveyResponse({
      sessionId: getSessionId(),
      answers: perQuestion,
    }).catch((err) => console.error('Failed to save survey response:', err));

    clearProgress();
    try {
      sessionStorage.setItem(RESULT_KEY, JSON.stringify({ answers: finalAnswers, assessment }));
    } catch {
      // sessionStorage unavailable — the result still arrives via router state.
    }
    // Short celebration before revealing the results.
    setFinishing(true);
    finishTimeout.current = setTimeout(() => {
      navigate('/insights', { state: { answers: finalAnswers, assessment } });
    }, 1600);
  };

  const goNext = () => {
    direction.current = 1;
    if (step >= TOTAL_STEPS) {
      finish(answers);
      return;
    }
    setIndex((i) => i + 1);
  };

  const selectOption = (optIndex) => {
    clearTimeout(advanceTimeout.current);
    const next = { ...answers, [question.id]: optIndex };
    setAnswers(next);
    setReaction({ index: optIndex, name: REACTIONS[Math.floor(Math.random() * REACTIONS.length)], id: Date.now() });
    advanceTimeout.current = setTimeout(() => {
      direction.current = 1;
      if (step >= TOTAL_STEPS) {
        finish(next);
      } else {
        setIndex((i) => i + 1);
      }
    }, 350);
  };

  useEffect(() => {
    const handler = (e) => {
      if (finishing) return;
      if (['1', '2', '3', '4', '5'].includes(e.key)) {
        const i = Number(e.key) - 1;
        if (question.options[i]) selectOption(i);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question, index, finishing]);

  if (finishing) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-6 text-center">
        <div className="animate-pop-in">
          <AnimatedEmoji name="party" size={112} label="Celebration" />
        </div>
        <h1 className="animate-fade-up mt-6 text-3xl font-extrabold tracking-tight text-slate-900">
          You did it!
        </h1>
        <p className="animate-fade-up mt-3 text-sm text-slate-500" style={{ animationDelay: '120ms' }}>
          Thank you for checking in with yourself. Preparing your insights…
        </p>
        <div className="mt-8 h-1.5 w-48 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full w-full origin-left animate-[grow_1.5s_ease-out_forwards] rounded-full bar-gradient" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-4xl px-4 pb-24 pt-8 sm:px-6 sm:pt-10 lg:px-10">
      {/* Glow tinted by the current section */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-24 -z-10 h-80 w-[80%] -translate-x-1/2 rounded-full opacity-40 blur-3xl transition-colors duration-700"
        style={{ backgroundColor: theme.glow }}
      />
      <div className="gradient-border rounded-[34px] shadow-soft">
        <div className="rounded-[32.5px] bg-white/90 p-5 backdrop-blur-sm sm:p-8">
          {/* Top bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                clearTimeout(advanceTimeout.current);
                direction.current = -1;
                index > 0 ? setIndex((i) => i - 1) : navigate('/');
              }}
              className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            >
              <ArrowLeft size={16} /> {index > 0 ? 'Previous' : 'Home'}
            </button>

            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold tracking-wide transition-colors ${theme.pill} ${theme.text}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${theme.dot}`} />
                {sectionMeta.label.toUpperCase()}
              </span>

              <span className="rounded-full bg-violet-50 px-3 py-1.5 text-sm text-slate-500">
                Step <span className="font-semibold text-violet-600">{String(step).padStart(2, '0')}</span> /{' '}
                {TOTAL_STEPS}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-8">
            <div className="relative">
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-violet-100/70">
                <div
                  className="bar-gradient h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <span
                className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 transition-[left] duration-500 ease-out"
                style={{ left: `${Math.min(97, Math.max(3, percent))}%` }}
              >
                <AnimatedEmoji name={percent >= 100 ? 'blossom' : 'seedling'} size={28} />
              </span>
            </div>
            <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
              <span key={encouragement} className="animate-fade-up flex items-center gap-1.5">
                <AnimatedEmoji name="sparkles" size={16} /> {encouragement}
              </span>
              <span className="text-gradient font-bold">{percent}% Completed</span>
            </div>
          </div>

          <div
            key={index}
            className={direction.current === 1 ? 'animate-question-forward' : 'animate-question-back'}
          >
            {/* Question */}
            <div className="mt-8 text-center sm:mt-10">
              <div key={question.section} className="animate-pop-in mb-4 flex justify-center">
                <AnimatedEmoji name={SECTION_EMOJI[question.section]} size={64} />
              </div>
              <span
                className={`relative inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold tracking-wide ${theme.pill} ${theme.text}`}
              >
                <Icon size={12} />
                {question.tag.toUpperCase()}
              </span>
              <h1 className="mx-auto mt-5 max-w-2xl text-2xl font-extrabold leading-snug tracking-tight text-slate-900 sm:text-4xl">
                {question.title}
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-500">
                {question.subtitle}
              </p>
            </div>

            {/* Options */}
            <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2">
              {question.options.map((opt, i) => {
                const isSelected = selectedOptionIndex === i;
                return (
                  <button
                    key={opt.letter}
                    type="button"
                    onClick={() => selectOption(i)}
                    className={
                      'group relative flex flex-col rounded-3xl border p-5 text-left transition duration-200 active:scale-[0.98] sm:p-6 ' +
                      (isSelected
                        ? `shadow-soft ring-1 ${theme.selected}`
                        : `border-slate-100 bg-white hover:-translate-y-0.5 hover:shadow-soft ${theme.hover}`)
                    }
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={
                          'rounded-md px-2 py-0.5 text-xs font-bold transition-colors ' +
                          (isSelected ? `${theme.solid} text-white` : `${theme.pill} ${theme.text}`)
                        }
                      >
                        {opt.letter}
                      </span>
                      <span
                        className={
                          'grid h-6 w-6 place-items-center rounded-full border-2 transition-colors ' +
                          (isSelected ? `${theme.solid} text-white` : 'border-slate-200 bg-white')
                        }
                      >
                        {isSelected && <Check size={13} strokeWidth={3} className="animate-pop-in" />}
                      </span>
                    </div>
                    <p className="mt-4 text-base font-semibold leading-snug text-slate-800">{opt.label}</p>
                    {reaction?.index === i && isSelected && (
                      <span key={reaction.id} className="animate-emoji-burst pointer-events-none absolute left-1/2 top-0">
                        <AnimatedEmoji name={reaction.name} size={36} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
            <span className="hidden items-center gap-1.5 text-xs text-slate-400 sm:flex">
              <Keyboard size={14} /> Press 1–5 to answer instantly
            </span>
            <button
              type="button"
              onClick={() => {
                clearTimeout(advanceTimeout.current);
                goNext();
              }}
              className="ml-auto text-sm font-medium text-slate-400 transition hover:text-slate-600"
            >
              Skip Question
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
