/**
 * routes/todos.js
 * ───────────────
 * All routes are protected by the authenticate middleware.
 * Every query is scoped to req.user.id so users only see
 * and modify their own todos.
 *
 * GET    /api/todos                  → list (filterable)
 * GET    /api/todos/:id              → single todo
 * POST   /api/todos                  → create
 * PUT    /api/todos/:id              → full update
 * PATCH  /api/todos/:id/toggle       → toggle completed
 * DELETE /api/todos/completed/all    → bulk-delete completed
 * DELETE /api/todos/:id              → delete one
 */

const router       = require('express').Router();
const { body, param, validationResult } = require('express-validator');
const db           = require('../db');
const authenticate = require('../middleware/auth');

// ── All todo routes require authentication ─────────────────
router.use(authenticate);

// ── Shared SQL fragment ────────────────────────────────────
const BASE_SELECT = `
  SELECT
    t.*,
    c.name  AS category_name,
    c.color AS category_color
  FROM todos t
  LEFT JOIN categories c ON c.id = t.category_id
`;

// ── Validation middleware ──────────────────────────────────
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, errors: errors.array() });
  }
  next();
};

// GET /api/todos
router.get('/', async (req, res) => {
  try {
    const conditions = ['t.user_id = ?'];
    const values     = [req.user.id];

    if (req.query.completed !== undefined) {
      conditions.push('t.completed = ?');
      values.push(req.query.completed === 'true' ? 1 : 0);
    }
    if (req.query.priority) {
      conditions.push('t.priority = ?');
      values.push(req.query.priority);
    }
    if (req.query.category_id) {
      conditions.push('t.category_id = ?');
      values.push(req.query.category_id);
    }

    const [rows] = await db.query(
      `${BASE_SELECT} WHERE ${conditions.join(' AND ')} ORDER BY t.created_at DESC`,
      values
    );

    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/todos/:id
router.get('/:id', param('id').isInt({ min: 1 }), handleValidation, async (req, res) => {
  try {
    const [rows] = await db.query(
      `${BASE_SELECT} WHERE t.id = ? AND t.user_id = ?`,
      [req.params.id, req.user.id]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'Todo not found.' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/todos
router.post('/',
  [
    body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 255 }),
    body('description').optional({ nullable: true }).trim(),
    body('priority').optional().isIn(['low', 'medium', 'high']),
    body('due_date').optional({ nullable: true }).isISO8601(),
    body('category_id').optional({ nullable: true }).isInt({ min: 1 }),
  ],
  handleValidation,
  async (req, res) => {
    try {
      const { title, description = null, priority = 'medium', due_date = null, category_id = null } = req.body;
      const [result] = await db.query(
        `INSERT INTO todos (user_id, title, description, priority, due_date, category_id) VALUES (?, ?, ?, ?, ?, ?)`,
        [req.user.id, title, description, priority, due_date, category_id]
      );
      const [rows] = await db.query(`${BASE_SELECT} WHERE t.id = ?`, [result.insertId]);
      res.status(201).json({ success: true, data: rows[0] });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// PUT /api/todos/:id
router.put('/:id',
  [
    param('id').isInt({ min: 1 }),
    body('title').optional().trim().notEmpty().isLength({ max: 255 }),
    body('description').optional({ nullable: true }).trim(),
    body('completed').optional().isBoolean(),
    body('priority').optional().isIn(['low', 'medium', 'high']),
    body('due_date').optional({ nullable: true }).isISO8601(),
    body('category_id').optional({ nullable: true }).isInt({ min: 1 }),
  ],
  handleValidation,
  async (req, res) => {
    try {
      const [existing] = await db.query('SELECT id FROM todos WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
      if (!existing.length) return res.status(404).json({ success: false, message: 'Todo not found.' });

      const ALLOWED = ['title', 'description', 'completed', 'priority', 'due_date', 'category_id'];
      const sets = [], values = [];
      ALLOWED.forEach((f) => { if (req.body[f] !== undefined) { sets.push(`${f} = ?`); values.push(req.body[f]); } });
      if (!sets.length) return res.status(400).json({ success: false, message: 'No fields to update.' });

      values.push(req.params.id, req.user.id);
      await db.query(`UPDATE todos SET ${sets.join(', ')} WHERE id = ? AND user_id = ?`, values);
      const [rows] = await db.query(`${BASE_SELECT} WHERE t.id = ?`, [req.params.id]);
      res.json({ success: true, data: rows[0] });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// PATCH /api/todos/:id/toggle
router.patch('/:id/toggle', param('id').isInt({ min: 1 }), handleValidation, async (req, res) => {
  try {
    const [result] = await db.query(
      'UPDATE todos SET completed = NOT completed WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    if (!result.affectedRows) return res.status(404).json({ success: false, message: 'Todo not found.' });
    const [rows] = await db.query(`${BASE_SELECT} WHERE t.id = ?`, [req.params.id]);
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/todos/completed/all  ← must come BEFORE /:id
router.delete('/completed/all', async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM todos WHERE completed = 1 AND user_id = ?', [req.user.id]);
    res.json({ success: true, deleted: result.affectedRows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/todos/:id
router.delete('/:id', param('id').isInt({ min: 1 }), handleValidation, async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM todos WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (!result.affectedRows) return res.status(404).json({ success: false, message: 'Todo not found.' });
    res.json({ success: true, message: 'Todo deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;