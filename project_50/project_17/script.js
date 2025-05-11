class ClickCounter {
    constructor() {
        this.count = 0;
        this.history = JSON.parse(localStorage.getItem('clickHistory')) || [];

        // DOM要素
        this.countDisplay = document.querySelector('.count');
        this.clickButton = document.getElementById('clickButton');
        this.resetButton = document.getElementById('resetButton');
        this.historyList = document.getElementById('historyList');

        // イベントリスナー
        this.clickButton.addEventListener('click', () => this.increment());
        this.resetButton.addEventListener('click', () => this.reset());

        // 初期表示
        this.updateDisplay();
        this.renderHistory();
    }

    increment() {
        this.count++;
        this.updateDisplay();
        this.saveToHistory();
    }

    reset() {
        this.count = 0;
        this.updateDisplay();
    }

    updateDisplay() {
        this.countDisplay.textContent = this.count;
    }

    saveToHistory() {
        const historyItem = {
            count: this.count,
            date: new Date().toLocaleString()
        };
        this.history.unshift(historyItem);
        
        // 最大10件まで保存
        if (this.history.length > 10) {
            this.history.pop();
        }
        
        localStorage.setItem('clickHistory', JSON.stringify(this.history));
        this.renderHistory();
    }

    renderHistory() {
        this.historyList.innerHTML = '';
        this.history.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <span class="history-count">${item.count}回</span>
                <span class="history-date">${item.date}</span>
            `;
            this.historyList.appendChild(historyItem);
        });
    }
}

// クリックカウンターの初期化
const clickCounter = new ClickCounter();
