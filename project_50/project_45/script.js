class ImageViewer {
    constructor() {
        this.setupElements();
        this.setupEventListeners();
        this.images = [];
        this.tags = new Set();
    }

    setupElements() {
        this.imageUpload = document.getElementById('imageUpload');
        this.uploadButton = document.getElementById('uploadButton');
        this.tagFilter = document.getElementById('tagFilter');
        this.tagList = document.getElementById('tagList');
        this.gallery = document.getElementById('gallery');
        this.modal = document.getElementById('imageModal');
        this.modalImage = document.getElementById('modalImage');
        this.modalTags = document.getElementById('modalTags');
        this.closeButton = document.querySelector('.close-button');
    }

    setupEventListeners() {
        this.uploadButton.addEventListener('click', () => this.imageUpload.click());
        this.imageUpload.addEventListener('change', (e) => this.handleImageUpload(e));
        this.tagFilter.addEventListener('input', () => this.filterImages());
        this.closeButton.addEventListener('click', () => this.closeModal());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });
    }

    handleImageUpload(event) {
        const files = event.target.files;
        for (const file of files) {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const image = {
                        id: Date.now() + Math.random(),
                        src: e.target.result,
                        tags: this.generateTags()
                    };
                    this.images.push(image);
                    this.updateGallery();
                    this.updateTags();
                };
                reader.readAsDataURL(file);
            }
        }
    }

    generateTags() {
        const allTags = ['AI', '美女', 'ポートレート', 'アート', 'デジタル', 'ファンタジー', 'リアル', 'アニメ', '3D'];
        const numTags = Math.floor(Math.random() * 3) + 1;
        const tags = [];
        for (let i = 0; i < numTags; i++) {
            const randomTag = allTags[Math.floor(Math.random() * allTags.length)];
            if (!tags.includes(randomTag)) {
                tags.push(randomTag);
                this.tags.add(randomTag);
            }
        }
        return tags;
    }

    updateGallery() {
        this.gallery.innerHTML = this.images
            .map(image => `
                <div class="image-card" data-id="${image.id}">
                    <img src="${image.src}" alt="AI美女画像">
                    <div class="image-info">
                        <div class="image-tags">
                            ${image.tags.map(tag => `<span class="image-tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                </div>
            `)
            .join('');

        this.gallery.querySelectorAll('.image-card').forEach(card => {
            card.addEventListener('click', () => this.openModal(card.dataset.id));
        });
    }

    updateTags() {
        this.tagList.innerHTML = Array.from(this.tags)
            .map(tag => `<span class="tag" data-tag="${tag}">${tag}</span>`)
            .join('');

        this.tagList.querySelectorAll('.tag').forEach(tag => {
            tag.addEventListener('click', () => {
                tag.classList.toggle('active');
                this.filterImages();
            });
        });
    }

    filterImages() {
        const searchTerm = this.tagFilter.value.toLowerCase();
        const activeTags = Array.from(this.tagList.querySelectorAll('.tag.active'))
            .map(tag => tag.dataset.tag);

        this.gallery.querySelectorAll('.image-card').forEach(card => {
            const image = this.images.find(img => img.id === card.dataset.id);
            const matchesSearch = image.tags.some(tag => tag.toLowerCase().includes(searchTerm));
            const matchesTags = activeTags.length === 0 || activeTags.some(tag => image.tags.includes(tag));
            card.style.display = matchesSearch && matchesTags ? 'block' : 'none';
        });
    }

    openModal(imageId) {
        const image = this.images.find(img => img.id === imageId);
        if (image) {
            this.modalImage.src = image.src;
            this.modalTags.innerHTML = image.tags
                .map(tag => `<span class="image-tag">${tag}</span>`)
                .join('');
            this.modal.classList.add('active');
        }
    }

    closeModal() {
        this.modal.classList.remove('active');
    }
}

// アプリケーションの初期化
document.addEventListener('DOMContentLoaded', () => {
    new ImageViewer();
});
