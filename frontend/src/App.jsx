/**
 * App.jsx
 * ───────
 * Root dashboard component + ProtectedRoute wrapper.
 */

import { useState, useMemo } from 'react';
import { Navigate }    from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTodos }    from './hooks/useTodos';
import { todayLabel }  from './utils/helpers';

import Navbar      from './components/Navbar';
import Sidebar     from './components/Sidebar';
import AddTodoForm from './components/AddTodoForm';
import TodoItem    from './components/TodoItem';
import EditModal   from './components/EditModal';
import ProgressBar from './components/ProgressBar';
import SearchBar   from './components/SearchBar';

// ── Protected route wrapper ────────────────────────────────
export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0d0d10]">
        <div className="flex flex-col items-center gap-3 text-gray-400 dark:text-dimmed">
          <div className="w-8 h-8 border-2 border-gray-200 border-t-brand dark:border-border-2 dark:border-t-brand rounded-full animate-spin" />
          <p className="text-sm">Loading…</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  return children;
}

// ── Main dashboard ─────────────────────────────────────────
export default function App() {
  const {
    todos, categories, loading, error,
    addTodo, editTodo, toggle, removeTodo, clearDone,
  } = useTodos();

  const [activeView,       setActiveView]       = useState('all');
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [search,           setSearch]           = useState('');
  const [editingTodo,      setEditingTodo]      = useState(null);

  const handleViewChange     = (view)  => { setActiveView(view);      setActiveCategoryId(null); };
  const handleCategoryChange = (catId) => { setActiveCategoryId((p) => (p === catId ? null : catId)); setActiveView('all'); };

  const filteredTodos = useMemo(() =>
    todos.filter((todo) => {
      if (activeView === 'active'    &&  todo.completed) return false;
      if (activeView === 'completed' && !todo.completed) return false;
      if (activeCategoryId !== null  && todo.category_id !== activeCategoryId) return false;
      if (search && !todo.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    }),
    [todos, activeView, activeCategoryId, search]
  );

  const pendingTodos   = filteredTodos.filter((t) => !t.completed);
  const completedTodos = filteredTodos.filter((t) =>  t.completed);
  const completedCount = todos.filter((t) => t.completed).length;
  const progress       = todos.length ? Math.round((completedCount / todos.length) * 100) : 0;
  const headingText    = activeCategoryId
    ? (categories.find((c) => c.id === activeCategoryId)?.name ?? 'Category')
    : ({ all: 'All', active: 'Active', completed: 'Completed' }[activeView]);

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-50 dark:bg-[#0d0d10]">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          todos={todos} categories={categories}
          activeView={activeView} activeCategoryId={activeCategoryId}
          onViewChange={handleViewChange} onCategoryChange={handleCategoryChange}
          completedCount={completedCount} onClearDone={clearDone}
        />

        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">

          {/* Header */}
          <header className="flex items-start justify-between gap-5 px-9 pt-9 pb-0">
            <div>
              <h1 className="font-serif text-[36px] font-normal tracking-tight leading-tight text-gray-900 dark:text-white">
                {headingText}{' '}
                <em className="not-italic text-brand">Tasks</em>
              </h1>
              <p className="text-gray-500 dark:text-muted text-[12.5px] mt-1.5">{todayLabel()}</p>
            </div>

            {/* Stats */}
            <div className="flex gap-3.5 flex-shrink-0">
              {[
                { value: todos.filter((t) => !t.completed).length, label: 'Remaining' },
                { value: `${progress}%`, label: 'Done' },
              ].map(({ value, label }) => (
                <div key={label} className="rounded-xl px-5 py-3 text-center min-w-[72px] bg-white border border-gray-200 dark:bg-surface dark:border-border">
                  <span className="block font-mono text-[26px] text-brand leading-none">{value}</span>
                  <span className="block text-[9px] font-bold tracking-widest uppercase text-gray-400 dark:text-dimmed mt-1">{label}</span>
                </div>
              ))}
            </div>
          </header>

          {/* Progress */}
          <div className="mt-4"><ProgressBar completed={completedCount} total={todos.length} /></div>

          {/* Add form */}
          <section className="px-9 mt-6">
            <AddTodoForm categories={categories} onAdd={addTodo} />
          </section>

          {/* Search */}
          <section className="px-9 mt-4">
            <SearchBar value={search} onChange={setSearch} />
          </section>

          {/* Todo list */}
          <section className="px-9 mt-6 pb-12 flex-1">

            {error && (
              <div className="rounded-xl px-4 py-3 text-sm mb-5 bg-red-50 border border-red-200 text-red-600 dark:bg-red-500/8 dark:border-red-500/25 dark:text-red-400">
                ⚠ {error}
              </div>
            )}

            {loading && (
              <div className="flex flex-col items-center gap-3 py-16 text-gray-400 dark:text-dimmed">
                <div className="w-7 h-7 border-2 border-gray-200 border-t-brand dark:border-border-2 dark:border-t-brand rounded-full animate-spin" />
                <p className="text-sm">Loading tasks…</p>
              </div>
            )}

            {!loading && filteredTodos.length === 0 && (
              <div className="flex flex-col items-center gap-2 py-16 text-center">
                <span className="text-4xl text-gray-200 dark:text-border-2">✦</span>
                <p className="font-semibold mt-2 text-gray-500 dark:text-muted">
                  {search ? 'No tasks match your search' : 'Nothing here yet'}
                </p>
                <p className="text-sm text-gray-400 dark:text-dimmed">
                  {search ? 'Try a different keyword' : 'Add a task above to get started'}
                </p>
              </div>
            )}

            {!loading && pendingTodos.length > 0 && (
              <div className="mb-6">
                <p className="text-[10px] font-bold tracking-[2px] uppercase font-mono mb-3 text-gray-400 dark:text-dimmed">
                  Pending · {pendingTodos.length}
                </p>
                <div className="flex flex-col gap-2">
                  {pendingTodos.map((todo) => (
                    <TodoItem key={todo.id} todo={todo} categories={categories}
                      onToggle={toggle} onDelete={removeTodo} onEdit={setEditingTodo} />
                  ))}
                </div>
              </div>
            )}

            {!loading && completedTodos.length > 0 && (
              <div>
                <p className="text-[10px] font-bold tracking-[2px] uppercase font-mono mb-3 text-gray-400 dark:text-dimmed">
                  Completed · {completedTodos.length}
                </p>
                <div className="flex flex-col gap-2">
                  {completedTodos.map((todo) => (
                    <TodoItem key={todo.id} todo={todo} categories={categories}
                      onToggle={toggle} onDelete={removeTodo} onEdit={setEditingTodo} />
                  ))}
                </div>
              </div>
            )}
          </section>
        </main>
      </div>

      {editingTodo && (
        <EditModal todo={editingTodo} categories={categories}
          onSave={editTodo} onClose={() => setEditingTodo(null)} />
      )}
    </div>
  );
}