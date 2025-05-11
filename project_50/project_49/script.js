class PortfolioViewer {
    constructor() {
        this.setupElements();
        this.setupEventListeners();
        this.projects = [
            {
                id: 39,
                title: '天気表示アプリ',
                description: 'OpenWeatherMap APIを使用した天気情報表示アプリ',
                category: 'api',
                image: '../project_39/screenshot.png',
                technologies: ['HTML', 'CSS', 'JavaScript', 'OpenWeatherMap API'],
                duration: '2日',
                demoLink: '../project_39/index.html',
                codeLink: 'https://github.com/username/project_39'
            },
            {
                id: 40,
                title: 'GitHubリポジトリ検索',
                description: 'GitHub APIを使用したリポジトリ検索アプリ',
                category: 'api',
                image: '../project_40/screenshot.png',
                technologies: ['HTML', 'CSS', 'JavaScript', 'GitHub API'],
                duration: '2日',
                demoLink: '../project_40/index.html',
                codeLink: 'https://github.com/username/project_40'
            },
            {
                id: 41,
                title: '音楽ジャンル診断',
                description: 'Spotify APIを使用した音楽分析アプリ',
                category: 'api',
                image: '../project_41/screenshot.png',
                technologies: ['HTML', 'CSS', 'JavaScript', 'Spotify API'],
                duration: '2日',
                demoLink: '../project_41/index.html',
                codeLink: 'https://github.com/username/project_41'
            },
            {
                id: 42,
                title: '翻訳アプリ',
                description: 'OpenAI APIを使用した翻訳アプリ',
                category: 'api',
                image: '../project_42/screenshot.png',
                technologies: ['HTML', 'CSS', 'JavaScript', 'OpenAI API'],
                duration: '2日',
                demoLink: '../project_42/index.html',
                codeLink: 'https://github.com/username/project_42'
            },
            {
                id: 43,
                title: '類語検索アプリ',
                description: 'DataMuse APIを使用した類語検索アプリ',
                category: 'api',
                image: '../project_43/screenshot.png',
                technologies: ['HTML', 'CSS', 'JavaScript', 'DataMuse API'],
                duration: '2日',
                demoLink: '../project_43/index.html',
                codeLink: 'https://github.com/username/project_43'
            },
            {
                id: 44,
                title: 'サジェスト検索UI',
                description: 'リアルタイムサジェスト機能付き検索UI',
                category: 'ui',
                image: '../project_44/screenshot.png',
                technologies: ['HTML', 'CSS', 'JavaScript'],
                duration: '2日',
                demoLink: '../project_44/index.html',
                codeLink: 'https://github.com/username/project_44'
            },
            {
                id: 45,
                title: 'AI美女画像ビューア',
                description: 'ローカル画像管理アプリ',
                category: 'web',
                image: '../project_45/screenshot.png',
                technologies: ['HTML', 'CSS', 'JavaScript'],
                duration: '2日',
                demoLink: '../project_45/index.html',
                codeLink: 'https://github.com/username/project_45'
            },
            {
                id: 46,
                title: '日替わり名言ジェネレーター',
                description: '日替わりで名言を表示するアプリ',
                category: 'web',
                image: '../project_46/screenshot.png',
                technologies: ['HTML', 'CSS', 'JavaScript'],
                duration: '2日',
                demoLink: '../project_46/index.html',
                codeLink: 'https://github.com/username/project_46'
            },
            {
                id: 47,
                title: 'マイページ風統合アプリ',
                description: 'アプリ一覧と進捗管理ダッシュボード',
                category: 'web',
                image: '../project_47/screenshot.png',
                technologies: ['HTML', 'CSS', 'JavaScript'],
                duration: '2日',
                demoLink: '../project_47/index.html',
                codeLink: 'https://github.com/username/project_47'
            }
        ];
        this.displayProjects();
    }

    setupElements() {
        this.searchInput = document.getElementById('searchInput');
        this.filterButtons = document.querySelectorAll('.filter-button');
        this.portfolioGrid = document.getElementById('portfolioGrid');
        this.modal = document.getElementById('projectModal');
        this.closeButton = document.querySelector('.close-button');
        this.modalImage = document.getElementById('modalImage');
        this.modalTitle = document.getElementById('modalTitle');
        this.modalDescription = document.getElementById('modalDescription');
        this.modalCategory = document.getElementById('modalCategory');
        this.modalTechnologies = document.getElementById('modalTechnologies');
        this.modalDuration = document.getElementById('modalDuration');
        this.modalDemoLink = document.getElementById('modalDemoLink');
        this.modalCodeLink = document.getElementById('modalCodeLink');
    }

    setupEventListeners() {
        this.searchInput.addEventListener('input', () => this.filterProjects());
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                this.filterProjects();
            });
        });
        this.closeButton.addEventListener('click', () => this.closeModal());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });
    }

    displayProjects() {
        this.portfolioGrid.innerHTML = this.projects
            .map(project => `
                <div class="project-card" data-id="${project.id}">
                    <img src="${project.image}" alt="${project.title}" class="project-image">
                    <div class="project-info">
                        <div class="project-title">${project.title}</div>
                        <div class="project-description">${project.description}</div>
                        <div class="project-category">${this.getCategoryText(project.category)}</div>
                    </div>
                </div>
            `)
            .join('');

        this.portfolioGrid.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('click', () => this.openModal(card.dataset.id));
        });
    }

    filterProjects() {
        const searchTerm = this.searchInput.value.toLowerCase();
        const activeCategory = document.querySelector('.filter-button.active').dataset.category;

        this.projects.forEach(project => {
            const card = this.portfolioGrid.querySelector(`[data-id="${project.id}"]`);
            const matchesSearch = project.title.toLowerCase().includes(searchTerm) ||
                                project.description.toLowerCase().includes(searchTerm);
            const matchesCategory = activeCategory === 'all' || project.category === activeCategory;
            card.style.display = matchesSearch && matchesCategory ? 'block' : 'none';
        });
    }

    openModal(projectId) {
        const project = this.projects.find(p => p.id === parseInt(projectId));
        if (project) {
            this.modalImage.src = project.image;
            this.modalTitle.textContent = project.title;
            this.modalDescription.textContent = project.description;
            this.modalCategory.textContent = this.getCategoryText(project.category);
            this.modalTechnologies.textContent = project.technologies.join(', ');
            this.modalDuration.textContent = project.duration;
            this.modalDemoLink.href = project.demoLink;
            this.modalCodeLink.href = project.codeLink;
            this.modal.classList.add('active');
        }
    }

    closeModal() {
        this.modal.classList.remove('active');
    }

    getCategoryText(category) {
        switch (category) {
            case 'web':
                return 'Webアプリ';
            case 'api':
                return 'API連携';
            case 'ui':
                return 'UI/UX';
            default:
                return category;
        }
    }
}

// アプリケーションの初期化
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioViewer();
});
