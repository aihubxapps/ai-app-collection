window.onload = () => {
    document.getElementById('editor').innerHTML = localStorage.getItem("memo");  // ページ読み込み時に保存した内容を表示
}
function save()  {
    var text  = document.getElementById('editor').innerHTML;
    localStorage.setItem("memo", text);   // 現在のメモ帳内容をローカルストレージに保存
}
function load()  {
    var fileInput  = document.getElementById('myFile');
    var reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('editor').innerHTML = e.target.result;   // 選択したファイルの内容を表示
    };
    reader.readAsText(fileInput.files[0]);   // 選択したファイルを読込み
}
