/**
 * components/AddTodoForm.jsx
 * ──────────────────────────
 * Expandable form for creating new todos.
 */

import { useState } from 'react';

const EMPTY_FORM = {
  title: '', description: '', priority: 'medium', due_date: '', category_id: '',
};

export default function AddTodoForm({ categories, onAdd }) {
  const [form,     setForm]     = useState(EMPTY_FORM);
  const [expanded, setExpanded] = useState(false);
  const [loading,  setLoading]  = useState(false);

  const updateField = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!form.title.trim()) return;
    try {
      setLoading(true);
      await onAdd({
        ...form,
        due_date:    form.due_date    || null,
        category_id: form.category_id ? Number(form.category_id) : null,
      });
      setForm(EMPTY_FORM);
      setExpanded(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        rounded-xl p-4 flex flex-col gap-3 transition-colors duration-150
        bg-white border border-gray-200 focus-within:border-gray-300
        dark:bg-surface dark:border-border dark:focus-within:border-border-2
      "
    >
      {/* ── Title row ── */}
      <div className="flex gap-2.5">
        <input
          type="text"
          placeholder="✦  What needs to be done?"
          value={form.title}
          onChange={updateField('title')}
          onFocus={() => setExpanded(true)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit()}
          className="
            flex-1 bg-transparent border-none outline-none text-[15px] font-medium
            text-gray-900 placeholder:text-gray-400
            dark:text-white dark:placeholder:text-dimmed
          "
        />
        <button
          type="submit"
          disabled={!form.title.trim() || loading}
          className="btn-primary flex-shrink-0"
        >
          {loading ? '…' : '+ Add'}
        </button>
      </div>

      {/* ── Expanded fields ── */}
      {expanded && (
        <div className="flex flex-col gap-3 animate-slideDown">
          <textarea
            placeholder="Description (optional)"
            value={form.description}
            onChange={updateField('description')}
            rows={2}
            className="field resize-none"
          />
          <div className="flex flex-wrap gap-2 items-center">
            <select value={form.priority}    onChange={updateField('priority')}    className="field w-auto">
              <option value="low">🟢 Low</option>
              <option value="medium">🟡 Medium</option>
              <option value="high">🔴 High</option>
            </select>
            <select value={form.category_id} onChange={updateField('category_id')} className="field w-auto">
              <option value="">📁 Category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input
              type="date"
              value={form.due_date}
              onChange={updateField('due_date')}
              className="field w-auto [color-scheme:dark]"
            />
            <button type="button" onClick={() => { setForm(EMPTY_FORM); setExpanded(false); }} className="btn-ghost ml-auto">
              Cancel
            </button>
          </div>
        </div>
      )}
    </form>
  );
}