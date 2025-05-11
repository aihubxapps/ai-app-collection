class QuoteGenerator {
    constructor() {
        this.setupElements();
        this.setupEventListeners();
        this.quotes = [
            {
                text: "人生は、あなたが出会う人々によって形作られる。",
                author: "マーガレット・ミード"
            },
            {
                text: "成功とは、失敗を重ねても情熱を失わない能力のことだ。",
                author: "ウィンストン・チャーチル"
            },
            {
                text: "今日できることを明日に延ばすな。",
                author: "ベンジャミン・フランクリン"
            },
            {
                text: "夢は、目を閉じても見えるもの。",
                author: "ウォルト・ディズニー"
            },
            {
                text: "人生は、あなたが作るもの。",
                author: "エレノア・ルーズベルト"
            }
        ];
        this.customQuotes = [];
        this.loadCustomQuotes();
        this.showTodayQuote();
    }

    setupElements() {
        this.quoteText = document.getElementById('quoteText');
        this.quoteAuthor = document.getElementById('quoteAuthor');
        this.randomButton = document.getElementById('randomButton');
        this.todayButton = document.getElementById('todayButton');
        this.customQuote = document.getElementById('customQuote');
        this.customAuthor = document.getElementById('customAuthor');
        this.addButton = document.getElementById('addButton');
        this.customQuotes = document.getElementById('customQuotes');
        this.shareButton = document.getElementById('shareButton');
    }

    setupEventListeners() {
        this.randomButton.addEventListener('click', () => this.showRandomQuote());
        this.todayButton.addEventListener('click', () => this.showTodayQuote());
        this.addButton.addEventListener('click', () => this.addCustomQuote());
        this.shareButton.addEventListener('click', () => this.shareQuote());
    }

    showRandomQuote() {
        const allQuotes = [...this.quotes, ...this.customQuotes];
        const randomIndex = Math.floor(Math.random() * allQuotes.length);
        this.displayQuote(allQuotes[randomIndex]);
    }

    showTodayQuote() {
        const allQuotes = [...this.quotes, ...this.customQuotes];
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        const quoteIndex = dayOfYear % allQuotes.length;
        this.displayQuote(allQuotes[quoteIndex]);
    }

    displayQuote(quote) {
        this.quoteText.textContent = `"${quote.text}"`;
        this.quoteAuthor.textContent = `- ${quote.author}`;
    }

    addCustomQuote() {
        const text = this.customQuote.value.trim();
        const author = this.customAuthor.value.trim();

        if (text && author) {
            const newQuote = { text, author };
            this.customQuotes.push(newQuote);
            this.saveCustomQuotes();
            this.displayCustomQuotes();
            this.customQuote.value = '';
            this.customAuthor.value = '';
        }
    }

    displayCustomQuotes() {
        this.customQuotes.innerHTML = this.customQuotes
            .map((quote, index) => `
                <div class="custom-quote-item">
                    <div class="custom-quote-text">"${quote.text}"</div>
                    <div class="custom-quote-author">- ${quote.author}</div>
                    <button class="delete-button" data-index="${index}">削除</button>
                </div>
            `)
            .join('');

        this.customQuotes.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', () => {
                const index = parseInt(button.dataset.index);
                this.customQuotes.splice(index, 1);
                this.saveCustomQuotes();
                this.displayCustomQuotes();
            });
        });
    }

    saveCustomQuotes() {
        localStorage.setItem('customQuotes', JSON.stringify(this.customQuotes));
    }

    loadCustomQuotes() {
        const savedQuotes = localStorage.getItem('customQuotes');
        if (savedQuotes) {
            this.customQuotes = JSON.parse(savedQuotes);
            this.displayCustomQuotes();
        }
    }

    shareQuote() {
        const text = this.quoteText.textContent;
        const author = this.quoteAuthor.textContent;
        const shareText = `${text}\n${author}\n\n#日替わり名言ジェネレーター`;

        if (navigator.share) {
            navigator.share({
                title: '日替わり名言',
                text: shareText
            }).catch(console.error);
        } else {
            // クリップボードにコピー
            navigator.clipboard.writeText(shareText)
                .then(() => alert('名言をクリップボードにコピーしました！'))
                .catch(console.error);
        }
    }
}

// アプリケーションの初期化
document.addEventListener('DOMContentLoaded', () => {
    new QuoteGenerator();
});
