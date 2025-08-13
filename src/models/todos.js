import db from "../db/index.js";

const toRow = (row) => row && ({
  id: row.id,
  title: row.title,
  done: !!row.done,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  deleted: !!row.deleted,
});

// 一覧：削除されていないものだけ
export function listTodos() {
  const stmt = db.prepare("SELECT * FROM todos WHERE deleted = 0 ORDER BY id DESC");
  return stmt.all().map(toRow);
}

// 追加：deleted はデフォルト0
export function createTodo(title) {
  const insert = db.prepare("INSERT INTO todos (title, done) VALUES (?, 0)");
  const info = insert.run(title);
  const select = db.prepare("SELECT * FROM todos WHERE id = ?");
  return toRow(select.get(info.lastInsertRowid));
}

// 完了/未完了切替：削除済みには作用しない
export function toggleTodo(id, done) {
  const stmt = db.prepare("UPDATE todos SET done = ? WHERE id = ? AND deleted = 0");
  stmt.run(done ? 1 : 0, id);
  const select = db.prepare("SELECT * FROM todos WHERE id = ? AND deleted = 0");
  return toRow(select.get(id));
}

// タイトル更新：削除済みには作用しない
export function updateTitle(id, title) {
  const stmt = db.prepare("UPDATE todos SET title = ? WHERE id = ? AND deleted = 0");
  stmt.run(title, id);
  const select = db.prepare("SELECT * FROM todos WHERE id = ? AND deleted = 0");
  return toRow(select.get(id));
}

// ★削除：物理DELETEではなく論理削除に変更
export function deleteTodo(id) {
  const stmt = db.prepare("UPDATE todos SET deleted = 1 WHERE id = ?");
  const info = stmt.run(id);
  return info.changes > 0;
}

/* （任意）復元機能を付けたい場合
export function restoreTodo(id) {
  const stmt = db.prepare("UPDATE todos SET deleted = 0 WHERE id = ?");
  const info = stmt.run(id);
  return info.changes > 0;
}
*/
