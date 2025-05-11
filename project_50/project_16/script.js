class ImageManager {
    constructor() {
        this.images = JSON.parse(localStorage.getItem('images')) || [];
        this.imageInput = document.getElementById('imageInput');
        this.uploadButton = document.getElementById('uploadButton');
        this.imagesGrid = document.getElementById('imagesGrid');

        // イベントリスナー
        this.uploadButton.addEventListener('click', () => this.imageInput.click());
        this.imageInput.addEventListener('change', (e) => this.handleImageUpload(e));

        // 初期表示
        this.renderImages();
    }

    handleImageUpload(event) {
        const files = event.target.files;
        for (let file of files) {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const image = {
                        id: Date.now() + Math.random(),
                        data: e.target.result,
                        memo: '',
                        date: new Date().toLocaleString()
                    };
                    this.images.push(image);
                    this.saveImages();
                    this.renderImages();
                };
                reader.readAsDataURL(file);
            }
        }
    }

    saveImageMemo(id, memo) {
        const image = this.images.find(img => img.id === id);
        if (image) {
            image.memo = memo;
            this.saveImages();
        }
    }

    deleteImage(id) {
        this.images = this.images.filter(img => img.id !== id);
        this.saveImages();
        this.renderImages();
    }

    saveImages() {
        localStorage.setItem('images', JSON.stringify(this.images));
    }

    renderImages() {
        this.imagesGrid.innerHTML = '';
        this.images.forEach(image => {
            const card = document.createElement('div');
            card.className = 'image-card';
            card.innerHTML = `
                <div class="image-container">
                    <img src="${image.data}" alt="アップロードされた画像">
                </div>
                <div class="image-info">
                    <div class="image-date">${image.date}</div>
                    <textarea class="image-memo" placeholder="メモを入力...">${image.memo}</textarea>
                    <div class="image-actions">
                        <button class="save-button" onclick="imageManager.saveImageMemo('${image.id}', this.previousElementSibling.value)">保存</button>
                        <button class="delete-button" onclick="imageManager.deleteImage('${image.id}')">削除</button>
                    </div>
                </div>
            `;
            this.imagesGrid.appendChild(card);
        });
    }
}

// 画像管理の初期化
const imageManager = new ImageManager();
