class Calendar {
    constructor() {
        this.currentDate = new Date();
        this.schedules = JSON.parse(localStorage.getItem('schedules')) || {};
        this.selectedDate = null;

        // DOM要素
        this.currentMonthElement = document.getElementById('currentMonth');
        this.calendarGrid = document.getElementById('calendarGrid');
        this.prevMonthButton = document.getElementById('prevMonth');
        this.nextMonthButton = document.getElementById('nextMonth');
        this.scheduleInput = document.getElementById('scheduleInput');
        this.scheduleText = document.getElementById('scheduleText');
        this.saveScheduleButton = document.getElementById('saveSchedule');
        this.cancelScheduleButton = document.getElementById('cancelSchedule');
        this.selectedDateElement = document.querySelector('.selected-date');
        this.todayScheduleList = document.getElementById('todayScheduleList');

        // イベントリスナー
        this.prevMonthButton.addEventListener('click', () => this.changeMonth(-1));
        this.nextMonthButton.addEventListener('click', () => this.changeMonth(1));
        this.saveScheduleButton.addEventListener('click', () => this.saveSchedule());
        this.cancelScheduleButton.addEventListener('click', () => this.hideScheduleInput());

        // 初期表示
        this.renderCalendar();
        this.updateTodaySchedule();
    }

    changeMonth(delta) {
        this.currentDate.setMonth(this.currentDate.getMonth() + delta);
        this.renderCalendar();
    }

    renderCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        // 月の表示を更新
        this.currentMonthElement.textContent = `${year}年${month + 1}月`;

        // カレンダーグリッドをクリア
        this.calendarGrid.innerHTML = '';

        // 月の最初の日と最後の日を取得
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        // 前月の日数を取得
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        const firstDayOfWeek = firstDay.getDay();

        // 前月の日を表示
        for (let i = firstDayOfWeek - 1; i >= 0; i--) {
            const day = prevMonthLastDay - i;
            const date = new Date(year, month - 1, day);
            this.createDayElement(date, true);
        }

        // 当月の日を表示
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const date = new Date(year, month, day);
            this.createDayElement(date, false);
        }

        // 次月の日を表示
        const remainingDays = 42 - (firstDayOfWeek + lastDay.getDate());
        for (let day = 1; day <= remainingDays; day++) {
            const date = new Date(year, month + 1, day);
            this.createDayElement(date, true);
        }
    }

    createDayElement(date, isOtherMonth) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        if (isOtherMonth) {
            dayElement.classList.add('other-month');
        }

        // 今日の日付かどうかをチェック
        const today = new Date();
        if (date.toDateString() === today.toDateString()) {
            dayElement.classList.add('today');
        }

        // 日付を表示
        dayElement.textContent = date.getDate();

        // クリックイベント
        dayElement.addEventListener('click', () => this.showScheduleInput(date));

        // スケジュールがある場合は表示
        const dateString = this.formatDate(date);
        if (this.schedules[dateString]) {
            const scheduleDot = document.createElement('div');
            scheduleDot.style.width = '6px';
            scheduleDot.style.height = '6px';
            scheduleDot.style.backgroundColor = '#3498db';
            scheduleDot.style.borderRadius = '50%';
            scheduleDot.style.margin = '2px auto';
            dayElement.appendChild(scheduleDot);
        }

        this.calendarGrid.appendChild(dayElement);
    }

    showScheduleInput(date) {
        this.selectedDate = date;
        this.scheduleInput.style.display = 'block';
        this.selectedDateElement.textContent = this.formatDate(date);
        this.scheduleText.value = this.schedules[this.formatDate(date)] || '';
    }

    hideScheduleInput() {
        this.scheduleInput.style.display = 'none';
        this.selectedDate = null;
        this.scheduleText.value = '';
    }

    saveSchedule() {
        if (this.selectedDate) {
            const dateString = this.formatDate(this.selectedDate);
            this.schedules[dateString] = this.scheduleText.value;
            localStorage.setItem('schedules', JSON.stringify(this.schedules));
            this.renderCalendar();
            this.updateTodaySchedule();
            this.hideScheduleInput();
        }
    }

    updateTodaySchedule() {
        const today = new Date();
        const todayString = this.formatDate(today);
        const todaySchedule = this.schedules[todayString];

        this.todayScheduleList.innerHTML = '';
        if (todaySchedule) {
            const scheduleItem = document.createElement('div');
            scheduleItem.className = 'schedule-item';
            scheduleItem.textContent = todaySchedule;
            this.todayScheduleList.appendChild(scheduleItem);
        } else {
            this.todayScheduleList.textContent = '予定はありません';
        }
    }

    formatDate(date) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }
}

// カレンダーの初期化
const calendar = new Calendar();
