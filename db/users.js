// === 📦 db/users.js ===

const pool = require('../db/pool');

async function getUserByEmail(email) {
  const { rows } = await pool.query('SELECT * FROM users WHERE mail = $1', [email]);
  return rows[0];
}

async function createUser(name, email, hashedPassword) {
  const { rows } = await pool.query(
    'INSERT INTO users (name, mail, password) VALUES ($1, $2, $3) RETURNING *',
    [name, email, hashedPassword]
  );
  return rows[0];
}

module.exports = { getUserByEmail, createUser };