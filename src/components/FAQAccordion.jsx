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
    a: 'Your responses stay in this browser session only. There is no account, no server-side tracking, and no cookies used to identify you.',
  },
  {
    q: 'How long does a reflection take?',
    a: 'Most people finish in about five minutes. You can skip any question or retake the reflection whenever you like.',
  },
  {
    q: 'How is the wellbeing score calculated?',
    a: 'Each answer carries a weight reflecting a gentle wellbeing signal. Weights are averaged across your responses into a single 0–100 index shown on your Insights page.',
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

      <div className="mx-auto mt-10 max-w-2xl divide-y divide-slate-100 rounded-3xl border border-slate-100 bg-white shadow-card">
        {FAQS.map((item, i) => {
          const open = openIndex === i;
          return (
            <div key={item.q}>
              <button
                type="button"
                onClick={() => setOpenIndex(open ? -1 : i)}
                aria-expanded={open}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
              >
                <span className="text-sm font-semibold text-slate-800">{item.q}</span>
                <ChevronDown
                  size={16}
                  className={`shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
                />
              </button>
              {open && (
                <p className="px-5 pb-4 text-sm leading-relaxed text-slate-500 sm:px-6">{item.a}</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
