const listEl = document.querySelector('#list');
const formEl = document.querySelector('#create-form');
const titleEl = document.querySelector('#title');
async function ensureLogin() {
  const me = await fetch('/api/auth/me').then(r=>r.json());
  if (!me.user) {
    location.href = '/login.html';
    throw new Error('not logged in');
  } else {
   const who = document.querySelector('#who');
if (who) {
  who.textContent = me.user.userId;
}
  }
}
await ensureLogin();

async function fetchTodos() {
  const res = await fetch('/api/todos');
  const data = await res.json();
  render(data);
}

function render(todos) {
  listEl.innerHTML = '';
  for (const t of todos) {
    const li = document.createElement('li');
    li.className = `item ${t.done ? 'done' : ''}`;
    li.dataset.id = t.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = t.done;
    checkbox.addEventListener('change', () => toggleDone(t.id, checkbox.checked));

    const title = document.createElement('span');
    title.className = 'title';
    title.textContent = t.title;

    // クリックでインライン編集
    title.addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'text';
      input.value = t.title;
      input.addEventListener('keydown', async (e) => {
        if (e.key === 'Enter') {
          await updateTitle(t.id, input.value);
        }
      });
      input.addEventListener('blur', async () => {
        await updateTitle(t.id, input.value);
      });
      li.replaceChild(input, title);
      input.focus();
      input.select();
    });

    const spacer = document.createElement('div');
    spacer.className = 'spacer';

    const del = document.createElement('button');
    del.textContent = '削除';
    del.className = 'danger';
    del.addEventListener('click', () => remove(t.id));

    li.append(checkbox, title, spacer, del);
    listEl.appendChild(li);
  }
}

formEl.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = titleEl.value.trim();
  if (!title) return;
  await fetch('/api/todos', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ title })
  });
  titleEl.value = '';
  await fetchTodos();
});

async function toggleDone(id, done) {
  await fetch(`/api/todos/${id}/done`, {
    method: 'PATCH',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ done })
  });
  await fetchTodos();
}

async function updateTitle(id, title) {
  title = (title ?? '').trim();
  if (!title) { await fetchTodos(); return; }
  await fetch(`/api/todos/${id}`, {
    method: 'PATCH',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ title })
  });
  await fetchTodos();
}

async function remove(id) {
  await fetch(`/api/todos/${id}`, { method: 'DELETE' });
  await fetchTodos();
}

// 初期描画
fetchTodos();