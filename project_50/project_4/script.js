function rollDice() {
  // 1～6 の乱数
  const num = Math.floor(Math.random() * 6) + 1;

  // おみくじの区分を配列で定義（インデックスは 0～5）
  const fortunes = ['大吉', '中吉', '小吉', '末吉', '凶', '大凶'];

  // 配列のインデックスに合わせる（num が 1 のとき配列の 0 番目 → '大吉'）
  const resultText = fortunes[num - 1];

  // 結果を表示
  document.getElementById('result').textContent = resultText;
}
