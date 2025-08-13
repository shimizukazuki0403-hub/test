import { Router } from 'express';
import { listTodos, createTodo, toggleTodo, updateTitle, deleteTodo /*, restoreTodo*/ } from '../models/todos.js';

const router = Router();

// 一覧
router.get('/', (req, res) => {
  res.json(listTodos());
});

// 作成
router.post('/', (req, res) => {
  const { title } = req.body ?? {};
  if (!title || !title.trim()) return res.status(400).json({ error: 'title is required' });
  const todo = createTodo(title.trim());
  res.status(201).json(todo);
});

// 完了/未完了の切替
router.patch('/:id/done', (req, res) => {
  const id = Number(req.params.id);
  const { done } = req.body ?? {};
  const todo = toggleTodo(id, !!done);
  if (!todo) return res.status(404).json({ error: 'not found' });
  res.json(todo);
});

// タイトル更新
router.patch('/:id', (req, res) => {
  const id = Number(req.params.id);
  const { title } = req.body ?? {};
  if (!title || !title.trim()) return res.status(400).json({ error: 'title is required' });
  const todo = updateTitle(id, title.trim());
  if (!todo) return res.status(404).json({ error: 'not found' });
  res.json(todo);
});

// ★削除（エンドポイントはそのまま / 実装が論理削除に変更）
router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  const ok = deleteTodo(id);
  if (!ok) return res.status(404).json({ error: 'not found' });
  res.status(204).end();
});

/* （任意）復元APIを追加したい場合
router.patch('/:id/restore', (req, res) => {
  const id = Number(req.params.id);
  const ok = restoreTodo(id);
  if (!ok) return res.status(404).json({ error: 'not found' });
  res.status(200).json({ ok: true });
});
*/

export default router;
