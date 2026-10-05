export default function MetricCard({ label, value, note, color, onChange }) {
  return (
    <div
      className="rounded-2xl border p-4 transition hover:-translate-y-0.5 hover:shadow-card"
      style={{ backgroundColor: `${color}0d`, borderColor: `${color}26` }}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-700">{label}</p>
        <span
          className="rounded-full px-2 py-0.5 text-xs font-bold tabular-nums text-white shadow-sm"
          style={{ backgroundColor: color }}
        >
          {value}%
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        className="range-soft mt-4 w-full"
        style={{
          color,
          background: `linear-gradient(to right, ${color} ${value}%, ${color}26 ${value}%)`,
        }}
      />
      <p className="mt-3 text-xs leading-relaxed text-slate-400">{note}</p>
    </div>
  );
}
