class NameGenerator {
    constructor() {
        this.genderSelect = document.getElementById('gender');
        this.genreSelect = document.getElementById('genre');
        this.generateButton = document.getElementById('generateButton');
        this.copyButton = document.getElementById('copyButton');
        this.favoriteButton = document.getElementById('favoriteButton');
        this.namesList = document.getElementById('namesList');
        this.favoritesList = document.getElementById('favoritesList');

        this.nameComponents = {
            male: {
                fantasy: {
                    first: ['アル', 'レオ', 'ガイ', 'シオン', 'ルカ'],
                    last: ['ドラゴン', 'フェニックス', 'グリフィン', 'ウィンド', 'フレイム']
                },
                modern: {
                    first: ['タクヤ', 'ユウキ', 'ハルト', 'ソウタ', 'ケンタ'],
                    last: ['サトウ', 'タナカ', 'スズキ', 'ヤマダ', 'ナカムラ']
                },
                scifi: {
                    first: ['ゼロ', 'ネオ', 'サイバー', 'クオン', 'レイ'],
                    last: ['プロト', 'メタル', 'バイオ', 'デジタル', 'マトリックス']
                },
                historical: {
                    first: ['ノブナガ', 'ヒデヨシ', 'イエヤス', 'ミツナリ', 'マサムネ'],
                    last: ['オダ', 'トヨトミ', 'トクガワ', 'モリ', 'ウエスギ']
                }
            },
            female: {
                fantasy: {
                    first: ['ルナ', 'セレナ', 'ミラ', 'エマ', 'リリ'],
                    last: ['ムーン', 'スター', 'クリスタル', 'ローズ', 'ドリーム']
                },
                modern: {
                    first: ['サクラ', 'ハナ', 'ユイ', 'ミドリ', 'アカネ'],
                    last: ['サトウ', 'タナカ', 'スズキ', 'ヤマダ', 'ナカムラ']
                },
                scifi: {
                    first: ['ルナ', 'ノア', 'エコ', 'サイバー', 'クオン'],
                    last: ['プロト', 'メタル', 'バイオ', 'デジタル', 'マトリックス']
                },
                historical: {
                    first: ['トモエ', 'マサコ', 'ヨシコ', 'ハナコ', 'ミドリ'],
                    last: ['オダ', 'トヨトミ', 'トクガワ', 'モリ', 'ウエスギ']
                }
            },
            neutral: {
                fantasy: {
                    first: ['レイン', 'スター', 'ウィンド', 'クリスタル', 'ドリーム'],
                    last: ['スピリット', 'エレメント', 'エコー', 'シャドウ', 'ライト']
                },
                modern: {
                    first: ['アキ', 'ハル', 'ナツ', 'フユ', 'アオ'],
                    last: ['サトウ', 'タナカ', 'スズキ', 'ヤマダ', 'ナカムラ']
                },
                scifi: {
                    first: ['ゼロ', 'ネオ', 'サイバー', 'クオン', 'レイ'],
                    last: ['プロト', 'メタル', 'バイオ', 'デジタル', 'マトリックス']
                },
                historical: {
                    first: ['ミチ', 'タダ', 'ヨシ', 'トモ', 'マサ'],
                    last: ['オダ', 'トヨトミ', 'トクガワ', 'モリ', 'ウエスギ']
                }
            }
        };

        this.favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        this.setupEventListeners();
        this.displayFavorites();
    }

    setupEventListeners() {
        this.generateButton.addEventListener('click', () => this.generateNames());
        this.copyButton.addEventListener('click', () => this.copyNames());
        this.favoriteButton.addEventListener('click', () => this.addToFavorites());
    }

    generateNames() {
        const gender = this.genderSelect.value;
        const genre = this.genreSelect.value;
        const components = this.nameComponents[gender][genre];

        this.namesList.innerHTML = '';
        for (let i = 0; i < 5; i++) {
            const firstName = this.getRandomElement(components.first);
            const lastName = this.getRandomElement(components.last);
            const name = `${firstName} ${lastName}`;

            const nameElement = document.createElement('div');
            nameElement.className = 'name-item';
            nameElement.textContent = name;
            nameElement.addEventListener('click', () => this.selectName(nameElement));
            this.namesList.appendChild(nameElement);
        }
    }

    getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    selectName(element) {
        const selected = this.namesList.querySelector('.selected');
        if (selected) {
            selected.classList.remove('selected');
        }
        element.classList.add('selected');
    }

    copyNames() {
        const selected = this.namesList.querySelector('.selected');
        if (!selected) {
            alert('コピーする名前を選択してください。');
            return;
        }

        navigator.clipboard.writeText(selected.textContent)
            .then(() => alert('名前をコピーしました！'))
            .catch(err => console.error('コピーに失敗しました:', err));
    }

    addToFavorites() {
        const selected = this.namesList.querySelector('.selected');
        if (!selected) {
            alert('お気に入りに追加する名前を選択してください。');
            return;
        }

        const name = selected.textContent;
        if (!this.favorites.includes(name)) {
            this.favorites.push(name);
            localStorage.setItem('favorites', JSON.stringify(this.favorites));
            this.displayFavorites();
        }
    }

    displayFavorites() {
        this.favoritesList.innerHTML = '';
        this.favorites.forEach(name => {
            const favoriteElement = document.createElement('div');
            favoriteElement.className = 'favorite-item';
            favoriteElement.textContent = name;

            const removeButton = document.createElement('button');
            removeButton.className = 'remove-favorite';
            removeButton.textContent = '×';
            removeButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.removeFavorite(name);
            });

            favoriteElement.appendChild(removeButton);
            this.favoritesList.appendChild(favoriteElement);
        });
    }

    removeFavorite(name) {
        this.favorites = this.favorites.filter(f => f !== name);
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
        this.displayFavorites();
    }
}

// アプリケーションの初期化
document.addEventListener('DOMContentLoaded', () => {
    new NameGenerator();
});
