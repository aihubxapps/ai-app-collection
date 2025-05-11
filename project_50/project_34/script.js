class DiagnosisMaker {
    constructor() {
        this.questions = [];
        this.results = [];
        this.currentQuestionIndex = 0;
        this.answers = [];

        this.setupElements();
        this.setupEventListeners();
    }

    setupElements() {
        this.questionList = document.getElementById('questionList');
        this.resultList = document.getElementById('resultList');
        this.addQuestionButton = document.getElementById('addQuestionButton');
        this.addResultButton = document.getElementById('addResultButton');
        this.saveButton = document.getElementById('saveButton');
        this.previewButton = document.getElementById('previewButton');
        this.previewSection = document.getElementById('previewSection');
        this.questionDisplay = document.getElementById('questionDisplay');
        this.resultDisplay = document.getElementById('resultDisplay');
        this.resultText = document.getElementById('resultText');
        this.resultImage = document.getElementById('resultImage');
        this.shareButton = document.getElementById('shareButton');
        this.shareUrl = document.getElementById('shareUrl');
        this.backToEditButton = document.getElementById('backToEditButton');
    }

    setupEventListeners() {
        this.addQuestionButton.addEventListener('click', () => this.addQuestion());
        this.addResultButton.addEventListener('click', () => this.addResult());
        this.saveButton.addEventListener('click', () => this.saveDiagnosis());
        this.previewButton.addEventListener('click', () => this.showPreview());
        this.backToEditButton.addEventListener('click', () => this.hidePreview());
        this.shareButton.addEventListener('click', () => this.shareResult());
    }

    addQuestion() {
        const questionId = Date.now();
        const questionHtml = `
            <div class="question-item" data-id="${questionId}">
                <input type="text" class="question-text" placeholder="質問を入力">
                <div class="option-list">
                    <div class="option-item">
                        <input type="text" placeholder="選択肢1">
                        <button class="remove-button" onclick="diagnosisMaker.removeOption(${questionId}, this)">×</button>
                    </div>
                </div>
                <button class="add-button" onclick="diagnosisMaker.addOption(${questionId})">選択肢を追加</button>
                <button class="remove-button" onclick="diagnosisMaker.removeQuestion(${questionId})">質問を削除</button>
            </div>
        `;
        this.questionList.insertAdjacentHTML('beforeend', questionHtml);
    }

    addOption(questionId) {
        const questionItem = document.querySelector(`.question-item[data-id="${questionId}"]`);
        const optionList = questionItem.querySelector('.option-list');
        const optionHtml = `
            <div class="option-item">
                <input type="text" placeholder="選択肢">
                <button class="remove-button" onclick="diagnosisMaker.removeOption(${questionId}, this)">×</button>
            </div>
        `;
        optionList.insertAdjacentHTML('beforeend', optionHtml);
    }

    removeOption(questionId, button) {
        button.closest('.option-item').remove();
    }

    removeQuestion(questionId) {
        const questionItem = document.querySelector(`.question-item[data-id="${questionId}"]`);
        questionItem.remove();
    }

    addResult() {
        const resultId = Date.now();
        const resultHtml = `
            <div class="result-item" data-id="${resultId}">
                <input type="text" class="result-title" placeholder="結果のタイトル">
                <textarea class="result-description" placeholder="結果の説明"></textarea>
                <input type="text" class="result-image" placeholder="画像URL（オプション）">
                <button class="remove-button" onclick="diagnosisMaker.removeResult(${resultId})">結果を削除</button>
            </div>
        `;
        this.resultList.insertAdjacentHTML('beforeend', resultHtml);
    }

    removeResult(resultId) {
        const resultItem = document.querySelector(`.result-item[data-id="${resultId}"]`);
        resultItem.remove();
    }

    saveDiagnosis() {
        this.questions = Array.from(this.questionList.children).map(questionItem => ({
            id: questionItem.dataset.id,
            text: questionItem.querySelector('.question-text').value,
            options: Array.from(questionItem.querySelectorAll('.option-item input')).map(input => input.value)
        }));

        this.results = Array.from(this.resultList.children).map(resultItem => ({
            id: resultItem.dataset.id,
            title: resultItem.querySelector('.result-title').value,
            description: resultItem.querySelector('.result-description').value,
            image: resultItem.querySelector('.result-image').value
        }));

        localStorage.setItem('diagnosisData', JSON.stringify({
            questions: this.questions,
            results: this.results
        }));

        alert('診断を保存しました！');
    }

    showPreview() {
        this.saveDiagnosis();
        this.currentQuestionIndex = 0;
        this.answers = [];
        this.showQuestion();
        this.previewSection.style.display = 'block';
        document.querySelector('.editor-section').style.display = 'none';
    }

    hidePreview() {
        this.previewSection.style.display = 'none';
        document.querySelector('.editor-section').style.display = 'block';
    }

    showQuestion() {
        if (this.currentQuestionIndex >= this.questions.length) {
            this.showResult();
            return;
        }

        const question = this.questions[this.currentQuestionIndex];
        const questionHtml = `
            <div class="question-display">
                <div class="question-text">${question.text}</div>
                <div class="option-buttons">
                    ${question.options.map((option, index) => `
                        <button class="option-button" onclick="diagnosisMaker.selectAnswer(${index})">${option}</button>
                    `).join('')}
                </div>
            </div>
        `;
        this.questionDisplay.innerHTML = questionHtml;
    }

    selectAnswer(optionIndex) {
        this.answers.push(optionIndex);
        this.currentQuestionIndex++;
        this.showQuestion();
    }

    showResult() {
        const resultIndex = this.calculateResult();
        const result = this.results[resultIndex];
        
        this.questionDisplay.style.display = 'none';
        this.resultDisplay.style.display = 'block';
        
        this.resultText.innerHTML = `
            <h3>${result.title}</h3>
            <p>${result.description}</p>
        `;

        if (result.image) {
            this.resultImage.innerHTML = `<img src="${result.image}" alt="結果画像">`;
        } else {
            this.resultImage.innerHTML = '';
        }

        // シェア用URLの生成
        const shareData = btoa(JSON.stringify(this.answers));
        const shareUrl = `${window.location.origin}${window.location.pathname}?result=${shareData}`;
        this.shareUrl.textContent = shareUrl;
    }

    calculateResult() {
        // 簡単な結果計算ロジック（実際のアプリではより複雑なロジックを実装可能）
        const sum = this.answers.reduce((a, b) => a + b, 0);
        return sum % this.results.length;
    }

    shareResult() {
        if (navigator.share) {
            navigator.share({
                title: '診断結果',
                text: '私の診断結果です！',
                url: this.shareUrl.textContent
            }).catch(console.error);
        } else {
            // Web Share APIがサポートされていない場合
            const textArea = document.createElement('textarea');
            textArea.value = this.shareUrl.textContent;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('URLをコピーしました！');
        }
    }
}

// グローバル変数として診断メーカーのインスタンスを作成
const diagnosisMaker = new DiagnosisMaker();

// ページ読み込み時に保存されたデータを復元
document.addEventListener('DOMContentLoaded', () => {
    const savedData = localStorage.getItem('diagnosisData');
    if (savedData) {
        const data = JSON.parse(savedData);
        diagnosisMaker.questions = data.questions;
        diagnosisMaker.results = data.results;
        
        // 質問と結果のUIを再構築
        data.questions.forEach(question => {
            diagnosisMaker.addQuestion();
            const questionItem = document.querySelector('.question-item:last-child');
            questionItem.querySelector('.question-text').value = question.text;
            question.options.forEach(option => {
                diagnosisMaker.addOption(questionItem.dataset.id);
                const optionInput = questionItem.querySelector('.option-item:last-child input');
                optionInput.value = option;
            });
        });

        data.results.forEach(result => {
            diagnosisMaker.addResult();
            const resultItem = document.querySelector('.result-item:last-child');
            resultItem.querySelector('.result-title').value = result.title;
            resultItem.querySelector('.result-description').value = result.description;
            resultItem.querySelector('.result-image').value = result.image;
        });
    }
});
