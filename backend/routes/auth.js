/**
 * routes/auth.js
 * ──────────────
 * POST /api/auth/register   → create account
 * POST /api/auth/login      → authenticate + return JWT
 * GET  /api/auth/me         → return current user (protected)
 */

const router   = require('express').Router();
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db           = require('../db');
const authenticate = require('../middleware/auth');

// ── Validation middleware ──────────────────────────────────
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }
  next();
};

// ── JWT helper ─────────────────────────────────────────────
const signToken = (user) =>
  jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

// ── Safe user object (never include password) ──────────────
const safeUser = ({ id, name, email, created_at }) =>
  ({ id, name, email, created_at });

// ─────────────────────────────────────────────────────────────────────────────
//  POST /api/auth/register
// ─────────────────────────────────────────────────────────────────────────────
router.post(
  '/register',
  [
    body('name')
      .trim()
      .notEmpty().withMessage('Name is required')
      .isLength({ max: 100 }),
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Must be a valid email')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  handleValidation,
  async (req, res) => {
    try {
      const { name, email, password } = req.body;

      // ── 1. Check for duplicate email ──────────────────
      const [existing] = await db.query(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );
      if (existing.length) {
        return res.status(409).json({
          success: false,
          message: 'An account with that email already exists.',
        });
      }

      // ── 2. Hash password ──────────────────────────────
      const hashedPassword = await bcrypt.hash(password, 12);

      // ── 3. Insert user ────────────────────────────────
      const [result] = await db.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword]
      );

      // ── 4. Seed default categories for new user ───────
      await db.query(
        `INSERT INTO categories (user_id, name, color) VALUES
          (?, 'Work',     '#3b82f6'),
          (?, 'Personal', '#a855f7'),
          (?, 'Shopping', '#10b981'),
          (?, 'Health',   '#ef4444')`,
        [result.insertId, result.insertId, result.insertId, result.insertId]
      );

      // ── 5. Fetch user + sign token ────────────────────
      const [rows] = await db.query(
        'SELECT id, name, email, created_at FROM users WHERE id = ?',
        [result.insertId]
      );
      const user  = rows[0];
      const token = signToken(user);

      res.status(201).json({
        success: true,
        message: 'Account created successfully.',
        token,
        user: safeUser(user),
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
//  POST /api/auth/login
// ─────────────────────────────────────────────────────────────────────────────
router.post(
  '/login',
  [
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Must be a valid email')
      .normalizeEmail(),
    body('password')
      .notEmpty().withMessage('Password is required'),
  ],
  handleValidation,
  async (req, res) => {
    try {
      const { email, password } = req.body;

      // ── 1. Find user ──────────────────────────────────
      const [rows] = await db.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );

      // Vague message — don't reveal whether email exists
      const INVALID = 'Invalid email or password.';
      if (!rows.length) {
        return res.status(401).json({ success: false, message: INVALID });
      }

      const user = rows[0];

      // ── 2. Compare password ───────────────────────────
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: INVALID });
      }

      // ── 3. Sign token ─────────────────────────────────
      const token = signToken(user);

      res.json({
        success: true,
        message: 'Logged in successfully.',
        token,
        user: safeUser(user),
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
//  GET /api/auth/me   (protected)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/me', authenticate, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, name, email, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    if (!rows.length) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.json({ success: true, user: safeUser(rows[0]) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;