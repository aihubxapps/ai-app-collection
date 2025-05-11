class MusicGenreAnalyzer {
    constructor() {
        this.setupElements();
        this.setupEventListeners();
        this.chart = null;
    }

    setupElements() {
        this.searchInput = document.getElementById('searchInput');
        this.searchButton = document.getElementById('searchButton');
        this.searchResults = document.getElementById('searchResults');
        this.genreAnalysis = document.getElementById('genreAnalysis');
        this.recommendationsList = document.getElementById('recommendationsList');
    }

    setupEventListeners() {
        this.searchButton.addEventListener('click', () => this.searchTracks());
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchTracks();
            }
        });
    }

    async searchTracks() {
        const query = this.searchInput.value.trim();
        if (!query) return;

        this.showLoading();

        try {
            const API_KEY = process.env.SPOTIFY_API_KEY;
            const response = await fetch(
                `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=5`,
                {
                    headers: {
                        'Authorization': `Bearer ${API_KEY}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error('曲の検索に失敗しました');
            }

            const data = await response.json();
            this.displaySearchResults(data.tracks.items);
        } catch (error) {
            this.searchResults.innerHTML = `<div class="error">エラー: ${error.message}</div>`;
        } finally {
            this.hideLoading();
        }
    }

    displaySearchResults(tracks) {
        this.searchResults.innerHTML = tracks.map(track => `
            <div class="track-card" data-id="${track.id}">
                <img src="${track.album.images[2]?.url || ''}" alt="${track.name}" class="track-image">
                <div class="track-info">
                    <div class="track-name">${track.name}</div>
                    <div class="track-artist">${track.artists.map(artist => artist.name).join(', ')}</div>
                </div>
            </div>
        `).join('');

        this.searchResults.querySelectorAll('.track-card').forEach(card => {
            card.addEventListener('click', () => this.analyzeTrack(card.dataset.id));
        });
    }

    async analyzeTrack(trackId) {
        this.showLoading();

        try {
            const API_KEY = process.env.SPOTIFY_API_KEY;
            const [audioFeatures, recommendations] = await Promise.all([
                fetch(`https://api.spotify.com/v1/audio-features/${trackId}`, {
                    headers: {
                        'Authorization': `Bearer ${API_KEY}`
                    }
                }).then(res => res.json()),
                fetch(`https://api.spotify.com/v1/recommendations?seed_tracks=${trackId}&limit=5`, {
                    headers: {
                        'Authorization': `Bearer ${API_KEY}`
                    }
                }).then(res => res.json())
            ]);

            this.displayGenreAnalysis(audioFeatures);
            this.displayRecommendations(recommendations.tracks);
            this.genreAnalysis.style.display = 'block';
        } catch (error) {
            console.error('Error:', error);
        } finally {
            this.hideLoading();
        }
    }

    displayGenreAnalysis(features) {
        const ctx = document.getElementById('genreChart').getContext('2d');
        
        if (this.chart) {
            this.chart.destroy();
        }

        this.chart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['ダンス性', 'エネルギー', 'インストゥルメンタル', 'ライブ感', '音圧', 'テンポ', 'ポジティブ度'],
                datasets: [{
                    label: '音楽的特徴',
                    data: [
                        features.danceability * 100,
                        features.energy * 100,
                        features.instrumentalness * 100,
                        features.liveness * 100,
                        features.loudness + 60,
                        features.tempo / 2,
                        features.valence * 100
                    ],
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    borderColor: 'rgba(52, 152, 219, 1)',
                    pointBackgroundColor: 'rgba(52, 152, 219, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(52, 152, 219, 1)'
                }]
            },
            options: {
                scales: {
                    r: {
                        angleLines: {
                            display: true
                        },
                        suggestedMin: 0,
                        suggestedMax: 100
                    }
                }
            }
        });
    }

    displayRecommendations(tracks) {
        this.recommendationsList.innerHTML = tracks.map(track => `
            <div class="recommendation-item">
                <img src="${track.album.images[2]?.url || ''}" alt="${track.name}" class="recommendation-image">
                <div class="recommendation-info">
                    <div class="recommendation-name">${track.name}</div>
                    <div class="recommendation-artist">${track.artists.map(artist => artist.name).join(', ')}</div>
                </div>
            </div>
        `).join('');
    }

    showLoading() {
        this.searchButton.disabled = true;
        this.searchButton.innerHTML = '<span class="loading"></span>検索中...';
    }

    hideLoading() {
        this.searchButton.disabled = false;
        this.searchButton.textContent = '検索';
    }
}

// アプリケーションの初期化
document.addEventListener('DOMContentLoaded', () => {
    new MusicGenreAnalyzer();
});
