class GitHubSearch {
    constructor() {
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.setupElements();
        this.setupEventListeners();
    }

    setupElements() {
        this.searchInput = document.getElementById('searchInput');
        this.sortSelect = document.getElementById('sortSelect');
        this.orderSelect = document.getElementById('orderSelect');
        this.searchButton = document.getElementById('searchButton');
        this.resultsList = document.getElementById('resultsList');
        this.pagination = document.getElementById('pagination');
    }

    setupEventListeners() {
        this.searchButton.addEventListener('click', () => this.searchRepositories());
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchRepositories();
            }
        });
        this.sortSelect.addEventListener('change', () => this.searchRepositories());
        this.orderSelect.addEventListener('change', () => this.searchRepositories());
    }

    async searchRepositories() {
        const query = this.searchInput.value.trim();
        if (!query) return;

        this.showLoading();
        this.currentPage = 1;

        try {
            const API_KEY = process.env.GITHUB_API_KEY;
            const response = await fetch(
                `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=${this.sortSelect.value}&order=${this.orderSelect.value}&page=${this.currentPage}&per_page=${this.itemsPerPage}`,
                {
                    headers: {
                        'Accept': 'application/vnd.github.v3+json',
                        'Authorization': `token ${API_KEY}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error('リポジトリの検索に失敗しました');
            }

            const data = await response.json();
            this.displayResults(data);
        } catch (error) {
            this.resultsList.innerHTML = `<div class="error">エラー: ${error.message}</div>`;
            this.pagination.innerHTML = '';
        } finally {
            this.hideLoading();
        }
    }

    displayResults(data) {
        if (data.items.length === 0) {
            this.resultsList.innerHTML = '<div class="no-results">検索結果が見つかりませんでした。</div>';
            this.pagination.innerHTML = '';
            return;
        }

        this.resultsList.innerHTML = data.items.map(repo => `
            <div class="repo-card">
                <div class="repo-header">
                    <a href="${repo.html_url}" class="repo-name" target="_blank">${repo.full_name}</a>
                    <div class="repo-stats">
                        <span>⭐ ${repo.stargazers_count.toLocaleString()}</span>
                        <span>🍴 ${repo.forks_count.toLocaleString()}</span>
                    </div>
                </div>
                <div class="repo-description">${repo.description || '説明なし'}</div>
                <div class="repo-meta">
                    <span>言語: ${repo.language || '不明'}</span>
                    <span>最終更新: ${new Date(repo.updated_at).toLocaleDateString()}</span>
                </div>
            </div>
        `).join('');

        this.displayPagination(data.total_count);
    }

    displayPagination(totalCount) {
        const totalPages = Math.ceil(totalCount / this.itemsPerPage);
        const maxPages = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxPages / 2));
        let endPage = Math.min(totalPages, startPage + maxPages - 1);

        if (endPage - startPage + 1 < maxPages) {
            startPage = Math.max(1, endPage - maxPages + 1);
        }

        let paginationHTML = '';

        if (this.currentPage > 1) {
            paginationHTML += `<button onclick="githubSearch.goToPage(${this.currentPage - 1})">前へ</button>`;
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <button class="${i === this.currentPage ? 'active' : ''}" 
                        onclick="githubSearch.goToPage(${i})">${i}</button>
            `;
        }

        if (this.currentPage < totalPages) {
            paginationHTML += `<button onclick="githubSearch.goToPage(${this.currentPage + 1})">次へ</button>`;
        }

        this.pagination.innerHTML = paginationHTML;
    }

    async goToPage(page) {
        this.currentPage = page;
        await this.searchRepositories();
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
let githubSearch;
document.addEventListener('DOMContentLoaded', () => {
    githubSearch = new GitHubSearch();
});
