class NewsSummarizer {
    constructor() {
        this.setupElements();
        this.setupEventListeners();
    }

    setupElements() {
        this.rssUrlInput = document.getElementById('rssUrlInput');
        this.fetchButton = document.getElementById('fetchButton');
        this.newsList = document.getElementById('newsList');
        this.summaryModal = document.getElementById('summaryModal');
        this.summaryContent = document.getElementById('summaryContent');
        this.closeModal = document.getElementById('closeModal');
    }

    setupEventListeners() {
        this.fetchButton.addEventListener('click', () => this.fetchNews());
        this.closeModal.addEventListener('click', () => this.hideModal());
        window.addEventListener('click', (e) => {
            if (e.target === this.summaryModal) {
                this.hideModal();
            }
        });
    }

    async fetchNews() {
        const url = this.rssUrlInput.value.trim();
        if (!url) return;

        this.showLoading();
        this.newsList.innerHTML = '';

        try {
            const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`);
            if (!response.ok) {
                throw new Error('RSSフィードの取得に失敗しました');
            }

            const data = await response.json();
            this.displayNews(data.items);
        } catch (error) {
            this.newsList.innerHTML = `<div class="error">エラー: ${error.message}</div>`;
        } finally {
            this.hideLoading();
        }
    }

    displayNews(items) {
        this.newsList.innerHTML = items.map(item => `
            <div class="news-item" data-url="${item.link}">
                <div class="news-title">${item.title}</div>
                <div class="news-date">${new Date(item.pubDate).toLocaleDateString()}</div>
            </div>
        `).join('');

        this.newsList.querySelectorAll('.news-item').forEach(item => {
            item.addEventListener('click', () => this.summarizeArticle(item.dataset.url));
        });
    }

    async summarizeArticle(url) {
        this.showLoading();
        this.showModal();

        try {
            const API_KEY = process.env.OPENAI_API_KEY;
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    model: 'gpt-4.1-nano',
                    messages: [{
                        role: 'user',
                        content: `以下のURLの記事を要約してください: ${url}`
                    }],
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                throw new Error('要約の生成に失敗しました');
            }

            const data = await response.json();
            this.summaryContent.textContent = data.choices[0].message.content;
        } catch (error) {
            this.summaryContent.textContent = `エラー: ${error.message}`;
        } finally {
            this.hideLoading();
        }
    }

    showModal() {
        this.summaryModal.style.display = 'block';
    }

    hideModal() {
        this.summaryModal.style.display = 'none';
    }

    showLoading() {
        this.fetchButton.disabled = true;
        this.fetchButton.innerHTML = '<span class="loading"></span>処理中...';
    }

    hideLoading() {
        this.fetchButton.disabled = false;
        this.fetchButton.textContent = '取得';
    }
}

// アプリケーションの初期化
document.addEventListener('DOMContentLoaded', () => {
    new NewsSummarizer();
});
