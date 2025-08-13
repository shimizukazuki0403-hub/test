import express from 'express';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';

import './db/index.js'; // DB初期化
import todosRouter from './routes/todos.js';
import authRouter from './routes/auth.js';
import { requireLogin } from './middleware/auth.js';

const app = express(); // ★ app は最初に作る
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json());

// セッション（開発用設定。本番は secure/ストア切替推奨）
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    // secure: true, // HTTPSのみのとき有効化
    maxAge: 1000 * 60 * 60,
  }
}));

// 静的配信（/ -> public/）
app.use(express.static(path.join(__dirname, 'public')));

// 認証API
app.use('/api/auth', authRouter);

// Todo API（ログイン必須）
app.use('/api/todos', requireLogin, todosRouter);

// ルート
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
