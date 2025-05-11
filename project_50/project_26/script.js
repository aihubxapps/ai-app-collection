class TarotApp {
    constructor() {
        this.cards = [
            {
                name: '愚者',
                image: 'https://picsum.photos/200/300?random=1',
                message: '新しい始まりの予感',
                meaning: '新しい挑戦や冒険の時期です。直感を信じて、一歩踏み出してみましょう。'
            },
            {
                name: '魔術師',
                image: 'https://picsum.photos/200/300?random=2',
                message: '創造力と可能性の開花',
                meaning: 'あなたの中に眠る才能が目覚めようとしています。積極的に行動することで、大きな成果が得られるでしょう。'
            },
            {
                name: '女教皇',
                image: 'https://picsum.photos/200/300?random=3',
                message: '直感と知恵の導き',
                meaning: '内なる声に耳を傾ける時です。直感を信じ、深い洞察を得ることができるでしょう。'
            },
            {
                name: '女帝',
                image: 'https://picsum.photos/200/300?random=4',
                message: '豊かさと母性の祝福',
                meaning: '物質的・精神的な豊かさが訪れます。創造性を活かし、実りある成果を生み出せるでしょう。'
            },
            {
                name: '皇帝',
                image: 'https://picsum.photos/200/300?random=5',
                message: 'リーダーシップと安定',
                meaning: '目標に向かって着実に進む時です。責任感を持って行動することで、成功を収められるでしょう。'
            }
        ];

        this.cardImage = document.querySelector('.card-image');
        this.cardMessage = document.querySelector('.card-message');
        this.cardMeaning = document.querySelector('.card-meaning');
        this.drawButton = document.getElementById('drawButton');

        this.drawButton.addEventListener('click', () => this.drawCard());
    }

    drawCard() {
        const randomIndex = Math.floor(Math.random() * this.cards.length);
        const card = this.cards[randomIndex];

        // カードを引くアニメーション
        this.cardImage.style.transform = 'rotateY(180deg)';
        setTimeout(() => {
            this.cardImage.style.backgroundImage = `url(${card.image})`;
            this.cardImage.style.transform = 'rotateY(0deg)';
        }, 500);

        // メッセージと意味を表示
        this.cardMessage.textContent = `${card.name}: ${card.message}`;
        this.cardMeaning.textContent = card.meaning;
    }
}

// タロットアプリの初期化
const tarotApp = new TarotApp();
