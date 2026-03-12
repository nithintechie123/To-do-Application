/**
 * components/SearchBar.jsx
 * ────────────────────────
 */

const SearchIcon = () => (
  <svg className="w-4 h-4 text-gray-400 dark:text-dimmed" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative flex items-center">
      <span className="absolute left-3 pointer-events-none"><SearchIcon /></span>
      <input
        type="text"
        placeholder="Search tasks…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="field pl-9 pr-9"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-3 text-gray-400 hover:text-gray-700 dark:text-muted dark:hover:text-white text-xs transition-colors duration-150"
        >
          ✕
        </button>
      )}
    </div>
  );
}