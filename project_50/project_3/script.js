let todos = [];

// ページ読み込み時にストレージから復元
window.onload = () => {
  const saved = JSON.parse(localStorage.getItem('todoList'));
  if (saved) todos = saved;
  renderTodos();
};

// ローカルストレージに保存
function saveToLocalStorage() {
  localStorage.setItem('todoList', JSON.stringify(todos));
}

// TODO の描画
function renderTodos() {
  const container = document.getElementById('todoList');
  container.innerHTML = '';
  todos.forEach((item, idx) => {
    const div = document.createElement('div');
    div.className = 'todoItem' + (item.completed ? ' completed' : '');

    // チェックボックス
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = item.completed;
    checkbox.onchange = () => {
      todos[idx].completed = checkbox.checked;
      saveToLocalStorage();
      renderTodos();  // ここで再描画
    };

    // テキスト
    const span = document.createElement('span');
    span.textContent = item.text;

    // 削除ボタン
    const delBtn = document.createElement('button');
    delBtn.textContent = '✕';
    delBtn.onclick = () => {
      todos.splice(idx, 1);
      saveToLocalStorage();
      renderTodos();
    };

    div.appendChild(checkbox);
    div.appendChild(span);
    div.appendChild(delBtn);
    container.appendChild(div);
  });
}

// 新規追加
function addNewTodo() {
  const input = document.getElementById('newTodoInput');
  const text = input.value.trim();
  if (!text) return;
  todos.push({ text, completed: false });
  input.value = '';
  saveToLocalStorage();
  renderTodos();
}

// 完了済みを一括クリア
function clearCompleted() {
  todos = todos.filter(item => !item.completed);
  saveToLocalStorage();
  renderTodos();
}
