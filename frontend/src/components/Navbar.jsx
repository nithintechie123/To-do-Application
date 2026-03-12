/**
 * components/Navbar.jsx
 * ─────────────────────
 * Top navigation bar — shows user info, logout, and theme toggle.
 */

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle  from './ThemeToggle';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <header className="
      h-14 flex items-center justify-between px-6 flex-shrink-0
      bg-white border-b border-gray-200
      dark:bg-surface dark:border-border
    ">
      {/* Left — breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-muted">
        <span className="text-brand font-black text-base">✦</span>
        <span className="font-semibold text-gray-900 dark:text-white">TaskFlow</span>
        <span className="text-gray-300 dark:text-dimmed">·</span>
        <span>Dashboard</span>
      </div>

      {/* Right — theme toggle + user menu */}
      <div className="flex items-center gap-2">

        {/* Theme toggle button */}
        <ThemeToggle />

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="
              flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-colors duration-150
              hover:bg-gray-100 dark:hover:bg-surface-2
            "
          >
            <span className="w-7 h-7 rounded-full bg-brand/20 border border-brand/30 text-brand text-[11px] font-bold flex items-center justify-center">
              {initials}
            </span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white hidden sm:block">
              {user?.name}
            </span>
            <svg
              className={`w-3.5 h-3.5 text-gray-400 dark:text-muted transition-transform duration-150 ${menuOpen ? 'rotate-180' : ''}`}
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          {/* Dropdown */}
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
              <div className="
                absolute right-0 top-full mt-1.5 w-52 rounded-xl shadow-2xl z-50 overflow-hidden animate-slideDown
                bg-white border border-gray-200
                dark:bg-surface dark:border-border-2
              ">
                {/* User info */}
                <div className="px-4 py-3 border-b border-gray-100 dark:border-border">
                  <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-muted truncate">{user?.email}</p>
                </div>

                {/* Sign out */}
                <div className="p-1.5">
                  <button
                    onClick={() => { logout(); setMenuOpen(false); }}
                    className="
                      w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold
                      transition-colors duration-150
                      text-red-500 hover:bg-red-50
                      dark:text-red-400 dark:hover:bg-red-500/10
                    "
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16 17 21 12 16 7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}