export default function MetricCard({ label, value, note, bar }) {
  return (
    <div className="rounded-2xl bg-slate-50/80 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-700">{label}</p>
        <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-slate-600 shadow-sm">
          {value}%
        </span>
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
        <div className={`h-full rounded-full ${bar}`} style={{ width: `${value}%` }} />
      </div>
      <p className="mt-3 text-xs leading-relaxed text-slate-400">{note}</p>
    </div>
  );
}
