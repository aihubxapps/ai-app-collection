class HoroscopeVisualizer {
    constructor() {
        this.canvas = document.getElementById('horoscopeCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.birthDateInput = document.getElementById('birthDate');
        this.calculateButton = document.getElementById('calculateButton');
        this.planetPositions = document.querySelector('.planet-positions');

        this.planets = [
            { name: '太陽', symbol: '☉', color: '#FFD700' },
            { name: '月', symbol: '☽', color: '#C0C0C0' },
            { name: '水星', symbol: '☿', color: '#A9A9A9' },
            { name: '金星', symbol: '♀', color: '#FFA07A' },
            { name: '火星', symbol: '♂', color: '#FF4500' },
            { name: '木星', symbol: '♃', color: '#DEB887' },
            { name: '土星', symbol: '♄', color: '#DAA520' }
        ];

        this.setupCanvas();
        this.setupEventListeners();
    }

    setupCanvas() {
        this.canvas.width = 600;
        this.canvas.height = 600;
    }

    setupEventListeners() {
        this.calculateButton.addEventListener('click', () => this.calculateHoroscope());
    }

    calculateHoroscope() {
        const birthDate = new Date(this.birthDateInput.value);
        if (isNaN(birthDate.getTime())) {
            alert('有効な日付を入力してください。');
            return;
        }

        this.drawHoroscopeCircle();
        this.calculatePlanetPositions(birthDate);
    }

    drawHoroscopeCircle() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 50;

        // 円を描画
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        this.ctx.strokeStyle = '#0f3460';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // 12のサインを描画
        for (let i = 0; i < 12; i++) {
            const angle = (i * 30 - 90) * Math.PI / 180;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            
            this.ctx.beginPath();
            this.ctx.moveTo(centerX, centerY);
            this.ctx.lineTo(x, y);
            this.ctx.strokeStyle = '#0f3460';
            this.ctx.stroke();
        }
    }

    calculatePlanetPositions(birthDate) {
        this.planetPositions.innerHTML = '';
        
        this.planets.forEach(planet => {
            // 簡易的な計算（実際の占星術計算とは異なります）
            const position = Math.floor(Math.random() * 360);
            const sign = Math.floor(position / 30);
            const degree = position % 30;
            
            const planetElement = document.createElement('div');
            planetElement.className = 'planet-position';
            planetElement.innerHTML = `
                <strong>${planet.name} (${planet.symbol})</strong><br>
                位置: ${sign + 1}宮 ${degree}度
            `;
            this.planetPositions.appendChild(planetElement);

            // 惑星の位置を円上に描画
            this.drawPlanet(planet, position);
        });
    }

    drawPlanet(planet, position) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 50;
        const angle = (position - 90) * Math.PI / 180;
        
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        this.ctx.beginPath();
        this.ctx.arc(x, y, 10, 0, Math.PI * 2);
        this.ctx.fillStyle = planet.color;
        this.ctx.fill();
        
        this.ctx.font = '16px Arial';
        this.ctx.fillStyle = '#e6e6e6';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(planet.symbol, x, y + 5);
    }
}

// ホロスコープビジュアライザーの初期化
const horoscopeVisualizer = new HoroscopeVisualizer();
