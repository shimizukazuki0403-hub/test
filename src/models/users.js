import db from '../db/index.js';

export function findUserByUserId(userId) {
  return db.prepare('SELECT * FROM users WHERE user_id = ?').get(userId);
}
