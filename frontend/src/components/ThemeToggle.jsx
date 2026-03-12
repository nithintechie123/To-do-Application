/**
 * components/ThemeToggle.jsx
 * ──────────────────────────
 * Animated sun / moon button that switches dark ↔ light theme.
 * Used inside the Navbar.
 */

import { useTheme } from '../../context/ThemeContext';

const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1"  x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22"  x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3"  y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

const MoonIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      className="
        relative w-9 h-9 rounded-lg flex items-center justify-center
        transition-all duration-200
        bg-gray-100 hover:bg-gray-200 text-gray-600
        dark:bg-surface-2 dark:hover:bg-surface-3 dark:text-muted dark:hover:text-white
      "
    >
      {/* Sun — shown in dark mode (click to go light) */}
      <span className={`
        absolute transition-all duration-300
        ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'}
      `}>
        <SunIcon />
      </span>

      {/* Moon — shown in light mode (click to go dark) */}
      <span className={`
        absolute transition-all duration-300
        ${isDark ? 'opacity-0 -rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}
      `}>
        <MoonIcon />
      </span>
    </button>
  );
}