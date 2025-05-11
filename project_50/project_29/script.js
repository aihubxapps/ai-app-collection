class CharacterCreator {
    constructor() {
        this.personalitySelect = document.getElementById('personality');
        this.appearanceSelect = document.getElementById('appearance');
        this.occupationSelect = document.getElementById('occupation');
        this.generateButton = document.getElementById('generateButton');
        this.copyButton = document.getElementById('copyButton');
        this.jsonButton = document.getElementById('jsonButton');
        this.characterProfile = document.getElementById('characterProfile');

        this.personalityTraits = {
            cheerful: {
                traits: ['明るい', '活発', '社交的', '楽観的'],
                hobbies: ['スポーツ', 'ダンス', 'カラオケ'],
                weaknesses: ['落ち着きがない', '計画性に欠ける']
            },
            calm: {
                traits: ['穏やか', '落ち着いている', '思慮深い', '優しい'],
                hobbies: ['読書', 'ガーデニング', '瞑想'],
                weaknesses: ['決断が遅い', '消極的']
            },
            serious: {
                traits: ['真面目', '几帳面', '責任感が強い', '誠実'],
                hobbies: ['将棋', 'プログラミング', '研究'],
                weaknesses: ['融通が利かない', '完璧主義']
            },
            mysterious: {
                traits: ['神秘的', '謎めいている', '直感的', '独創的'],
                hobbies: ['占い', 'オカルト', 'アート'],
                weaknesses: ['理解されにくい', '孤立しがち']
            }
        };

        this.appearanceTraits = {
            tall: {
                features: ['背が高い', 'スラリとしている', '長い手足'],
                style: ['シンプル', 'エレガント', 'モノトーン']
            },
            small: {
                features: ['小柄', '可愛らしい', '丸みを帯びた'],
                style: ['カラフル', 'キュート', 'レイヤード']
            },
            athletic: {
                features: ['筋肉質', 'スポーティ', '健康的'],
                style: ['カジュアル', 'スポーティ', 'ミニマル']
            },
            elegant: {
                features: ['優雅', '美しい', '洗練された'],
                style: ['クラシック', 'シック', '高級感']
            }
        };

        this.occupationTraits = {
            student: {
                skills: ['勉強熱心', '好奇心旺盛', '若さ'],
                goals: ['学業の成功', '将来の夢の実現']
            },
            teacher: {
                skills: ['指導力', '忍耐力', '知識'],
                goals: ['生徒の成長', '教育の質の向上']
            },
            artist: {
                skills: ['創造力', '感性', '表現力'],
                goals: ['作品の完成', '自己表現']
            },
            business: {
                skills: ['リーダーシップ', '交渉力', '分析力'],
                goals: ['キャリアアップ', 'ビジネスの成功']
            }
        };

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.generateButton.addEventListener('click', () => this.generateCharacter());
        this.copyButton.addEventListener('click', () => this.copyProfile());
        this.jsonButton.addEventListener('click', () => this.showJson());
    }

    generateCharacter() {
        const personality = this.personalitySelect.value;
        const appearance = this.appearanceSelect.value;
        const occupation = this.occupationSelect.value;

        const personalityData = this.personalityTraits[personality];
        const appearanceData = this.appearanceTraits[appearance];
        const occupationData = this.occupationTraits[occupation];

        const character = {
            personality: {
                main: this.getRandomElement(personalityData.traits),
                hobby: this.getRandomElement(personalityData.hobbies),
                weakness: this.getRandomElement(personalityData.weaknesses)
            },
            appearance: {
                feature: this.getRandomElement(appearanceData.features),
                style: this.getRandomElement(appearanceData.style)
            },
            occupation: {
                skill: this.getRandomElement(occupationData.skills),
                goal: this.getRandomElement(occupationData.goals)
            }
        };

        this.displayCharacter(character);
    }

    getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    displayCharacter(character) {
        const profile = `
            <h3>キャラクター設定</h3>
            <p><strong>性格：</strong>${character.personality.main}で、${character.personality.hobby}が趣味です。${character.personality.weakness}という弱点があります。</p>
            <p><strong>外見：</strong>${character.appearance.feature}で、${character.appearance.style}な服装を好みます。</p>
            <p><strong>職業：</strong>${character.occupation.skill}に長けており、${character.occupation.goal}を目指しています。</p>
        `;
        this.characterProfile.innerHTML = profile;
    }

    copyProfile() {
        const text = this.characterProfile.innerText;
        navigator.clipboard.writeText(text)
            .then(() => alert('プロフィールをコピーしました！'))
            .catch(err => console.error('コピーに失敗しました:', err));
    }

    showJson() {
        const personality = this.personalitySelect.value;
        const appearance = this.appearanceSelect.value;
        const occupation = this.occupationSelect.value;

        const character = {
            personality: this.personalityTraits[personality],
            appearance: this.appearanceTraits[appearance],
            occupation: this.occupationTraits[occupation]
        };

        alert(JSON.stringify(character, null, 2));
    }
}

// アプリケーションの初期化
document.addEventListener('DOMContentLoaded', () => {
    new CharacterCreator();
});
