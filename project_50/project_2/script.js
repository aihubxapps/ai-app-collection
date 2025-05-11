window.onload = () => {
    const savedText = localStorage.getItem("memo");
    if (savedText) {
        document.getElementById('editor').value = savedText;
    }
};

function save() {
    const text = document.getElementById('editor').value;
    localStorage.setItem("memo", text);
}

function load() {
    const fileInput = document.getElementById('myFile');
    const reader = new FileReader();
    reader.onload = function (e) {
        document.getElementById('editor').value = e.target.result;
    };
    if (fileInput.files.length > 0) {
        reader.readAsText(fileInput.files[0]);
    }
}

function download() {
    const text = document.getElementById('editor').value;
    const blob = new Blob([text], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'memo.txt';
    a.click();
    URL.revokeObjectURL(a.href);
}

function clearEditor() {
    document.getElementById('editor').value = '';
    localStorage.removeItem("memo");  // ブラウザ保存も消す場合
}

