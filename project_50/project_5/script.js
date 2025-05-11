// app.js
// const qrCode = new QRious({
//     element: document.getElementById('qr-code'),
//     value: 'https://www.google.com/',
//     size: 300,
//     level: 'M'
// });

document.addEventListener('DOMContentLoaded', () => {
    const qrTextInput = document.getElementById('qr-text');
    const generateQrButton = document.getElementById('generate-qr');
    const qrCodeCanvas = document.getElementById('qr-code');

    generateQrButton.addEventListener('click', () => {
        const textToEncode = qrTextInput.value;
        if (textToEncode) {
            new QRious({
                element: qrCodeCanvas,
                value: textToEncode,
                size: 300 // QRコードのサイズを #qr-code-container のサイズと合わせる
            });
        } else {
            alert("テキストまたはURLを入力してください。");
        }
    });
});
