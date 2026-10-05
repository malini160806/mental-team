import { useState } from 'react';
import { EMOJI } from '../data/emoji';

const BASE = 'https://fonts.gstatic.com/s/e/notoemoji/latest';

const prefersReducedMotion =
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// Decorative unless `label` is given. Falls back to the native emoji if the
// animated image can't load.
export default function AnimatedEmoji({ name, size = 48, label, className = '' }) {
  const [failed, setFailed] = useState(false);
  const emoji = EMOJI[name];
  if (!emoji) return null;

  const a11y = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true };

  if (failed) {
    return (
      <span
        {...a11y}
        className={`inline-grid select-none place-items-center leading-none ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.8 }}
      >
        {emoji.char}
      </span>
    );
  }

  return (
    <img
      src={`${BASE}/${emoji.code}/${prefersReducedMotion ? 'emoji.svg' : '512.webp'}`}
      alt={label ?? ''}
      {...(label ? {} : { 'aria-hidden': true })}
      width={size}
      height={size}
      loading="lazy"
      draggable={false}
      onError={() => setFailed(true)}
      className={`inline-block select-none ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
