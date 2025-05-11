class QRCodeGenerator {
    constructor() {
        this.qrInput = document.getElementById('qrInput');
        this.generateButton = document.getElementById('generateButton');
        this.downloadButton = document.getElementById('downloadButton');
        this.qrcodeContainer = document.getElementById('qrcode');
        this.qrcode = null;

        this.generateButton.addEventListener('click', () => this.generateQRCode());
        this.downloadButton.addEventListener('click', () => this.downloadQRCode());
        this.qrInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.generateQRCode();
        });
    }

    generateQRCode() {
        const text = this.qrInput.value.trim();
        if (!text) {
            alert('テキストを入力してください。');
            return;
        }

        // 既存のQRコードをクリア
        this.qrcodeContainer.innerHTML = '';
        this.downloadButton.style.display = 'none';

        // 新しいQRコードを生成
        this.qrcode = new QRCode(this.qrcodeContainer, {
            text: text,
            width: 200,
            height: 200,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });

        this.downloadButton.style.display = 'inline-block';
    }

    downloadQRCode() {
        const canvas = this.qrcodeContainer.querySelector('canvas');
        if (!canvas) return;

        const link = document.createElement('a');
        link.download = 'qrcode.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    }
}

// QRコード生成アプリの初期化
const qrGenerator = new QRCodeGenerator(); 