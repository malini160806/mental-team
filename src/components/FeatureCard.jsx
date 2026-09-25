export default function FeatureCard({ icon: Icon, iconBg, title, desc }) {
  return (
    <div className="flex h-full flex-col rounded-3xl border border-slate-100 bg-white p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-soft">
      <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${iconBg}`}>
        <Icon size={19} />
      </div>
      <p className="mt-4 text-base font-semibold text-slate-800">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">{desc}</p>
    </div>
  );
}
