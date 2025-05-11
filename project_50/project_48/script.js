class DataVisualizer {
    constructor() {
        this.setupElements();
        this.setupEventListeners();
        this.chart = null;
        this.data = null;
    }

    setupElements() {
        this.fileInput = document.getElementById('fileInput');
        this.importButton = document.getElementById('importButton');
        this.chartType = document.getElementById('chartType');
        this.dataType = document.getElementById('dataType');
        this.chartCanvas = document.getElementById('dataChart');
        this.totalRecords = document.getElementById('totalRecords');
        this.uniqueCategories = document.getElementById('uniqueCategories');
        this.dateRange = document.getElementById('dateRange');
    }

    setupEventListeners() {
        this.importButton.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
        this.chartType.addEventListener('change', () => this.updateChart());
        this.dataType.addEventListener('change', () => this.updateChart());
    }

    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                if (file.name.endsWith('.json')) {
                    this.data = JSON.parse(e.target.result);
                } else if (file.name.endsWith('.csv')) {
                    this.data = this.parseCSV(e.target.result);
                }
                this.updateSummary();
                this.updateChart();
            } catch (error) {
                alert('ファイルの読み込みに失敗しました。');
                console.error(error);
            }
        };
        reader.readAsText(file);
    }

    parseCSV(csv) {
        const lines = csv.split('\n');
        const headers = lines[0].split(',');
        return lines.slice(1).map(line => {
            const values = line.split(',');
            return headers.reduce((obj, header, index) => {
                obj[header.trim()] = values[index]?.trim();
                return obj;
            }, {});
        });
    }

    updateSummary() {
        if (!this.data) return;

        this.totalRecords.textContent = this.data.length;
        
        const categories = new Set(this.data.map(item => item.category));
        this.uniqueCategories.textContent = categories.size;

        const dates = this.data.map(item => new Date(item.date));
        const minDate = new Date(Math.min(...dates));
        const maxDate = new Date(Math.max(...dates));
        this.dateRange.textContent = `${minDate.toLocaleDateString()} - ${maxDate.toLocaleDateString()}`;
    }

    updateChart() {
        if (!this.data) return;

        const chartData = this.prepareChartData();
        this.renderChart(chartData);
    }

    prepareChartData() {
        const type = this.dataType.value;
        const chartType = this.chartType.value;

        if (type === 'category') {
            const categories = {};
            this.data.forEach(item => {
                categories[item.category] = (categories[item.category] || 0) + 1;
            });

            return {
                labels: Object.keys(categories),
                data: Object.values(categories)
            };
        } else {
            const timeData = {};
            this.data.forEach(item => {
                const date = new Date(item.date).toLocaleDateString();
                timeData[date] = (timeData[date] || 0) + 1;
            });

            return {
                labels: Object.keys(timeData),
                data: Object.values(timeData)
            };
        }
    }

    renderChart(chartData) {
        if (this.chart) {
            this.chart.destroy();
        }

        const ctx = this.chartCanvas.getContext('2d');
        this.chart = new Chart(ctx, {
            type: this.chartType.value,
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: this.dataType.value === 'category' ? 'カテゴリ別データ' : '時間別データ',
                    data: chartData.data,
                    backgroundColor: this.generateColors(chartData.labels.length),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            }
        });
    }

    generateColors(count) {
        const colors = [
            '#3498db', '#2ecc71', '#e74c3c', '#f1c40f', '#9b59b6',
            '#1abc9c', '#e67e22', '#34495e', '#16a085', '#c0392b'
        ];
        return Array(count).fill().map((_, i) => colors[i % colors.length]);
    }
}

// アプリケーションの初期化
document.addEventListener('DOMContentLoaded', () => {
    new DataVisualizer();
});
