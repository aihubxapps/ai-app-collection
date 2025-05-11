// script.js
let entries = [];

function addEntry(type) {
    const desc = document.getElementById(`${type}Desc`).value.trim();
    const amount = parseFloat(document.getElementById(`${type}Amount`).value);
    
    if (!desc || isNaN(amount)) return;

    const entry = {
        type: type,
        description: desc,
        amount: amount
    };

    entries.push(entry);
    updateDisplay();
    clearInputs();
}

function clearInputs() {
    document.getElementById('incomeDesc').value = '';
    document.getElementById('incomeAmount').value = '';
    document.getElementById('expenseDesc').value = '';
    document.getElementById('expenseAmount').value = '';
}

function updateDisplay() {
    const incomeTotal = entries.filter(e => e.type === 'income').reduce((a, b) => a + b.amount, 0);
    const expenseTotal = entries.filter(e => e.type === 'expense').reduce((a, b) => a + b.amount, 0);
    const balance = incomeTotal - expenseTotal;

    document.getElementById('totalIncome').textContent = incomeTotal.toFixed(2);
    document.getElementById('totalExpense').textContent = expenseTotal.toFixed(2);
    document.getElementById('balance').textContent = balance.toFixed(2);

    const list = document.getElementById('entryList');
    list.innerHTML = '';

    entries.forEach(entry => {
        const li = document.createElement('li');
        li.textContent = `${entry.description}: ¥${entry.amount.toFixed(2)}`;
        if (entry.type === 'expense') {
            li.style.color = 'red';
        }
        list.appendChild(li);
    });
}
