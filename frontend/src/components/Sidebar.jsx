/**
 * components/Sidebar.jsx
 * ──────────────────────
 * Left-hand navigation: view filters + category filters.
 */

const VIEWS = [
  { key: 'all',       label: 'All Tasks', icon: '◈' },
  { key: 'active',    label: 'Active',    icon: '◉' },
  { key: 'completed', label: 'Completed', icon: '◎' },
];

export default function Sidebar({
  todos, categories,
  activeView, activeCategoryId,
  onViewChange, onCategoryChange,
  completedCount, onClearDone,
}) {
  const viewCount = (key) => {
    if (key === 'all')       return todos.length;
    if (key === 'active')    return todos.filter((t) => !t.completed).length;
    if (key === 'completed') return todos.filter((t) =>  t.completed).length;
    return 0;
  };

  return (
    <aside className="
      w-60 flex-shrink-0 flex flex-col gap-7 px-4 py-7
      h-screen sticky top-0 overflow-y-auto
      bg-white border-r border-gray-200
      dark:bg-surface dark:border-border
    ">
      {/* ── Logo ── */}
      <div className="flex items-center gap-2.5 pb-5 border-b border-gray-200 dark:border-border">
        <span className="w-8 h-8 rounded-[9px] bg-brand flex items-center justify-center text-black text-base flex-shrink-0">
          ✦
        </span>
        <span className="text-[17px] font-black tracking-tight text-gray-900 dark:text-white">
          task<span className="text-brand">flow</span>
        </span>
      </div>

      {/* ── View filters ── */}
      <nav>
        <p className="text-[9px] font-bold tracking-[2px] uppercase text-gray-400 dark:text-dimmed px-2 mb-2">
          Views
        </p>
        {VIEWS.map((view) => {
          const isActive = activeView === view.key && !activeCategoryId;
          return (
            <button
              key={view.key}
              onClick={() => onViewChange(view.key)}
              className={`
                flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg
                text-[13.5px] font-semibold text-left mb-0.5 transition-colors duration-150
                ${isActive
                  ? 'bg-brand/10 text-brand'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-muted dark:hover:bg-surface-2 dark:hover:text-white'
                }
              `}
            >
              <span className="text-xs">{view.icon}</span>
              {view.label}
              <span className={`
                ml-auto font-mono text-[10.5px] px-2 py-0.5 rounded-full
                ${isActive
                  ? 'bg-brand/15 text-brand'
                  : 'bg-gray-100 text-gray-400 dark:bg-surface-3 dark:text-dimmed'
                }
              `}>
                {viewCount(view.key)}
              </span>
            </button>
          );
        })}
      </nav>

      {/* ── Category filters ── */}
      <nav>
        <p className="text-[9px] font-bold tracking-[2px] uppercase text-gray-400 dark:text-dimmed px-2 mb-2">
          Categories
        </p>
        {categories.map((cat) => {
          const isActive = activeCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`
                flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg
                text-[13.5px] font-semibold text-left mb-0.5 transition-colors duration-150
                ${isActive
                  ? 'text-gray-900 dark:text-white'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-muted dark:hover:bg-surface-2 dark:hover:text-white'
                }
              `}
              style={isActive ? { backgroundColor: `${cat.color}18` } : {}}
            >
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
              {cat.name}
              <span className="ml-auto font-mono text-[10.5px] bg-gray-100 text-gray-400 dark:bg-surface-3 dark:text-dimmed px-2 py-0.5 rounded-full">
                {cat.todo_count}
              </span>
            </button>
          );
        })}
      </nav>

      {/* ── Clear completed ── */}
      {completedCount > 0 && (
        <div className="mt-auto">
          <button onClick={onClearDone} className="btn-danger w-full text-xs">
            ✕ Clear completed ({completedCount})
          </button>
        </div>
      )}

      {/* ── Footer ── */}
      <div className="flex justify-between text-[10px] text-gray-400 dark:text-dimmed font-mono border-t border-gray-200 dark:border-border pt-4">
        <span>TaskFlow</span>
        <span>v1.0.0</span>
      </div>
    </aside>
  );
}