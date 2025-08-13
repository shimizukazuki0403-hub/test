import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, '../../todo.db');

// WALモードで並行性＆安全性を少し上げる
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

export default db;
