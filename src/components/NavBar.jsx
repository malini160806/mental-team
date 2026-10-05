import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { RESULT_KEY } from '../pages/Reflect';
import AnimatedEmoji from './AnimatedEmoji';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/reflect', label: 'Reflect' },
  { to: '/insights', label: 'Insights' },
  { to: '/breathe', label: 'Breathe' },
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={
        'sticky top-0 z-30 border-b backdrop-blur-md transition-all duration-300 ' +
        (scrolled ? 'border-black/5 bg-white/85 shadow-[0_6px_24px_-12px_rgba(20,20,43,0.18)]' : 'border-transparent bg-white/60')
      }
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-10">
        <Link to="/" className="group flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-teal-100 via-violet-100 to-fuchsia-100 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105">
            <AnimatedEmoji name="seedling" size={24} />
          </span>
          <span className="text-lg font-bold tracking-tight">
            Mindful <span className="text-gradient">Wellbeing</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-violet-100 bg-white/70 p-1 shadow-sm md:flex">
          {links.map((link) => {
            const active = pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={
                  'rounded-full px-4 py-1.5 text-sm font-medium transition ' +
                  (active
                    ? 'btn-gradient hover:!translate-y-0'
                    : 'text-slate-500 hover:bg-violet-50 hover:text-violet-700')
                }
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-teal-300 via-violet-400 to-fuchsia-400 shadow-soft ring-2 ring-white" />
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
                    (active ? 'bg-gradient-to-r from-indigo-50 to-fuchsia-50 text-violet-700' : 'text-slate-600 hover:bg-violet-50')
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
