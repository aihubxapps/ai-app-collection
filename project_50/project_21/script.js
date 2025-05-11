class TodoApp {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
        this.todoInput = document.getElementById('todoInput');
        this.addButton = document.getElementById('addButton');
        this.todosList = document.getElementById('todos');
        this.currentFilter = 'all';

        this.setupEventListeners();
        this.renderTodos();
    }

    setupEventListeners() {
        this.addButton.addEventListener('click', () => this.addTodo());
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });

        document.querySelectorAll('.filter-button').forEach(button => {
            button.addEventListener('click', () => {
                document.querySelector('.filter-button.active').classList.remove('active');
                button.classList.add('active');
                this.currentFilter = button.dataset.filter;
                this.renderTodos();
            });
        });
    }

    addTodo() {
        const text = this.todoInput.value.trim();
        if (!text) return;

        const todo = {
            id: Date.now(),
            text,
            completed: false
        };

        this.todos.unshift(todo);
        this.saveToLocalStorage();
        this.renderTodos();
        this.todoInput.value = '';
    }

    toggleTodo(id) {
        this.todos = this.todos.map(todo => {
            if (todo.id === id) {
                return { ...todo, completed: !todo.completed };
            }
            return todo;
        });
        this.saveToLocalStorage();
        this.renderTodos();
    }

    deleteTodo(id) {
        if (confirm('このタスクを削除してもよろしいですか？')) {
            this.todos = this.todos.filter(todo => todo.id !== id);
            this.saveToLocalStorage();
            this.renderTodos();
        }
    }

    saveToLocalStorage() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    renderTodos() {
        this.todosList.innerHTML = '';
        const filteredTodos = this.todos.filter(todo => {
            switch (this.currentFilter) {
                case 'active':
                    return !todo.completed;
                case 'completed':
                    return todo.completed;
                default:
                    return true;
            }
        });

        filteredTodos.forEach(todo => {
            const todoElement = document.createElement('li');
            todoElement.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            todoElement.innerHTML = `
                <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
                <span class="todo-text">${todo.text}</span>
                <button class="delete-button">削除</button>
            `;

            const checkbox = todoElement.querySelector('.todo-checkbox');
            checkbox.addEventListener('change', () => this.toggleTodo(todo.id));

            const deleteButton = todoElement.querySelector('.delete-button');
            deleteButton.addEventListener('click', () => this.deleteTodo(todo.id));

            this.todosList.appendChild(todoElement);
        });
    }
}

// TODOリストアプリの初期化
const todoApp = new TodoApp();
