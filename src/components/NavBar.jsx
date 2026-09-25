import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { RESULT_KEY } from '../pages/Reflect';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/reflect', label: 'Reflect' },
  { to: '/insights', label: 'Insights' },
];

function hasReflectResult() {
  try {
    return sessionStorage.getItem(RESULT_KEY) !== null;
  } catch {
    return false;
  }
}

export default function NavBar() {
  const { pathname } = useLocation();
  // Re-checked on every route change, so Insights appears right after Reflect finishes.
  const links = hasReflectResult() ? NAV_LINKS : NAV_LINKS.filter((link) => link.to !== '/insights');
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-white/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-10">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="text-lg font-bold tracking-tight">Mindful Wellbeing</span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full bg-slate-100/80 p-1 md:flex">
          {links.map((link) => {
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
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-sky-300 via-indigo-400 to-emerald-300 shadow-soft" />
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:text-indigo-600 md:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-black/5 bg-white/95 px-4 py-3 backdrop-blur-md sm:px-6 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) => {
              const active = pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={
                    'rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ' +
                    (active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50')
                  }
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
}
