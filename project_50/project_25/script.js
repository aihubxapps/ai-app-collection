class PasswordGenerator {
    constructor() {
        this.lengthInput = document.getElementById('length');
        this.uppercaseCheckbox = document.getElementById('uppercase');
        this.numbersCheckbox = document.getElementById('numbers');
        this.symbolsCheckbox = document.getElementById('symbols');
        this.passwordInput = document.getElementById('password');
        this.generateButton = document.getElementById('generateButton');
        this.copyButton = document.getElementById('copyButton');
        this.strengthBar = document.querySelector('.strength-bar');

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.generateButton.addEventListener('click', () => this.generatePassword());
        this.copyButton.addEventListener('click', () => this.copyPassword());
        this.passwordInput.addEventListener('input', () => this.updateStrength());
    }

    generatePassword() {
        const length = parseInt(this.lengthInput.value);
        const useUppercase = this.uppercaseCheckbox.checked;
        const useNumbers = this.numbersCheckbox.checked;
        const useSymbols = this.symbolsCheckbox.checked;

        let charset = 'abcdefghijklmnopqrstuvwxyz';
        if (useUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (useNumbers) charset += '0123456789';
        if (useSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

        let password = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
        }

        this.passwordInput.value = password;
        this.updateStrength();
    }

    copyPassword() {
        const password = this.passwordInput.value;
        if (!password) {
            alert('パスワードを生成してください。');
            return;
        }

        navigator.clipboard.writeText(password).then(() => {
            alert('パスワードをコピーしました！');
        }).catch(err => {
            console.error('コピーに失敗しました:', err);
            alert('コピーに失敗しました。');
        });
    }

    updateStrength() {
        const password = this.passwordInput.value;
        if (!password) {
            this.strengthBar.className = 'strength-bar';
            return;
        }

        let strength = 0;
        
        // 長さによる強度
        if (password.length >= 12) strength += 1;
        if (password.length >= 16) strength += 1;

        // 文字種による強度
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;

        // 強度に応じてクラスを設定
        this.strengthBar.className = 'strength-bar';
        if (strength <= 2) {
            this.strengthBar.classList.add('weak');
        } else if (strength <= 4) {
            this.strengthBar.classList.add('medium');
        } else {
            this.strengthBar.classList.add('strong');
        }
    }
}

// パスワード生成アプリの初期化
const passwordGenerator = new PasswordGenerator(); 