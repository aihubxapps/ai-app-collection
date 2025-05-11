class PoemGenerator {
    constructor() {
        this.themeInput = document.getElementById('themeInput');
        this.generateButton = document.getElementById('generateButton');
        this.copyButton = document.getElementById('copyButton');
        this.poemOutput = document.getElementById('poemOutput');

        this.phrases = {
            nature: [
                '春の風に乗って',
                '夏の陽射しの中で',
                '秋の紅葉に染まり',
                '冬の静けさに包まれ'
            ],
            emotion: [
                '心が揺れ動く',
                '胸が高鳴る',
                '想いが溢れる',
                '魂が震える'
            ],
            time: [
                '朝もやの中',
                '夕暮れの空に',
                '夜明けの光に',
                '星空の下で'
            ],
            action: [
                '歩みを進める',
                '翼を広げる',
                '夢を追いかける',
                '希望を抱く'
            ]
        };

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.generateButton.addEventListener('click', () => this.generatePoem());
        this.copyButton.addEventListener('click', () => this.copyPoem());
    }

    generatePoem() {
        const theme = this.themeInput.value.trim();
        if (!theme) {
            alert('テーマキーワードを入力してください。');
            return;
        }

        const poem = this.createPoem(theme);
        this.poemOutput.textContent = poem;
    }

    createPoem(theme) {
        const lines = [];
        const categories = Object.keys(this.phrases);
        
        // 4行の詩を生成
        for (let i = 0; i < 4; i++) {
            const category = categories[Math.floor(Math.random() * categories.length)];
            const phrases = this.phrases[category];
            const phrase = phrases[Math.floor(Math.random() * phrases.length)];
            
            // テーマキーワードを時々挿入
            if (Math.random() < 0.3) {
                lines.push(`${phrase}、${theme}`);
            } else {
                lines.push(phrase);
            }
        }

        return lines.join('\n');
    }

    copyPoem() {
        const poem = this.poemOutput.textContent;
        if (!poem) {
            alert('詩を生成してください。');
            return;
        }

        navigator.clipboard.writeText(poem).then(() => {
            alert('詩をコピーしました！');
        }).catch(err => {
            console.error('コピーに失敗しました:', err);
            alert('コピーに失敗しました。');
        });
    }
}

// 詩ジェネレーターの初期化
const poemGenerator = new PoemGenerator();
