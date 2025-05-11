class ThesaurusApp {
    constructor() {
        this.setupElements();
        this.setupEventListeners();
        this.searchHistory = [];
        this.loadHistory();
    }

    setupElements() {
        this.searchInput = document.getElementById('searchInput');
        this.searchButton = document.getElementById('searchButton');
        this.wordInfo = document.getElementById('wordInfo');
        this.synonymsList = document.getElementById('synonymsList');
        this.searchHistory = document.getElementById('searchHistory');
    }

    setupEventListeners() {
        this.searchButton.addEventListener('click', () => this.searchWord());
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchWord();
            }
        });
    }

    async searchWord() {
        const word = this.searchInput.value.trim();
        if (!word) return;

        this.showLoading();

        try {
            const API_KEY = process.env.THESAURUS_API_KEY;
            const response = await fetch(`https://api.datamuse.com/words?ml=${encodeURIComponent(word)}&max=10`);
            
            if (!response.ok) {
                throw new Error('類語の検索に失敗しました');
            }

            const data = await response.json();
            this.displayResults(word, data);
            this.addToHistory(word);
        } catch (error) {
            this.wordInfo.innerHTML = `<div class="error">エラー: ${error.message}</div>`;
            this.synonymsList.innerHTML = '';
        } finally {
            this.hideLoading();
        }
    }

    displayResults(word, synonyms) {
        // 単語情報の表示
        this.wordInfo.innerHTML = `
            <div class="word-title">${word}</div>
            <div class="word-definition">関連する単語を表示しています</div>
        `;

        // 類語リストの表示
        this.synonymsList.innerHTML = synonyms.map(synonym => `
            <div class="synonym-card" data-word="${synonym.word}">
                <div class="synonym-word">${synonym.word}</div>
                <div class="synonym-type">関連度: ${Math.round(synonym.score * 100)}%</div>
            </div>
        `).join('');

        // 類語カードのクリックイベント
        this.synonymsList.querySelectorAll('.synonym-card').forEach(card => {
            card.addEventListener('click', () => {
                this.searchInput.value = card.dataset.word;
                this.searchWord();
            });
        });
    }

    addToHistory(word) {
        const historyItem = {
            word,
            timestamp: new Date().toISOString()
        };

        this.searchHistory.unshift(historyItem);
        this.saveHistory();
        this.displayHistory();
    }

    displayHistory() {
        this.searchHistory.innerHTML = this.searchHistory
            .slice(0, 10)
            .map(item => `
                <div class="history-item" data-word="${item.word}">
                    <div class="history-word">${item.word}</div>
                    <div class="history-timestamp">${new Date(item.timestamp).toLocaleString()}</div>
                </div>
            `)
            .join('');

        this.searchHistory.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', () => {
                this.searchInput.value = item.dataset.word;
                this.searchWord();
            });
        });
    }

    saveHistory() {
        localStorage.setItem('thesaurusHistory', JSON.stringify(this.searchHistory));
    }

    loadHistory() {
        const savedHistory = localStorage.getItem('thesaurusHistory');
        if (savedHistory) {
            this.searchHistory = JSON.parse(savedHistory);
            this.displayHistory();
        }
    }

    showLoading() {
        this.searchButton.disabled = true;
        this.searchButton.innerHTML = '<span class="loading"></span>検索中...';
    }

    hideLoading() {
        this.searchButton.disabled = false;
        this.searchButton.textContent = '検索';
    }
}

// アプリケーションの初期化
document.addEventListener('DOMContentLoaded', () => {
    new ThesaurusApp();
});
