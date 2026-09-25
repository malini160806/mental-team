import { Leaf, LineChart, ShieldCheck, Wind } from 'lucide-react';
import FeatureCard from './FeatureCard';
import SectionTag from './SectionTag';

const FEATURES = [
  {
    icon: Leaf,
    iconBg: 'bg-emerald-50 text-emerald-600',
    title: 'Empathetic Micro-Steps',
    desc: 'Navigate prompts at your own pace with adaptive pauses built between introspective tiers.',
  },
  {
    icon: LineChart,
    iconBg: 'bg-indigo-50 text-indigo-600',
    title: 'Non-Diagnostic Synthesis',
    desc: 'Immediate, personal insight rooted in positive psychology — without sterile clinical jargon.',
  },
  {
    icon: Wind,
    iconBg: 'bg-sky-50 text-sky-600',
    title: 'Guided Breathing Space',
    desc: 'Pause between questions with a calming breathing rhythm designed to steady your thoughts.',
  },
  {
    icon: ShieldCheck,
    iconBg: 'bg-rose-50 text-rose-600',
    title: 'Private by Default',
    desc: 'Nothing leaves your browser session. No accounts, no tracking, no cookies — ever.',
  },
];

export default function FeatureGrid() {
  return (
    <section className="mt-20 sm:mt-24">
      <div className="mx-auto max-w-2xl text-center">
        <SectionTag className="justify-center">WHY AURA</SectionTag>
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          Designed for gentle self-discovery
        </h2>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f) => (
          <FeatureCard key={f.title} {...f} />
        ))}
      </div>
    </section>
  );
}
