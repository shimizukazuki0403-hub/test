import bcrypt from 'bcrypt';
import db from './index.js';

const userId = process.env.SEED_USER_ID || 'demo';
const password = process.env.SEED_PASSWORD || 'demo1234';

(async () => {
  const hash = await bcrypt.hash(password, 10);
  const insert = db.prepare('INSERT OR IGNORE INTO users (user_id, password_hash) VALUES (?, ?)');
  insert.run(userId, hash);
  console.log(`Seeded user: ${userId} / password: ${password}`);
})();
