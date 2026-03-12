/**
 * main.jsx
 * ────────
 * Vite entry point.
 * Wraps the app in:
 *   - ThemeProvider    (dark / light theme)
 *   - BrowserRouter    (react-router-dom)
 *   - AuthProvider     (JWT auth state)
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider }  from '../context/AuthContext';
import App, { ProtectedRoute } from './App';

import LoginPage from '../pages/Loginpage';
import SignupPage from '../pages/Signuppage';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public */}
            <Route path="/login"  element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Protected */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <App />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);