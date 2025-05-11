class SuggestSearch {
    constructor() {
        this.setupElements();
        this.setupEventListeners();
        this.debounceTimer = null;
        this.sampleData = [
            'JavaScript',
            'Python',
            'Java',
            'C++',
            'Ruby',
            'PHP',
            'Swift',
            'Kotlin',
            'TypeScript',
            'Go',
            'Rust',
            'C#',
            'Scala',
            'Perl',
            'Haskell'
        ];
    }

    setupElements() {
        this.searchInput = document.getElementById('searchInput');
        this.searchButton = document.getElementById('searchButton');
        this.suggestions = document.getElementById('suggestions');
        this.searchResults = document.getElementById('searchResults');
    }

    setupEventListeners() {
        this.searchInput.addEventListener('input', () => this.handleInput());
        this.searchInput.addEventListener('focus', () => this.showSuggestions());
        this.searchInput.addEventListener('blur', () => {
            setTimeout(() => this.hideSuggestions(), 200);
        });
        this.searchButton.addEventListener('click', () => this.search());
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.search();
            }
        });
    }

    handleInput() {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            const query = this.searchInput.value.trim();
            if (query) {
                this.showSuggestions();
                this.updateSuggestions(query);
            } else {
                this.hideSuggestions();
            }
        }, 300);
    }

    updateSuggestions(query) {
        const filteredSuggestions = this.sampleData.filter(item =>
            item.toLowerCase().includes(query.toLowerCase())
        );

        if (filteredSuggestions.length > 0) {
            this.suggestions.innerHTML = filteredSuggestions
                .map(suggestion => {
                    const highlightedSuggestion = this.highlightMatch(suggestion, query);
                    return `
                        <div class="suggestion-item" data-suggestion="${suggestion}">
                            ${highlightedSuggestion}
                        </div>
                    `;
                })
                .join('');

            this.suggestions.querySelectorAll('.suggestion-item').forEach(item => {
                item.addEventListener('click', () => {
                    this.searchInput.value = item.dataset.suggestion;
                    this.search();
                    this.hideSuggestions();
                });
            });
        } else {
            this.hideSuggestions();
        }
    }

    highlightMatch(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    }

    showSuggestions() {
        this.suggestions.classList.add('active');
    }

    hideSuggestions() {
        this.suggestions.classList.remove('active');
    }

    search() {
        const query = this.searchInput.value.trim();
        if (!query) return;

        this.showLoading();

        // サンプルデータを使用して検索結果を表示
        setTimeout(() => {
            const results = this.sampleData
                .filter(item => item.toLowerCase().includes(query.toLowerCase()))
                .map(item => ({
                    title: item,
                    description: `${item}に関する情報を表示します。`
                }));

            this.displayResults(results);
            this.hideLoading();
        }, 500);
    }

    displayResults(results) {
        if (results.length === 0) {
            this.searchResults.innerHTML = '<div class="no-results">検索結果が見つかりませんでした。</div>';
            return;
        }

        this.searchResults.innerHTML = results
            .map(result => `
                <div class="result-card">
                    <div class="result-title">${result.title}</div>
                    <div class="result-description">${result.description}</div>
                </div>
            `)
            .join('');
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
    new SuggestSearch();
});
