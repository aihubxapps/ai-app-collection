// ローカルファイルから画像プレビュー
document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('filePreview').src = e.target.result;
    };
    reader.readAsDataURL(file);
});

// URLから画像プレビュー
function loadImage() {
    const url = document.getElementById('urlInput').value;
    if (!url) return;

    document.getElementById('urlPreview').src = url;
}
