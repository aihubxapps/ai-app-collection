class WeatherApp {
    constructor() {
        this.setupElements();
        this.setupEventListeners();
    }

    setupElements() {
        this.cityInput = document.getElementById('cityInput');
        this.searchButton = document.getElementById('searchButton');
        this.weatherDisplay = document.getElementById('weatherDisplay');
    }

    setupEventListeners() {
        this.searchButton.addEventListener('click', () => this.searchWeather());
        this.cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchWeather();
            }
        });
    }

    async searchWeather() {
        const city = this.cityInput.value.trim();
        if (!city) return;

        this.showLoading();

        try {
            const API_KEY = process.env.WEATHER_API_KEY;
            
            //const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=ja`);
            const url = new URL("https://api.weatherapi.com/v1/current.json");
                url.searchParams.set("key", API_KEY);
                url.searchParams.set("q", city);
                url.searchParams.set("aqi", "no");
            const response = await fetch(url.toString());
            if (!response.ok) {
                throw new Error('天気情報の取得に失敗しました');
            }

            const data = await response.json();
            this.displayWeather(data);
        } catch (error) {
            this.weatherDisplay.innerHTML = `<div class="error">エラー: ${error.message}</div>`;
        } finally {
            this.hideLoading();
        }
    }

    displayWeather(data) {
        const weatherClass = this.getWeatherClass(data.weather[0].main);
        const icon = this.getWeatherIcon(data.weather[0].main);

        this.weatherDisplay.innerHTML = `
            <div class="weather-card ${weatherClass}">
                <div class="weather-icon">${icon}</div>
                <div class="temperature">${Math.round(data.main.temp)}°C</div>
                <div class="weather-description">${data.weather[0].description}</div>
                <div class="weather-details">
                    <div class="detail-item">
                        <div class="detail-label">湿度</div>
                        <div class="detail-value">${data.main.humidity}%</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">風速</div>
                        <div class="detail-value">${data.wind.speed}m/s</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">気圧</div>
                        <div class="detail-value">${data.main.pressure}hPa</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">体感温度</div>
                        <div class="detail-value">${Math.round(data.main.feels_like)}°C</div>
                    </div>
                </div>
            </div>
        `;
    }

    getWeatherClass(weather) {
        const weatherMap = {
            'Clear': 'sunny',
            'Clouds': 'cloudy',
            'Rain': 'rainy',
            'Snow': 'snowy'
        };
        return weatherMap[weather] || 'sunny';
    }

    getWeatherIcon(weather) {
        const iconMap = {
            'Clear': '☀️',
            'Clouds': '☁️',
            'Rain': '🌧️',
            'Snow': '❄️'
        };
        return iconMap[weather] || '☀️';
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
    new WeatherApp();
});
