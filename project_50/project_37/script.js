class GeminiApp {
    constructor() {
        this.maxRetries = 3;
        this.retryDelay = 1000; // 1秒
        this.setupElements();
        this.setupEventListeners();
    }

    setupElements() {
        this.promptInput = document.getElementById('promptInput');
        this.submitButton = document.getElementById('submitButton');
        this.responseContent = document.getElementById('responseContent');
        this.errorContainer = document.getElementById('errorContainer');
        this.errorContent = document.getElementById('errorContent');
    }

    setupEventListeners() {
        this.submitButton.addEventListener('click', () => this.submitPrompt());
        this.promptInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.submitPrompt();
            }
        });
    }

    async submitPrompt() {
        const prompt = this.promptInput.value.trim();
        if (!prompt) return;

        this.showLoading();
        this.hideError();

        try {
            const response = await this.callGeminiAPI(prompt);
            this.displayResponse(response);
        } catch (error) {
            this.displayError(error.message);
        } finally {
            this.hideLoading();
        }
    }

    async callGeminiAPI(prompt, retryCount = 0) {
        // const API_KEY = process.env.GEMINI_API_KEY;
        const API_KEY = "";
        const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

        try {
            const response = await fetch(`${API_URL}?key=${API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                })
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }

            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            if (retryCount < this.maxRetries) {
                await new Promise(resolve => setTimeout(resolve, this.retryDelay));
                return this.callGeminiAPI(prompt, retryCount + 1);
            }
            throw error;
        }
    }

    displayResponse(response) {
        this.responseContent.textContent = response;
    }

    displayError(message) {
        this.errorContent.textContent = message;
        this.errorContainer.style.display = 'block';
    }

    hideError() {
        this.errorContainer.style.display = 'none';
    }

    showLoading() {
        this.submitButton.disabled = true;
        this.submitButton.innerHTML = '<span class="loading"></span>処理中...';
    }

    hideLoading() {
        this.submitButton.disabled = false;
        this.submitButton.textContent = '送信';
    }
}

// アプリケーションの初期化
document.addEventListener('DOMContentLoaded', () => {
    new GeminiApp();
});
