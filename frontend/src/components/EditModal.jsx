/**
 * components/EditModal.jsx
 * ────────────────────────
 * Modal dialog for editing an existing todo.
 */

import { useState, useEffect, useRef } from 'react';

export default function EditModal({ todo, categories, onSave, onClose }) {
  const [form, setForm] = useState({
    title:       todo.title,
    description: todo.description || '',
    priority:    todo.priority,
    due_date:    todo.due_date ? todo.due_date.slice(0, 10) : '',
    category_id: todo.category_id ?? '',
  });
  const [loading, setLoading] = useState(false);
  const titleRef = useRef(null);

  useEffect(() => { titleRef.current?.focus(); }, []);
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const updateField = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSave = async () => {
    if (!form.title.trim()) return;
    try {
      setLoading(true);
      await onSave(todo.id, {
        ...form,
        due_date:    form.due_date    || null,
        category_id: form.category_id ? Number(form.category_id) : null,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Dialog */}
      <div
        role="dialog" aria-modal="true" aria-label="Edit task"
        className="
          w-full max-w-md rounded-2xl shadow-2xl animate-popIn overflow-hidden
          bg-white border border-gray-200
          dark:bg-surface dark:border-border-2
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-0">
          <h2 className="font-serif text-[22px] font-normal tracking-tight text-gray-900 dark:text-white">
            Edit Task
          </h2>
          <button aria-label="Close" onClick={onClose} className="icon-btn">✕</button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 flex flex-col gap-4">
          <div>
            <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400 dark:text-dimmed block mb-1.5">Title</label>
            <input ref={titleRef} type="text" value={form.title} onChange={updateField('title')} placeholder="Task title" className="field" />
          </div>
          <div>
            <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400 dark:text-dimmed block mb-1.5">Description</label>
            <textarea value={form.description} onChange={updateField('description')} placeholder="Optional description" rows={3} className="field resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400 dark:text-dimmed block mb-1.5">Priority</label>
              <select value={form.priority} onChange={updateField('priority')} className="field">
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400 dark:text-dimmed block mb-1.5">Category</label>
              <select value={form.category_id} onChange={updateField('category_id')} className="field">
                <option value="">No Category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold tracking-widest uppercase text-gray-400 dark:text-dimmed block mb-1.5">Due Date</label>
            <input type="date" value={form.due_date} onChange={updateField('due_date')} className="field [color-scheme:dark]" />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2.5 px-6 pb-5 border-t border-gray-100 dark:border-border pt-4">
          <button onClick={onClose} className="btn-ghost">Cancel</button>
          <button onClick={handleSave} disabled={!form.title.trim() || loading} className="btn-primary">
            {loading ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}