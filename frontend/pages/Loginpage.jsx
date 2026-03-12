/**
 * pages/LoginPage.jsx
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../src/components/ThemeToggle';

export default function LoginPage() {
  const { login }   = useAuth();
  const navigate    = useNavigate();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const updateField = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-[#0d0d10]">

      {/* Theme toggle — top right */}
      <div className="fixed top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-3 justify-center mb-10">
          <span className="w-10 h-10 rounded-xl bg-brand flex items-center justify-center text-black text-xl font-black">✦</span>
          <span className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
            task<span className="text-brand">flow</span>
          </span>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8 bg-white border border-gray-200 shadow-sm dark:bg-surface dark:border-border dark:shadow-none">
          <h1 className="text-2xl font-bold tracking-tight mb-1 text-gray-900 dark:text-white">Welcome back</h1>
          <p className="text-sm mb-7 text-gray-500 dark:text-muted">Sign in to your account to continue</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 dark:bg-red-500/10 dark:border-red-500/25 dark:text-red-400 rounded-lg px-4 py-3 text-sm mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-gray-400 dark:text-dimmed mb-1.5">Email address</label>
              <input type="email" placeholder="you@example.com" value={form.email} onChange={updateField('email')} required autoFocus className="field" />
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-gray-400 dark:text-dimmed mb-1.5">Password</label>
              <input type="password" placeholder="••••••••" value={form.password} onChange={updateField('password')} required className="field" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2 py-3 text-[15px]">
              {loading
                ? <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Signing in…
                  </span>
                : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-muted mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-brand hover:text-brand-light font-semibold transition-colors duration-150">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}