/**
 * hooks/useTodos.js
 * ─────────────────
 * Custom hook — owns all server state for todos + categories.
 * Components call the returned action functions and never
 * import from api.js directly.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getTodos, getCategories,
  createTodo, updateTodo, toggleTodo, deleteTodo, deleteCompleted,
} from '../api';

export function useTodos() {
  const [todos,      setTodos]      = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);

  // ── Load all data ──────────────────────────────────────
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [fetchedTodos, fetchedCategories] = await Promise.all([
        getTodos(),
        getCategories(),
      ]);
      setTodos(fetchedTodos);
      setCategories(fetchedCategories);
    } catch (err) {
      // Show the actual server error message so issues are obvious
      const msg = err.response?.data?.message || err.message || 'Failed to load data.';
      setError(msg);
      console.error('useTodos loadData error:', msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // ── Mutations ──────────────────────────────────────────
  const addTodo = async (data) => {
    const newTodo = await createTodo(data);
    setTodos((prev) => [newTodo, ...prev]);
    setCategories((prev) =>
      prev.map((c) =>
        c.id === newTodo.category_id
          ? { ...c, todo_count: Number(c.todo_count) + 1 }
          : c
      )
    );
    return newTodo;
  };

  const editTodo = async (id, data) => {
    const updated = await updateTodo(id, data);
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  };

  const toggle = async (id) => {
    const updated = await toggleTodo(id);
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  };

  const removeTodo = async (id) => {
    const target = todos.find((t) => t.id === id);
    await deleteTodo(id);
    setTodos((prev) => prev.filter((t) => t.id !== id));
    if (target?.category_id) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === target.category_id
            ? { ...c, todo_count: Math.max(0, Number(c.todo_count) - 1) }
            : c
        )
      );
    }
  };

  const clearDone = async () => {
    await deleteCompleted();
    await loadData(); // reload for accurate counts
  };

  return {
    todos, categories, loading, error,
    addTodo, editTodo, toggle, removeTodo, clearDone,
    reload: loadData,
  };
}