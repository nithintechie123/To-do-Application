/**
 * routes/categories.js
 * ────────────────────
 * All routes are protected. Categories are scoped to req.user.id.
 *
 * GET    /api/categories       → list with todo_count
 * POST   /api/categories       → create
 * DELETE /api/categories/:id   → delete
 */

const router       = require('express').Router();
const { body, param, validationResult } = require('express-validator');
const db           = require('../db');
const authenticate = require('../middleware/auth');

router.use(authenticate);

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ success: false, errors: errors.array() });
  next();
};

// GET /api/categories
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT c.*, COUNT(t.id) AS todo_count
      FROM   categories c
      LEFT JOIN todos t ON t.category_id = c.id
      WHERE  c.user_id = ?
      GROUP  BY c.id
      ORDER  BY c.name ASC
    `, [req.user.id]);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/categories
router.post('/',
  [
    body('name').trim().notEmpty().withMessage('Category name is required').isLength({ max: 100 }),
    body('color').optional().matches(/^#[0-9A-Fa-f]{6}$/).withMessage('Must be a valid hex colour'),
  ],
  handleValidation,
  async (req, res) => {
    try {
      const { name, color = '#f59e0b' } = req.body;
      const [result] = await db.query(
        'INSERT INTO categories (user_id, name, color) VALUES (?, ?, ?)',
        [req.user.id, name, color]
      );
      const [rows] = await db.query(
        'SELECT *, 0 AS todo_count FROM categories WHERE id = ?',
        [result.insertId]
      );
      res.status(201).json({ success: true, data: rows[0] });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// DELETE /api/categories/:id
router.delete('/:id', param('id').isInt({ min: 1 }), handleValidation, async (req, res) => {
  try {
    const [result] = await db.query(
      'DELETE FROM categories WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    if (!result.affectedRows) return res.status(404).json({ success: false, message: 'Category not found.' });
    res.json({ success: true, message: 'Category deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;