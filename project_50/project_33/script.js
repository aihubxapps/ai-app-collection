class ProfileCardGenerator {
    constructor() {
        this.nameInput = document.getElementById('name');
        this.occupationInput = document.getElementById('occupation');
        this.hobbiesInput = document.getElementById('hobbies');
        this.cardPreview = document.getElementById('cardPreview');
        this.downloadButton = document.getElementById('downloadButton');
        this.shareButton = document.getElementById('shareButton');
        this.templateItems = document.querySelectorAll('.template-item');

        this.currentTemplate = 'modern';
        this.setupEventListeners();
    }

    setupEventListeners() {
        // 入力フィールドの変更を監視
        this.nameInput.addEventListener('input', () => this.updatePreview());
        this.occupationInput.addEventListener('input', () => this.updatePreview());
        this.hobbiesInput.addEventListener('input', () => this.updatePreview());

        // テンプレート選択
        this.templateItems.forEach(item => {
            item.addEventListener('click', () => {
                this.templateItems.forEach(t => t.classList.remove('selected'));
                item.classList.add('selected');
                this.currentTemplate = item.dataset.template;
                this.updatePreview();
            });
        });

        // デフォルトでモダンテンプレートを選択
        this.templateItems[0].classList.add('selected');

        // ボタンのイベントリスナー
        this.downloadButton.addEventListener('click', () => this.downloadCard());
        this.shareButton.addEventListener('click', () => this.shareCard());
    }

    updatePreview() {
        const name = this.nameInput.value.trim();
        const occupation = this.occupationInput.value.trim();
        const hobbies = this.hobbiesInput.value.trim().split('\n').filter(h => h.trim());

        // プレビューの更新
        this.cardPreview.className = `card-preview ${this.currentTemplate}`;
        this.cardPreview.querySelector('.name').textContent = name || 'あなたの名前';
        this.cardPreview.querySelector('.occupation').textContent = occupation || 'あなたの職業';
        this.cardPreview.querySelector('.hobbies').innerHTML = hobbies.length > 0
            ? hobbies.map(hobby => `<div>${hobby}</div>`).join('')
            : 'あなたの趣味';
    }

    async downloadCard() {
        try {
            const canvas = await html2canvas(this.cardPreview);
            const link = document.createElement('a');
            link.download = 'profile-card.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            console.error('画像の生成に失敗しました:', error);
            alert('画像の生成に失敗しました。もう一度お試しください。');
        }
    }

    async shareCard() {
        try {
            const canvas = await html2canvas(this.cardPreview);
            const blob = await new Promise(resolve => canvas.toBlob(resolve));
            const file = new File([blob], 'profile-card.png', { type: 'image/png' });

            if (navigator.share) {
                await navigator.share({
                    title: '自己紹介カード',
                    text: '私の自己紹介カードです！',
                    files: [file]
                });
            } else {
                // Web Share APIがサポートされていない場合
                const link = document.createElement('a');
                link.download = 'profile-card.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
            }
        } catch (error) {
            console.error('シェアに失敗しました:', error);
            alert('シェアに失敗しました。もう一度お試しください。');
        }
    }
}

// アプリケーションの初期化
document.addEventListener('DOMContentLoaded', () => {
    new ProfileCardGenerator();
});
