import AnimatedEmoji from './AnimatedEmoji';

export default function FeatureCard({ icon: Icon, iconBg, emoji, title, desc }) {
  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-card transition duration-300 hover:-translate-y-1.5 hover:shadow-soft">
      <span aria-hidden className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${iconBg}`} />
      <span
        aria-hidden
        className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-25 ${iconBg}`}
      />
      <div className="flex items-start justify-between">
        <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-md transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 ${iconBg}`}>
          <Icon size={19} />
        </div>
        {emoji && (
          <span className="translate-y-2 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <AnimatedEmoji name={emoji} size={36} />
          </span>
        )}
      </div>
      <p className="mt-4 text-base font-semibold text-slate-800">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">{desc}</p>
    </div>
  );
}
