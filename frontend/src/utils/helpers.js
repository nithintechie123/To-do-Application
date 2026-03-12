/**
 * utils/helpers.js
 * ────────────────
 * Pure utility functions shared across components.
 */

/**
 * Format a date string → "Mar 14"
 * Returns null if no date is provided.
 */
export function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day:   'numeric',
  });
}

/**
 * Returns true if the given date is in the past (past end-of-day).
 */
export function isOverdue(dateStr) {
  if (!dateStr) return false;
  const due = new Date(dateStr);
  due.setHours(23, 59, 59, 999);
  return due < new Date();
}

/**
 * Priority configuration used in badges and filters.
 */
export const PRIORITY_CONFIG = {
  high:   { label: '↑ high',   classes: 'bg-red-500/10 text-red-400'  },
  medium: { label: '– medium', classes: 'bg-amber-500/10 text-amber-400' },
  low:    { label: '↓ low',    classes: 'bg-green-500/10 text-green-400' },
};

/**
 * Today's date as a friendly string, e.g. "Thursday, June 5, 2025"
 */
export function todayLabel() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month:   'long',
    day:     'numeric',
    year:    'numeric',
  });
}
