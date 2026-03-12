/**
 * db.js
 * ─────
 * Creates and exports a mysql2 promise-based connection pool.
 * Validates required env vars before attempting to connect,
 * so misconfiguration is caught immediately on startup.
 */

require('dotenv').config();
const mysql = require('mysql2/promise');

// ── Guard: catch missing env vars before connecting ────────
const REQUIRED = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'JWT_SECRET'];
const missing  = REQUIRED.filter((k) => !process.env[k]);

if (missing.length) {
  console.error('\n❌  Missing required environment variables:');
  missing.forEach((k) => console.error(`    • ${k}`));
  console.error('\n   Copy .env.example → .env and fill in every value.\n');
  process.exit(1);
}

// ── Create pool ────────────────────────────────────────────
const pool = mysql.createPool({
  host:               process.env.DB_HOST,
  port:               Number(process.env.DB_PORT) || 3306,
  user:               process.env.DB_USER,
  password:           process.env.DB_PASSWORD,
  database:           process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  timezone:           'Z',
});

// ── Verify connection on startup ──────────────────────────
pool
  .getConnection()
  .then((conn) => {
    console.log(`✅  MySQL connected  →  ${process.env.DB_HOST}/${process.env.DB_NAME}`);
    conn.release();
  })
  .catch((err) => {
    console.error(`\n❌  MySQL connection failed: ${err.message}`);
    console.error('    Check DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME in .env\n');
    process.exit(1);
  });

module.exports = pool;