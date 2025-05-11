class PlotCardApp {
    constructor() {
        this.cards = [];
        this.currentCardId = null;
        this.setupElements();
        this.setupEventListeners();
        this.loadCards();
    }

    setupElements() {
        this.cardContainer = document.getElementById('cardContainer');
        this.cardList = document.getElementById('cardList');
        this.titleInput = document.getElementById('cardTitle');
        this.contentInput = document.getElementById('cardContent');
        this.addButton = document.getElementById('addButton');
        this.saveButton = document.getElementById('saveButton');
        this.loadButton = document.getElementById('loadButton');
    }

    setupEventListeners() {
        this.addButton.addEventListener('click', () => this.addCard());
        this.saveButton.addEventListener('click', () => this.saveCards());
        this.loadButton.addEventListener('click', () => this.loadCards());
        this.setupDragAndDrop();
    }

    setupDragAndDrop() {
        this.cardContainer.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('card')) {
                e.target.classList.add('dragging');
                e.dataTransfer.setData('text/plain', e.target.id);
            }
        });

        this.cardContainer.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('card')) {
                e.target.classList.remove('dragging');
            }
        });

        this.cardContainer.addEventListener('dragover', (e) => {
            e.preventDefault();
            const card = e.target.closest('.card');
            if (card) {
                const draggingCard = document.querySelector('.dragging');
                if (draggingCard && draggingCard !== card) {
                    const rect = card.getBoundingClientRect();
                    const y = e.clientY - rect.top;
                    if (y < rect.height / 2) {
                        card.parentNode.insertBefore(draggingCard, card);
                    } else {
                        card.parentNode.insertBefore(draggingCard, card.nextSibling);
                    }
                }
            }
        });
    }

    addCard() {
        const title = this.titleInput.value.trim();
        const content = this.contentInput.value.trim();

        if (!title || !content) {
            alert('タイトルと内容を入力してください。');
            return;
        }

        const card = {
            id: Date.now().toString(),
            title,
            content
        };

        this.cards.push(card);
        this.renderCard(card);
        this.updateCardList();
        this.clearForm();
    }

    renderCard(card) {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.id = card.id;
        cardElement.draggable = true;

        cardElement.innerHTML = `
            <div class="card-actions">
                <button class="card-action edit-btn">✏️</button>
                <button class="card-action delete-btn">🗑️</button>
            </div>
            <div class="card-title">${card.title}</div>
            <div class="card-content">${card.content}</div>
        `;

        cardElement.querySelector('.edit-btn').addEventListener('click', () => this.editCard(card));
        cardElement.querySelector('.delete-btn').addEventListener('click', () => this.deleteCard(card.id));

        this.cardContainer.appendChild(cardElement);
    }

    editCard(card) {
        this.currentCardId = card.id;
        this.titleInput.value = card.title;
        this.contentInput.value = card.content;
        this.addButton.textContent = '更新';
    }

    deleteCard(id) {
        if (confirm('このカードを削除してもよろしいですか？')) {
            this.cards = this.cards.filter(card => card.id !== id);
            const cardElement = document.getElementById(id);
            if (cardElement) {
                cardElement.remove();
            }
            this.updateCardList();
        }
    }

    updateCardList() {
        this.cardList.innerHTML = '';
        this.cards.forEach(card => {
            const listItem = document.createElement('div');
            listItem.className = 'list-item';
            listItem.textContent = card.title;
            listItem.addEventListener('click', () => this.editCard(card));
            this.cardList.appendChild(listItem);
        });
    }

    clearForm() {
        this.titleInput.value = '';
        this.contentInput.value = '';
        this.addButton.textContent = '追加';
        this.currentCardId = null;
    }

    saveCards() {
        localStorage.setItem('plotCards', JSON.stringify(this.cards));
        alert('カードを保存しました。');
    }

    loadCards() {
        const savedCards = localStorage.getItem('plotCards');
        if (savedCards) {
            this.cards = JSON.parse(savedCards);
            this.cardContainer.innerHTML = '';
            this.cards.forEach(card => this.renderCard(card));
            this.updateCardList();
            alert('カードを読み込みました。');
        } else {
            alert('保存されたカードが見つかりません。');
        }
    }
}

// アプリケーションの初期化
document.addEventListener('DOMContentLoaded', () => {
    new PlotCardApp();
});
