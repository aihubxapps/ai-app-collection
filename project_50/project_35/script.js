class RandomExpressionGenerator {
    constructor() {
        this.expressions = [
            {
                image: 'https://source.unsplash.com/random/800x600/?happy',
                description: '幸せな表情'
            },
            {
                image: 'https://source.unsplash.com/random/800x600/?sad',
                description: '悲しい表情'
            },
            {
                image: 'https://source.unsplash.com/random/800x600/?angry',
                description: '怒った表情'
            },
            {
                image: 'https://source.unsplash.com/random/800x600/?surprised',
                description: '驚いた表情'
            },
            {
                image: 'https://source.unsplash.com/random/800x600/?confused',
                description: '困惑した表情'
            }
        ];
        
        this.favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        this.currentExpression = null;
        
        this.setupElements();
        this.setupEventListeners();
        this.displayFavorites();
    }
    
    setupElements() {
        this.imageDisplay = document.querySelector('.image-display');
        this.imageDescription = document.querySelector('.image-description');
        this.generateButton = document.getElementById('generateButton');
        this.favoriteButton = document.getElementById('favoriteButton');
        this.favoritesList = document.querySelector('.favorites-list');
    }
    
    setupEventListeners() {
        this.generateButton.addEventListener('click', () => this.generateExpression());
        this.favoriteButton.addEventListener('click', () => this.addToFavorites());
    }
    
    generateExpression() {
        const randomIndex = Math.floor(Math.random() * this.expressions.length);
        this.currentExpression = this.expressions[randomIndex];
        
        this.imageDisplay.innerHTML = `<img src="${this.currentExpression.image}" alt="${this.currentExpression.description}">`;
        this.imageDescription.textContent = this.currentExpression.description;
    }
    
    addToFavorites() {
        if (!this.currentExpression) return;
        
        if (!this.favorites.some(fav => fav.image === this.currentExpression.image)) {
            this.favorites.push(this.currentExpression);
            localStorage.setItem('favorites', JSON.stringify(this.favorites));
            this.displayFavorites();
        }
    }
    
    displayFavorites() {
        this.favoritesList.innerHTML = this.favorites.map((favorite, index) => `
            <div class="favorite-item">
                <img src="${favorite.image}" alt="${favorite.description}" class="favorite-image">
                <div class="favorite-description">${favorite.description}</div>
                <button class="remove-favorite" data-index="${index}">×</button>
            </div>
        `).join('');
        
        this.favoritesList.querySelectorAll('.remove-favorite').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.favorites.splice(index, 1);
                localStorage.setItem('favorites', JSON.stringify(this.favorites));
                this.displayFavorites();
            });
        });
    }
}

// アプリケーションの初期化
document.addEventListener('DOMContentLoaded', () => {
    new RandomExpressionGenerator();
});
