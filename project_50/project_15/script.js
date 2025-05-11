class Calendar {
    constructor() {
        this.currentDate = new Date();

        // DOM要素
        this.currentMonthElement = document.getElementById('currentMonth');
        this.calendarGrid = document.getElementById('calendarGrid');
        this.prevMonthButton = document.getElementById('prevMonth');
        this.nextMonthButton = document.getElementById('nextMonth');

        // イベントリスナー
        this.prevMonthButton.addEventListener('click', () => this.changeMonth(-1));
        this.nextMonthButton.addEventListener('click', () => this.changeMonth(1));

        // 初期表示
        this.renderCalendar();
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

        this.calendarGrid.appendChild(dayElement);
    }
}

// カレンダーの初期化
const calendar = new Calendar();
