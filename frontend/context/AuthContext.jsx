/**
 * context/AuthContext.jsx
 * ───────────────────────
 * Provides global authentication state to the entire app.
 *
 * Consumers access:
 *   const { user, loading, login, signup, logout } = useAuth();
 *
 * Token storage strategy:
 *   - JWT stored in localStorage under the key "token"
 *   - On app load, the token is verified with GET /api/auth/me
 *     so stale/expired tokens are cleared automatically
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser,registerUser,getMe } from '../src/api';

// ── Context ───────────────────────────────────────────────
const AuthContext = createContext(null);

// ── Provider ──────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true); // true while verifying stored token

  // ── Verify stored token on mount ───────────────────────
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    getMe()
      .then((fetchedUser) => setUser(fetchedUser))
      .catch(() => localStorage.removeItem('token'))  // expired / invalid
      .finally(() => setLoading(false));
  }, []);

  // ── Login ──────────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    const data = await loginUser({ email, password });
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data.user;
  }, []);

  // ── Signup ─────────────────────────────────────────────
  const signup = useCallback(async (name, email, password) => {
    const data = await registerUser({ name, email, password });
    localStorage.setItem('token', data.token);
    setUser(data.user);
    return data.user;
  }, []);

  // ── Logout ─────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}