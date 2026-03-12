/**
 * middleware/auth.js
 * ──────────────────
 * Verifies the JWT sent in the Authorization header.
 * Attaches the decoded user payload to req.user so that
 * downstream route handlers can access req.user.id.
 *
 * Usage:
 *   const authenticate = require('../middleware/auth');
 *   router.get('/protected', authenticate, handler);
 */

const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  // ── 1. Extract token from header ──────────────────────
  const authHeader = req.headers['authorization'];
  const token      = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.',
    });
  }

  // ── 2. Verify token ────────────────────────────────────
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, name, email, iat, exp }
    next();
  } catch (err) {
    const message =
      err.name === 'TokenExpiredError'
        ? 'Token has expired. Please log in again.'
        : 'Invalid token.';

    return res.status(403).json({ success: false, message });
  }
};

module.exports = authenticate;