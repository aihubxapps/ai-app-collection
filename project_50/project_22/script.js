class WeatherApp {
    constructor() {
        this.apiKey = 'YOUR_API_KEY'; // OpenWeatherMap APIキーを設定してください
        this.cityInput = document.getElementById('cityInput');
        this.searchButton = document.getElementById('searchButton');
        this.weatherDisplay = document.getElementById('weatherDisplay');

        this.searchButton.addEventListener('click', () => this.getWeather());
        this.cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.getWeather();
        });
    }

    async getWeather() {
        const city = this.cityInput.value.trim();
        if (!city) {
            alert('都市名を入力してください。');
            return;
        }

        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.apiKey}&units=metric&lang=ja`
            );

            if (!response.ok) {
                throw new Error('都市が見つかりませんでした。');
            }

            const data = await response.json();
            this.displayWeather(data);
        } catch (error) {
            alert(error.message);
        }
    }

    displayWeather(data) {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp);
        const description = data.weather[0].description;
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;

        this.weatherDisplay.innerHTML = `
            <div class="city-name">${cityName}</div>
            <div class="temperature">${temperature}°C</div>
            <div class="weather-description">${description}</div>
            <div class="weather-details">
                <div class="humidity">湿度: ${humidity}%</div>
                <div class="wind">風速: ${windSpeed}m/s</div>
            </div>
        `;

        this.weatherDisplay.classList.add('active');
    }
}

// 天気予報アプリの初期化
const weatherApp = new WeatherApp(); 