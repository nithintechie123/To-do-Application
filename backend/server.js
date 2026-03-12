/**
 * server.js
 * ─────────
 * Express application entry point.
 */

require('dotenv').config();

const express  = require('express');
const cors     = require('cors');
const morgan   = require('morgan');

const authRouter       = require('./routes/auth');
const todosRouter      = require('./routes/todos');
const categoriesRouter = require('./routes/categories');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Global Middleware ──────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// ── API Routes ─────────────────────────────────────────────
app.use('/api/auth',       authRouter);
app.use('/api/todos',      todosRouter);
app.use('/api/categories', categoriesRouter);

// ── Health Check ───────────────────────────────────────────
app.get('/api/health', (_req, res) =>
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
);

// ── 404 Handler ────────────────────────────────────────────
app.use((req, res) =>
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.path}` })
);

// ── Global Error Handler ───────────────────────────────────
// Catches anything that slips through route try/catch blocks
app.use((err, _req, res, _next) => {
  console.error('💥  Unhandled error:', err.message);
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'development'
      ? err.message
      : 'Internal Server Error',
  });
});

// ── Start Server ───────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀  TaskFlow API  →  http://localhost:${PORT}/api`);
  console.log(`    NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
  console.log('\n  Auth:');
  console.log('    POST  /api/auth/register');
  console.log('    POST  /api/auth/login');
  console.log('    GET   /api/auth/me');
  console.log('\n  Protected (JWT required):');
  console.log('    /api/todos       — GET POST PUT PATCH DELETE');
  console.log('    /api/categories  — GET POST DELETE\n');
});