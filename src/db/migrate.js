import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.resolve(__dirname, './migrations');

const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

db.exec('BEGIN');
try {
  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
    db.exec(sql);
    console.log(`Applied migration: ${file}`);
  }
  db.exec('COMMIT');
  console.log('All migrations applied.');
} catch (e) {
  db.exec('ROLLBACK');
  console.error('Migration failed:', e);
  process.exit(1);
}
