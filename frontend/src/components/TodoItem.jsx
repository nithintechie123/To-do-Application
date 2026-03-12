/**
 * components/TodoItem.jsx
 * ───────────────────────
 * Single todo row with checkbox, badges, and hover actions.
 */

import { useState } from 'react';
import { formatDate, isOverdue, PRIORITY_CONFIG } from '../utils/helpers';

const EditIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
       stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14H6L5 6"/>
    <path d="M10 11v6M14 11v6M9 6V4h6v2"/>
  </svg>
);

export default function TodoItem({ todo, categories, onToggle, onDelete, onEdit }) {
  const [toggling, setToggling] = useState(false);

  const category = categories.find((c) => c.id === todo.category_id);
  const priority = PRIORITY_CONFIG[todo.priority];
  const overdue  = isOverdue(todo.due_date);
  const dueLabel = formatDate(todo.due_date);

  const handleToggle = async () => {
    setToggling(true);
    await onToggle(todo.id);
    setToggling(false);
  };

  return (
    <article className={`
      group flex items-start gap-3 rounded-xl px-4 py-3.5
      transition-all duration-150 animate-slideDown
      bg-white border border-gray-200 hover:border-gray-300
      dark:bg-surface dark:border-border dark:hover:border-border-2
      ${todo.completed ? 'opacity-50' : ''}
    `}>
      {/* Checkbox */}
      <button
        aria-label={todo.completed ? 'Mark incomplete' : 'Mark complete'}
        onClick={handleToggle}
        disabled={toggling}
        className={`
          flex-shrink-0 mt-0.5 w-5 h-5 rounded-[5px] border-2
          flex items-center justify-center transition-all duration-150
          ${todo.completed
            ? 'bg-green-500 border-green-500'
            : 'border-gray-300 hover:border-brand dark:border-border-2 dark:hover:border-brand'
          }
          ${toggling ? 'opacity-50' : ''}
        `}
      >
        {todo.completed && <span className="text-white text-[11px] font-bold leading-none">✓</span>}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`
          text-[14.5px] font-semibold leading-snug
          ${todo.completed
            ? 'line-through text-gray-400 dark:text-dimmed'
            : 'text-gray-900 dark:text-white'
          }
        `}>
          {todo.title}
        </p>

        {todo.description && (
          <p className="text-[12.5px] text-gray-500 dark:text-muted mt-0.5 truncate">
            {todo.description}
          </p>
        )}

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          <span className={`badge ${priority.classes}`}>{priority.label}</span>

          {category && (
            <span className="badge" style={{ backgroundColor: `${category.color}1a`, color: category.color }}>
              {category.name}
            </span>
          )}

          {dueLabel && (
            <span className={`badge ${
              overdue
                ? 'bg-red-500/10 text-red-400'
                : 'bg-gray-100 text-gray-500 dark:bg-surface-3 dark:text-muted'
            }`}>
              {overdue ? '⚠ ' : '📅 '}{dueLabel}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex-shrink-0">
        <button aria-label="Edit" onClick={() => onEdit(todo)} className="icon-btn">
          <EditIcon />
        </button>
        <button
          aria-label="Delete"
          onClick={() => onDelete(todo.id)}
          className="icon-btn hover:!bg-red-50 hover:!text-red-500 dark:hover:!bg-red-500/10 dark:hover:!text-red-400"
        >
          <TrashIcon />
        </button>
      </div>
    </article>
  );
}