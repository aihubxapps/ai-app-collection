class PomodoroTimer {
    constructor() {
        this.workTime = 25 * 60; // 25分
        this.breakTime = 5 * 60;  // 5分
        this.timeLeft = this.workTime;
        this.isRunning = false;
        this.isWorkMode = true;
        this.timerId = null;

        // DOM要素
        this.timeDisplay = document.querySelector('.time');
        this.modeDisplay = document.querySelector('.mode');
        this.startPauseBtn = document.getElementById('startPause');
        this.resetBtn = document.getElementById('reset');
        this.notification = document.getElementById('notification');

        // イベントリスナー
        this.startPauseBtn.addEventListener('click', () => this.toggleTimer());
        this.resetBtn.addEventListener('click', () => this.resetTimer());

        // 初期表示
        this.updateDisplay();
    }

    toggleTimer() {
        if (this.isRunning) {
            this.pauseTimer();
        } else {
            this.startTimer();
        }
    }

    startTimer() {
        this.isRunning = true;
        this.startPauseBtn.textContent = 'Pause';
        this.timerId = setInterval(() => this.tick(), 1000);
    }

    pauseTimer() {
        this.isRunning = false;
        this.startPauseBtn.textContent = 'Start';
        clearInterval(this.timerId);
    }

    resetTimer() {
        this.pauseTimer();
        this.isWorkMode = true;
        this.timeLeft = this.workTime;
        this.updateDisplay();
    }

    tick() {
        if (this.timeLeft > 0) {
            this.timeLeft--;
            this.updateDisplay();
        } else {
            this.switchMode();
        }
    }

    switchMode() {
        this.isWorkMode = !this.isWorkMode;
        this.timeLeft = this.isWorkMode ? this.workTime : this.breakTime;
        this.notification.play();
        this.updateDisplay();
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        this.modeDisplay.textContent = this.isWorkMode ? 'Work' : 'Break';
    }
}

// タイマーの初期化
const timer = new PomodoroTimer();
