class MemoApp {
    constructor() {
        this.memos = JSON.parse(localStorage.getItem('memos')) || [];
        this.titleInput = document.getElementById('memoTitle');
        this.contentInput = document.getElementById('memoContent');
        this.saveButton = document.getElementById('saveButton');
        this.memosContainer = document.getElementById('memos');

        this.saveButton.addEventListener('click', () => this.saveMemo());
        this.renderMemos();
    }

    saveMemo() {
        const title = this.titleInput.value.trim();
        const content = this.contentInput.value.trim();

        if (!title || !content) {
            alert('タイトルと内容を入力してください。');
            return;
        }

        const memo = {
            id: Date.now(),
            title,
            content,
            date: new Date().toLocaleString()
        };

        this.memos.unshift(memo);
        this.saveToLocalStorage();
        this.renderMemos();
        this.clearInputs();
    }

    deleteMemo(id) {
        if (confirm('このメモを削除してもよろしいですか？')) {
            this.memos = this.memos.filter(memo => memo.id !== id);
            this.saveToLocalStorage();
            this.renderMemos();
        }
    }

    saveToLocalStorage() {
        localStorage.setItem('memos', JSON.stringify(this.memos));
    }

    renderMemos() {
        this.memosContainer.innerHTML = '';
        this.memos.forEach(memo => {
            const memoElement = document.createElement('div');
            memoElement.className = 'memo-item';
            memoElement.innerHTML = `
                <div class="memo-title">${memo.title}</div>
                <div class="memo-content">${memo.content}</div>
                <div class="memo-date">${memo.date}</div>
                <div class="memo-actions">
                    <button class="delete-button" onclick="memoApp.deleteMemo(${memo.id})">削除</button>
                </div>
            `;
            this.memosContainer.appendChild(memoElement);
        });
    }

    clearInputs() {
        this.titleInput.value = '';
        this.contentInput.value = '';
    }
}

// メモ帳アプリの初期化
const memoApp = new MemoApp();
