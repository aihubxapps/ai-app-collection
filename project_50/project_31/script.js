class StoryStructureApp {
    constructor() {
        this.elementTitle = document.getElementById('elementTitle');
        this.elementNote = document.getElementById('elementNote');
        this.elementTag = document.getElementById('elementTag');
        this.addElementButton = document.getElementById('addElementButton');
        this.exportJsonButton = document.getElementById('exportJsonButton');
        this.exportTextButton = document.getElementById('exportTextButton');
        this.flowchart = document.getElementById('flowchart');

        this.elements = [];
        this.draggedElement = null;
        this.draggedIndex = -1;

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.addElementButton.addEventListener('click', () => this.addElement());
        this.exportJsonButton.addEventListener('click', () => this.exportJson());
        this.exportTextButton.addEventListener('click', () => this.exportText());
    }

    addElement() {
        const title = this.elementTitle.value.trim();
        const note = this.elementNote.value.trim();
        const tags = this.elementTag.value.split(',').map(tag => tag.trim()).filter(tag => tag);

        if (!title) {
            alert('見出しを入力してください。');
            return;
        }

        const element = {
            id: Date.now(),
            title,
            note,
            tags
        };

        this.elements.push(element);
        this.renderElement(element);
        this.clearInputs();
    }

    renderElement(element) {
        const elementDiv = document.createElement('div');
        elementDiv.className = 'flowchart-element';
        elementDiv.draggable = true;
        elementDiv.dataset.id = element.id;

        elementDiv.innerHTML = `
            <div class="element-title">${element.title}</div>
            ${element.note ? `<div class="element-note">${element.note}</div>` : ''}
            ${element.tags.length ? `
                <div class="element-tags">
                    ${element.tags.map(tag => `<span class="element-tag">${tag}</span>`).join('')}
                </div>
            ` : ''}
            <div class="element-actions">
                <button class="element-action edit">✎</button>
                <button class="element-action delete">×</button>
            </div>
        `;

        this.setupDragAndDrop(elementDiv);
        this.setupElementActions(elementDiv, element);
        this.flowchart.appendChild(elementDiv);
    }

    setupDragAndDrop(element) {
        element.addEventListener('dragstart', (e) => {
            this.draggedElement = element;
            this.draggedIndex = Array.from(this.flowchart.children).indexOf(element);
            element.classList.add('dragging');
        });

        element.addEventListener('dragend', () => {
            element.classList.remove('dragging');
            this.draggedElement = null;
            this.draggedIndex = -1;
        });

        element.addEventListener('dragover', (e) => {
            e.preventDefault();
            const afterElement = this.getDragAfterElement(this.flowchart, e.clientY);
            if (afterElement) {
                this.flowchart.insertBefore(element, afterElement);
            } else {
                this.flowchart.appendChild(element);
            }
        });
    }

    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.flowchart-element:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;

            if (offset < 0 && offset > closest.offset) {
                return { offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    setupElementActions(elementDiv, element) {
        const editButton = elementDiv.querySelector('.edit');
        const deleteButton = elementDiv.querySelector('.delete');

        editButton.addEventListener('click', () => this.editElement(element));
        deleteButton.addEventListener('click', () => this.deleteElement(element));
    }

    editElement(element) {
        this.elementTitle.value = element.title;
        this.elementNote.value = element.note;
        this.elementTag.value = element.tags.join(', ');

        const elementDiv = this.flowchart.querySelector(`[data-id="${element.id}"]`);
        if (elementDiv) {
            elementDiv.remove();
        }

        this.elements = this.elements.filter(e => e.id !== element.id);
    }

    deleteElement(element) {
        if (confirm('この要素を削除しますか？')) {
            const elementDiv = this.flowchart.querySelector(`[data-id="${element.id}"]`);
            if (elementDiv) {
                elementDiv.remove();
            }
            this.elements = this.elements.filter(e => e.id !== element.id);
        }
    }

    clearInputs() {
        this.elementTitle.value = '';
        this.elementNote.value = '';
        this.elementTag.value = '';
    }

    exportJson() {
        const data = {
            elements: this.elements.map(element => ({
                ...element,
                position: Array.from(this.flowchart.children).indexOf(
                    this.flowchart.querySelector(`[data-id="${element.id}"]`)
                )
            }))
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'story_structure.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    exportText() {
        const text = this.elements
            .map((element, index) => {
                const position = Array.from(this.flowchart.children).indexOf(
                    this.flowchart.querySelector(`[data-id="${element.id}"]`)
                );
                return `${position + 1}. ${element.title}
${element.note ? `   メモ: ${element.note}` : ''}
${element.tags.length ? `   タグ: ${element.tags.join(', ')}` : ''}`;
            })
            .join('\n\n');

        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'story_structure.txt';
        a.click();
        URL.revokeObjectURL(url);
    }
}

// アプリケーションの初期化
document.addEventListener('DOMContentLoaded', () => {
    new StoryStructureApp();
});
