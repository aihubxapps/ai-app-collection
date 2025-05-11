class Dashboard {
    constructor() {
        this.setupElements();
        this.apps = [
            {
                id: 39,
                title: '天気表示アプリ',
                description: 'OpenWeatherMap APIを使用した天気情報表示アプリ',
                status: 'completed',
                link: '../project_39/index.html'
            },
            {
                id: 40,
                title: 'GitHubリポジトリ検索',
                description: 'GitHub APIを使用したリポジトリ検索アプリ',
                status: 'completed',
                link: '../project_40/index.html'
            },
            {
                id: 41,
                title: '音楽ジャンル診断',
                description: 'Spotify APIを使用した音楽分析アプリ',
                status: 'completed',
                link: '../project_41/index.html'
            },
            {
                id: 42,
                title: '翻訳アプリ',
                description: 'OpenAI APIを使用した翻訳アプリ',
                status: 'completed',
                link: '../project_42/index.html'
            },
            {
                id: 43,
                title: '類語検索アプリ',
                description: 'DataMuse APIを使用した類語検索アプリ',
                status: 'completed',
                link: '../project_43/index.html'
            },
            {
                id: 44,
                title: 'サジェスト検索UI',
                description: 'リアルタイムサジェスト機能付き検索UI',
                status: 'completed',
                link: '../project_44/index.html'
            },
            {
                id: 45,
                title: 'AI美女画像ビューア',
                description: 'ローカル画像管理アプリ',
                status: 'completed',
                link: '../project_45/index.html'
            },
            {
                id: 46,
                title: '日替わり名言ジェネレーター',
                description: '日替わりで名言を表示するアプリ',
                status: 'completed',
                link: '../project_46/index.html'
            },
            {
                id: 47,
                title: 'マイページ風統合アプリ',
                description: 'アプリ一覧と進捗管理ダッシュボード',
                status: 'completed',
                link: '../project_47/index.html'
            }
        ];
        this.updateDashboard();
    }

    setupElements() {
        this.progressPercentage = document.getElementById('progressPercentage');
        this.progressPath = document.getElementById('progress');
        this.totalApps = document.getElementById('totalApps');
        this.completedApps = document.getElementById('completedApps');
        this.inProgressApps = document.getElementById('inProgressApps');
        this.appGrid = document.getElementById('appGrid');
    }

    updateDashboard() {
        this.updateProgress();
        this.updateStats();
        this.displayApps();
    }

    updateProgress() {
        const completed = this.apps.filter(app => app.status === 'completed').length;
        const total = this.apps.length;
        const percentage = Math.round((completed / total) * 100);

        this.progressPercentage.textContent = `${percentage}%`;
        this.progressPath.style.strokeDashoffset = 100 - percentage;
    }

    updateStats() {
        const completed = this.apps.filter(app => app.status === 'completed').length;
        const inProgress = this.apps.filter(app => app.status === 'in-progress').length;

        this.totalApps.textContent = this.apps.length;
        this.completedApps.textContent = completed;
        this.inProgressApps.textContent = inProgress;
    }

    displayApps() {
        this.appGrid.innerHTML = this.apps
            .map(app => `
                <div class="app-card" onclick="window.location.href='${app.link}'">
                    <div class="app-title">${app.title}</div>
                    <div class="app-description">${app.description}</div>
                    <div class="app-status status-${app.status}">
                        ${this.getStatusText(app.status)}
                    </div>
                </div>
            `)
            .join('');
    }

    getStatusText(status) {
        switch (status) {
            case 'completed':
                return '完了';
            case 'in-progress':
                return '進行中';
            case 'not-started':
                return '未着手';
            default:
                return status;
        }
    }
}

// アプリケーションの初期化
document.addEventListener('DOMContentLoaded', () => {
    new Dashboard();
});
