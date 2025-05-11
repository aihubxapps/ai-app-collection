class ChatUI {
    constructor() {
        this.messages = [];
        this.setupElements();
        this.setupEventListeners();
        this.loadMessages();
    }

    setupElements() {
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.clearButton = document.getElementById('clearButton');
        this.chatMessages = document.getElementById('chatMessages');
    }

    setupEventListeners() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        this.clearButton.addEventListener('click', () => this.clearMessages());
    }

    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;

        // ユーザーメッセージを追加
        this.addMessage(message, 'user');
        this.messageInput.value = '';

        try {
            // OpenAI APIにリクエストを送信
            const response = await this.callOpenAI(message);
            this.addMessage(response, 'assistant');
        } catch (error) {
            console.error('Error:', error);
            this.addMessage('申し訳ありません。エラーが発生しました。', 'assistant');
        }
    }

    async callOpenAI(message) {
        const API_KEY = process.env.OPENAI_API_KEY;
        const API_URL = 'https://api.openai.com/v1/chat/completions';

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4.1-nano',
                messages: [
                    ...this.messages.map(msg => ({
                        role: msg.type === 'user' ? 'user' : 'assistant',
                        content: msg.content
                    })),
                    { role: 'user', content: message }
                ],
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error('API request failed');
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    addMessage(content, type) {
        const message = {
            content,
            type,
            timestamp: new Date().toISOString()
        };

        this.messages.push(message);
        this.saveMessages();
        this.displayMessage(message);
    }

    displayMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${message.type}`;
        
        const time = new Date(message.timestamp).toLocaleTimeString();
        
        messageElement.innerHTML = `
            <div class="message-content">${this.formatMessage(message.content)}</div>
            <div class="message-time">${time}</div>
        `;
        
        this.chatMessages.appendChild(messageElement);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    formatMessage(content) {
        // 改行を<br>タグに変換
        return content.replace(/\n/g, '<br>');
    }

    clearMessages() {
        this.messages = [];
        this.chatMessages.innerHTML = '';
        this.saveMessages();
    }

    saveMessages() {
        localStorage.setItem('chatMessages', JSON.stringify(this.messages));
    }

    loadMessages() {
        const savedMessages = localStorage.getItem('chatMessages');
        if (savedMessages) {
            this.messages = JSON.parse(savedMessages);
            this.messages.forEach(message => this.displayMessage(message));
        }
    }
}

// アプリケーションの初期化
document.addEventListener('DOMContentLoaded', () => {
    new ChatUI();
});
