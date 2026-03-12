/**
 * context/ThemeContext.jsx
 * ───────────────────────
 * Manages dark / light theme for the entire app.
 *
 * Strategy:
 *   1. Check localStorage for a saved preference ("dark" | "light")
 *   2. Fall back to the OS system preference (prefers-color-scheme)
 *   3. Apply by toggling the "dark" class on <html>
 *      Tailwind's darkMode: "class" reads this class.
 *
 * Usage:
 *   const { theme, toggleTheme, isDark } = useTheme();
 */

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

// ── Resolve the initial theme on first load ────────────────
function getInitialTheme() {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark' || saved === 'light') return saved;

  // Fall back to OS preference
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

// ── Apply theme class to <html> ────────────────────────────
function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  // Apply on mount and whenever theme changes
  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}