let habits = [];

function addHabit() {
    const habitName = document.getElementById('habit').value.trim();
    if (habitName) {
        habits.push({ name: habitName, days: Array.from({ length: 7 }, () => false) });
        renderHabits();
        document.getElementById('habit').value = '';
    }
}

function renderHabits() {
    const habitsList = document.getElementById('habitsList');
    habitsList.innerHTML = '';
    habits.forEach((habit, index) => {
        const li = document.createElement('li');
        li.textContent = habit.name;

        const daysOfWeek = ["日", "月", "火", "水", "木", "金", "土"];
        const dayInputs = daysOfWeek.map(day => {
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.id = `habit-${index}-${day}`;
            input.checked = habit.days[daysOfWeek.indexOf(day)];
            input.addEventListener('change', () => updateHabit(index, day));
            return input;
        });

        li.appendChild(document.createElement('div').appendChild(...dayInputs));

        habitsList.appendChild(li);
    });
}

function updateHabit(habitIndex, day) {
    const habit = habits[habitIndex];
    habit.days[daysOfWeek.indexOf(day)] = !habit.days[daysOfWeek.indexOf(day)];
    renderHabits();
}
