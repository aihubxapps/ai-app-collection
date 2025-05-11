// script.js
function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

let count = 0;
const counterDisplay = document.getElementById('counterDisplay');
const countBtn = document.getElementById('countBtn');

countBtn.addEventListener('click', () => {
    count++;
    counterDisplay.textContent = count;

    const pattern = document.createElement('div');
    pattern.classList.add('pattern');
    document.body.appendChild(pattern);

    // ランダムな色で背景を設定
    pattern.style.background = `radial-gradient(circle, ${getRandomColor()}, ${getRandomColor()})`;

    // 2秒後に要素を削除
    setTimeout(() => {
        pattern.remove();
    }, 2000);
});
