/**
 * api.js
 * ──────
 * Centralised Axios service layer.
 *
 * - The Vite proxy forwards /api/* to Express on :5000
 * - Request interceptor attaches JWT from localStorage
 * - Response interceptor:
 *     • logs server errors to the console in development
 *     • clears the token and reloads on 401 (session expired)
 */

import axios from 'axios';

const http = axios.create({ baseURL: '/api' });

// ── Request: attach JWT if present ────────────────────────
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Response: surface real error messages ─────────────────
http.interceptors.response.use(
  (res) => res,
  (err) => {
    const status  = err.response?.status;
    const message = err.response?.data?.message || err.message;

    // Log every API error so it's visible in the browser console
    console.error(`[API ${status ?? 'ERR'}] ${err.config?.method?.toUpperCase()} ${err.config?.url} →`, message);

    // Token expired or invalid → force re-login
    if (status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    return Promise.reject(err);
  }
);

// ── Auth ──────────────────────────────────────────────────
export const registerUser = (data) => http.post('/auth/register', data).then(r => r.data);
export const loginUser    = (data) => http.post('/auth/login',    data).then(r => r.data);
export const getMe        = ()     => http.get('/auth/me').then(r => r.data.user);

// ── Todos ─────────────────────────────────────────────────
export const getTodos        = (params = {}) => http.get('/todos', { params }).then(r => r.data.data);
export const getTodo         = (id)          => http.get(`/todos/${id}`).then(r => r.data.data);
export const createTodo      = (data)        => http.post('/todos', data).then(r => r.data.data);
export const updateTodo      = (id, data)    => http.put(`/todos/${id}`, data).then(r => r.data.data);
export const toggleTodo      = (id)          => http.patch(`/todos/${id}/toggle`).then(r => r.data.data);
export const deleteTodo      = (id)          => http.delete(`/todos/${id}`).then(r => r.data);
export const deleteCompleted = ()            => http.delete('/todos/completed/all').then(r => r.data);

// ── Categories ────────────────────────────────────────────
export const getCategories  = ()     => http.get('/categories').then(r => r.data.data);
export const createCategory = (data) => http.post('/categories', data).then(r => r.data.data);
export const deleteCategory = (id)   => http.delete(`/categories/${id}`).then(r => r.data);