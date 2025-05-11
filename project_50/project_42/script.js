class TranslationApp {
    constructor() {
        this.setupElements();
        this.setupEventListeners();
        this.translationHistory = [];
        this.loadHistory();
    }

    setupElements() {
        this.sourceLanguage = document.getElementById('sourceLanguage');
        this.targetLanguage = document.getElementById('targetLanguage');
        this.swapButton = document.getElementById('swapButton');
        this.sourceText = document.getElementById('sourceText');
        this.translateButton = document.getElementById('translateButton');
        this.translatedText = document.getElementById('translatedText');
        this.translationHistory = document.getElementById('translationHistory');
    }

    setupEventListeners() {
        this.swapButton.addEventListener('click', () => this.swapLanguages());
        this.translateButton.addEventListener('click', () => this.translate());
        this.sourceText.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                this.translate();
            }
        });
    }

    async translate() {
        const text = this.sourceText.value.trim();
        if (!text) return;

        this.showLoading();

        try {
            const API_KEY = process.env.OPENAI_API_KEY;
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [{
                        role: 'system',
                        content: `You are a translator. Translate the following text from ${this.sourceLanguage.value} to ${this.targetLanguage.value}. Only return the translated text without any explanations or additional content.`
                    }, {
                        role: 'user',
                        content: text
                    }]
                })
            });

            if (!response.ok) {
                throw new Error('翻訳に失敗しました');
            }

            const data = await response.json();
            const translatedText = data.choices[0].message.content.trim();
            
            this.translatedText.textContent = translatedText;
            this.addToHistory(text, translatedText);
        } catch (error) {
            this.translatedText.textContent = `エラー: ${error.message}`;
        } finally {
            this.hideLoading();
        }
    }

    swapLanguages() {
        const temp = this.sourceLanguage.value;
        this.sourceLanguage.value = this.targetLanguage.value;
        this.targetLanguage.value = temp;
    }

    addToHistory(source, target) {
        const historyItem = {
            source,
            target,
            timestamp: new Date().toISOString()
        };

        this.translationHistory.unshift(historyItem);
        this.saveHistory();
        this.displayHistory();
    }

    displayHistory() {
        this.translationHistory.innerHTML = this.translationHistory
            .slice(0, 10)
            .map(item => `
                <div class="history-item" data-source="${item.source}" data-target="${item.target}">
                    <div class="source">${item.source}</div>
                    <div class="target">${item.target}</div>
                </div>
            `)
            .join('');

        this.translationHistory.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', () => {
                this.sourceText.value = item.dataset.source;
                this.translatedText.textContent = item.dataset.target;
            });
        });
    }

    saveHistory() {
        localStorage.setItem('translationHistory', JSON.stringify(this.translationHistory));
    }

    loadHistory() {
        const savedHistory = localStorage.getItem('translationHistory');
        if (savedHistory) {
            this.translationHistory = JSON.parse(savedHistory);
            this.displayHistory();
        }
    }

    showLoading() {
        this.translateButton.disabled = true;
        this.translateButton.innerHTML = '<span class="loading"></span>翻訳中...';
    }

    hideLoading() {
        this.translateButton.disabled = false;
        this.translateButton.textContent = '翻訳';
    }
}

// アプリケーションの初期化
document.addEventListener('DOMContentLoaded', () => {
    new TranslationApp();
});
