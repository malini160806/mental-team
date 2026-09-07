import { Link, useLocation } from 'react-router-dom';
import { AudioLines } from 'lucide-react';

const NAV_LINKS = [
  { to: '/', label: 'Sanctuary' },
  { to: '/reflect', label: 'Reflect' },
  { to: '/breathe', label: 'Breathe' },
  { to: '/insights', label: 'Insights' },
];

export default function NavBar() {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-white/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-10">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-600" />
            <span className="text-lg font-bold tracking-tight">Aura</span>
          </Link>
          <span className="hidden items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium tracking-wide text-slate-500 md:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            SAFE &amp; CONFIDENTIAL <span className="text-slate-300">•</span> 5 MIN SELF-REFLECTION
          </span>
        </div>

        <nav className="hidden items-center gap-1 rounded-full bg-slate-100/80 p-1 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={
                  'rounded-full px-4 py-1.5 text-sm font-medium transition-colors ' +
                  (active
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800')
                }
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Audio"
            className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:text-indigo-600"
          >
            <AudioLines size={16} />
          </button>
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-sky-300 via-indigo-400 to-emerald-300 shadow-soft" />
        </div>
      </div>
    </header>
  );
}
