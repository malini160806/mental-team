export default function Footer() {
  return (
    <footer className="relative">
      <div aria-hidden className="bar-gradient h-px w-full opacity-60" />
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between lg:px-10">
        <p>
          <span className="font-semibold text-slate-600">Mindful Wellbeing</span>{' '}
          <span className="mx-1 text-slate-300">•</span> Mindful presence through contemplative
          design.
        </p>
        <p className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-teal-400 to-fuchsia-500" />
            Private Session Active
          </span>
          <span className="text-slate-300">•</span>
          <span>© 2025 Mindful Wellbeing</span>
        </p>
      </div>
    </footer>
  );
}
