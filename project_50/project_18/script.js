class TextTemplateGenerator {
    constructor() {
        this.keywordsInput = document.getElementById('keywords');
        this.generateButton = document.getElementById('generateButton');
        this.copyButton = document.getElementById('copyButton');
        this.output = document.getElementById('output');

        this.templates = [
            '【{keyword1}】についての{keyword2}を解説します。{keyword3}の観点から見ていきましょう。',
            '{keyword1}を活用した{keyword2}の方法をご紹介します。{keyword3}を意識することで効果が高まります。',
            '{keyword1}と{keyword2}の関係性について考察します。{keyword3}という視点から分析していきましょう。',
            '{keyword1}を実践するための{keyword2}のポイントを解説します。{keyword3}を意識することが重要です。',
            '{keyword1}について、{keyword2}の観点から{keyword3}を検証します。'
        ];

        this.generateButton.addEventListener('click', () => this.generate());
        this.copyButton.addEventListener('click', () => this.copyToClipboard());
    }

    generate() {
        const keywords = this.keywordsInput.value.split(',').map(k => k.trim()).filter(k => k);
        
        if (keywords.length < 3) {
            alert('キーワードを3つ以上入力してください。');
            return;
        }

        const template = this.templates[Math.floor(Math.random() * this.templates.length)];
        let result = template;

        for (let i = 0; i < keywords.length; i++) {
            result = result.replace(`{keyword${i + 1}}`, keywords[i]);
        }

        this.output.textContent = result;
    }

    copyToClipboard() {
        const text = this.output.textContent;
        if (!text) {
            alert('コピーするテキストがありません。');
            return;
        }

        navigator.clipboard.writeText(text).then(() => {
            alert('テキストをコピーしました！');
        }).catch(err => {
            console.error('コピーに失敗しました:', err);
            alert('コピーに失敗しました。');
        });
    }
}

// テンプレート生成ツールの初期化
const generator = new TextTemplateGenerator();
