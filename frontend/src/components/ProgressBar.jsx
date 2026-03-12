/**
 * components/ProgressBar.jsx
 * ──────────────────────────
 * Animated thin progress bar showing % of todos completed.
 */

export default function ProgressBar({ completed, total }) {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="px-9">
      <div className="h-[3px] bg-surface-3 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand to-brand-light rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
