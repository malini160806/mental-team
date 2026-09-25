import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Keyboard } from 'lucide-react';
import { questions, sections, TOTAL_STEPS } from '../data/questions';
import { assess } from '../../shared/stressModel.js';
import { submitSurveyResponse } from '../lib/api';
import { getSessionId } from '../lib/session';

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

const ENCOURAGEMENT = [
  "You're doing great, take your time.",
  'Every honest answer sharpens the picture.',
  'No rush — this is your space.',
  'Halfway there, keep breathing easy.',
  'Almost through, stay gentle with yourself.',
];

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
  const advanceTimeout = useRef(null);
  const direction = useRef(1);

  useEffect(() => () => clearTimeout(advanceTimeout.current), []);

  useEffect(() => {
    saveProgress(index, answers);
  }, [index, answers]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [index]);

  const question = questions[index];
  const step = index + 1;
  const percent = Math.round((step / TOTAL_STEPS) * 100);
  const selectedOptionIndex = answers[question.id];
  const sectionMeta = sections[question.section];
  const dotClasses = SECTION_DOT[sectionMeta.color] ?? SECTION_DOT.indigo;
  const [dotBg, dotText, pillBg] = dotClasses.split(' ');
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
    navigate('/insights', { state: { answers: finalAnswers, assessment } });
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
      if (['1', '2', '3', '4', '5'].includes(e.key)) {
        const i = Number(e.key) - 1;
        if (question.options[i]) selectOption(i);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question, index]);

  return (
    <div className="mx-auto max-w-4xl px-4 pb-24 pt-8 sm:px-6 sm:pt-10 lg:px-10">
      <div className="rounded-[32px] border border-slate-100 bg-white/80 p-5 shadow-card backdrop-blur-sm sm:p-8">
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
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-bold tracking-wide ${pillBg} ${dotText}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${dotBg}`} />
              {sectionMeta.label.toUpperCase()}
            </span>

            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-500">
              Step <span className="font-semibold text-indigo-600">{String(step).padStart(2, '0')}</span> /{' '}
              {TOTAL_STEPS}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-6">
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-500 via-indigo-500 to-indigo-600 transition-all duration-500 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
            <span key={encouragement} className="animate-fade-up">
              ✨ {encouragement}
            </span>
            <span className="font-semibold text-slate-500">{percent}% Completed</span>
          </div>
        </div>

        <div
          key={index}
          className={direction.current === 1 ? 'animate-question-forward' : 'animate-question-back'}
        >
          {/* Question */}
          <div className="mt-10 text-center sm:mt-12">
            <span
              className={`relative inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold tracking-wide ${pillBg} ${dotText}`}
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
                    'group flex flex-col rounded-3xl border p-5 text-left transition duration-200 active:scale-[0.98] sm:p-6 ' +
                    (isSelected
                      ? 'border-indigo-600 bg-white shadow-soft ring-1 ring-indigo-600'
                      : 'border-slate-100 bg-white/70 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-white hover:shadow-soft')
                  }
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">
                      {opt.letter}
                    </span>
                    <span
                      className={
                        'grid h-6 w-6 place-items-center rounded-full border-2 transition-colors ' +
                        (isSelected
                          ? 'border-indigo-600 bg-indigo-600 text-white'
                          : 'border-slate-200 bg-white')
                      }
                    >
                      {isSelected && <Check size={13} strokeWidth={3} className="animate-pop-in" />}
                    </span>
                  </div>
                  <p className="mt-4 text-base font-semibold leading-snug text-slate-800">{opt.label}</p>
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
  );
}
