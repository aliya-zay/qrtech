// === 📦 db/qrcodes.js ===

const pool = require('../db/pool');

async function saveQrCode(email, base64, title) {
  const { rows } = await pool.query(
    'INSERT INTO qrcodes (user_email, qr, title, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *',
    [email, base64, title]
  );
  return rows[0];
}

async function getUserQrCodes(email, isFavorite = null, sortBy = 'created_at') {
  let baseQuery = 'SELECT id, qr, title, created_at, is_favorite FROM qrcodes WHERE user_email = $1';
  const values = [email];

  if (isFavorite !== null) {
    baseQuery += ' AND is_favorite = $2';
    values.push(isFavorite);
  }

  baseQuery += ` ORDER BY ${sortBy === 'title' ? 'title ASC' : 'created_at DESC'}`;

  const result = await pool.query(baseQuery, values);
  return result.rows;
}

async function toggleFavorite(qrId, isFavorite) {
  await pool.query(
    'UPDATE qrcodes SET is_favorite = $1 WHERE id = $2',
    [isFavorite, qrId]
  );
}

async function deleteQrCode(id, email) {
  await pool.query('DELETE FROM qrcodes WHERE id = $1 AND user_email = $2', [id, email]);
}

async function updateQrCodeTitle(qrId, newTitle, email) {
  try {
      await pool.query(
          'UPDATE qrcodes SET title = $1, updated_at = NOW() WHERE id = $2 AND user_email = $3',
          [newTitle, qrId, email]
      );
  } catch (error) {
      console.error("Error updating QR code title in DB:", error);
      throw error;
  }
}

module.exports = { saveQrCode, getUserQrCodes, toggleFavorite, deleteQrCode, updateQrCodeTitle };
