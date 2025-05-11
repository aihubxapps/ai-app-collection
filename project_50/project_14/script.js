class Stopwatch {
    constructor() {
        this.startTime = 0;
        this.elapsedTime = 0;
        this.isRunning = false;
        this.laps = [];
        this.timerId = null;

        // DOM要素
        this.timeDisplay = document.querySelector('.time');
        this.startStopButton = document.getElementById('startStop');
        this.lapButton = document.getElementById('lap');
        this.resetButton = document.getElementById('reset');
        this.lapsList = document.getElementById('lapsList');

        // イベントリスナー
        this.startStopButton.addEventListener('click', () => this.toggleTimer());
        this.lapButton.addEventListener('click', () => this.recordLap());
        this.resetButton.addEventListener('click', () => this.resetTimer());

        // 初期表示
        this.updateDisplay();
    }

    toggleTimer() {
        if (this.isRunning) {
            this.stopTimer();
        } else {
            this.startTimer();
        }
    }

    startTimer() {
        if (!this.isRunning) {
            this.startTime = Date.now() - this.elapsedTime;
            this.isRunning = true;
            this.startStopButton.textContent = 'ストップ';
            this.startStopButton.classList.add('running');
            this.timerId = requestAnimationFrame(() => this.updateTimer());
        }
    }

    stopTimer() {
        if (this.isRunning) {
            this.isRunning = false;
            this.startStopButton.textContent = 'スタート';
            this.startStopButton.classList.remove('running');
            cancelAnimationFrame(this.timerId);
        }
    }

    resetTimer() {
        this.stopTimer();
        this.elapsedTime = 0;
        this.laps = [];
        this.updateDisplay();
        this.updateLapsList();
    }

    recordLap() {
        if (this.isRunning) {
            const lapTime = this.formatTime(this.elapsedTime);
            this.laps.push({
                number: this.laps.length + 1,
                time: lapTime
            });
            this.updateLapsList();
        }
    }

    updateTimer() {
        this.elapsedTime = Date.now() - this.startTime;
        this.updateDisplay();
        this.timerId = requestAnimationFrame(() => this.updateTimer());
    }

    updateDisplay() {
        this.timeDisplay.textContent = this.formatTime(this.elapsedTime);
    }

    updateLapsList() {
        this.lapsList.innerHTML = '';
        this.laps.forEach(lap => {
            const lapItem = document.createElement('div');
            lapItem.className = 'lap-item';
            lapItem.innerHTML = `
                <span class="lap-number">ラップ ${lap.number}</span>
                <span class="lap-time">${lap.time}</span>
            `;
            this.lapsList.appendChild(lapItem);
        });
    }

    formatTime(time) {
        const hours = Math.floor(time / (1000 * 60 * 60));
        const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((time % (1000 * 60)) / 1000);
        const milliseconds = Math.floor(time % 1000);

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
    }
}

// ストップウォッチの初期化
const stopwatch = new Stopwatch();
