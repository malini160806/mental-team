import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import SectionTag from './SectionTag';

const FAQS = [
  {
    q: 'Is this a clinical diagnosis?',
    a: 'No. Mindful Wellbeing is a self-reflection tool for personal insight, not a medical or psychiatric assessment. If you are in distress, please reach out to a certified professional.',
  },
  {
    q: 'Do you store my answers?',
    a: 'Your answers are saved anonymously to help improve the tool. There is no account, and nothing you enter identifies you personally.',
  },
  {
    q: 'How long does a reflection take?',
    a: 'Most people finish in about five minutes. You can skip any question or retake the reflection whenever you like.',
  },
  {
    q: 'How is the wellbeing score calculated?',
    a: 'Each answer maps to a set of 0–4 behaviour scores. Supportive habits (like good sleep) are reversed so every score points toward strain, then all of them are added up with equal importance and shown as a 0–100 stress score on your Insights page.',
  },
];

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="mt-20 sm:mt-24">
      <div className="mx-auto max-w-2xl text-center">
        <SectionTag className="justify-center">COMMON QUESTIONS</SectionTag>
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          Before you begin
        </h2>
      </div>

      <div className="mx-auto mt-10 max-w-2xl space-y-3">
        {FAQS.map((item, i) => {
          const open = openIndex === i;
          return (
            <div
              key={item.q}
              className={
                'overflow-hidden rounded-2xl border bg-white transition-all duration-300 ' +
                (open ? 'border-violet-200 shadow-soft' : 'border-slate-100 shadow-card hover:border-violet-100')
              }
            >
              <button
                type="button"
                onClick={() => setOpenIndex(open ? -1 : i)}
                aria-expanded={open}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
              >
                <span className="flex items-center gap-3 text-sm font-semibold text-slate-800">
                  <span
                    className={
                      'grid h-7 w-7 shrink-0 place-items-center rounded-lg text-xs font-bold transition-colors ' +
                      (open ? 'bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white' : 'bg-violet-50 text-violet-500')
                    }
                  >
                    {i + 1}
                  </span>
                  {item.q}
                </span>
                <ChevronDown
                  size={16}
                  className={`shrink-0 transition-transform ${open ? 'rotate-180 text-violet-500' : 'text-slate-400'}`}
                />
              </button>
              {open && (
                <p className="animate-fade-up px-5 pb-5 pl-[3.75rem] text-sm leading-relaxed text-slate-500 sm:px-6 sm:pl-[4.25rem]">
                  {item.a}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
