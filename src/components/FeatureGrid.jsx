import { Leaf, LineChart, ShieldCheck, Wind } from 'lucide-react';
import FeatureCard from './FeatureCard';
import SectionTag from './SectionTag';
import Reveal from './Reveal';

const FEATURES = [
  {
    icon: Leaf,
    emoji: 'seedling',
    iconBg: 'from-emerald-400 to-teal-500',
    title: 'Empathetic Micro-Steps',
    desc: 'Navigate prompts at your own pace with adaptive pauses built between introspective tiers.',
  },
  {
    icon: LineChart,
    emoji: 'brain',
    iconBg: 'from-indigo-500 to-violet-500',
    title: 'Non-Diagnostic Synthesis',
    desc: 'Immediate, personal insight rooted in positive psychology — without sterile clinical jargon.',
  },
  {
    icon: Wind,
    emoji: 'exhale',
    iconBg: 'from-sky-400 to-cyan-500',
    title: 'Guided Breathing Space',
    desc: 'Pause between questions with a calming breathing rhythm designed to steady your thoughts.',
  },
  {
    icon: ShieldCheck,
    emoji: 'hug',
    iconBg: 'from-rose-400 to-fuchsia-500',
    title: 'Private by Default',
    desc: 'Nothing leaves your browser session. No accounts, no tracking, no cookies — ever.',
  },
];

export default function FeatureGrid() {
  return (
    <section className="mt-20 sm:mt-24">
      <Reveal className="mx-auto max-w-2xl text-center">
        <SectionTag className="justify-center">WHY AURA</SectionTag>
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          Designed for gentle self-discovery
        </h2>
      </Reveal>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f, i) => (
          <Reveal key={f.title} delay={i * 90} className="h-full">
            <FeatureCard {...f} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
