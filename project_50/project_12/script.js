class AudioRecorder {
    constructor() {
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.isRecording = false;
        this.recordings = [];

        // DOM要素
        this.recordButton = document.getElementById('recordButton');
        this.recordingStatus = document.getElementById('recordingStatus');
        this.recordingsList = document.getElementById('recordingsList');

        // イベントリスナー
        this.recordButton.addEventListener('click', () => this.toggleRecording());

        // 保存された録音を読み込む
        this.loadRecordings();
    }

    async toggleRecording() {
        if (!this.isRecording) {
            await this.startRecording();
        } else {
            this.stopRecording();
        }
    }

    async startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(stream);
            this.audioChunks = [];

            this.mediaRecorder.addEventListener('dataavailable', (event) => {
                this.audioChunks.push(event.data);
            });

            this.mediaRecorder.addEventListener('stop', () => {
                const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                const recording = {
                    id: Date.now(),
                    url: audioUrl,
                    date: new Date().toLocaleString()
                };
                this.recordings.push(recording);
                this.saveRecordings();
                this.updateRecordingsList();
            });

            this.mediaRecorder.start();
            this.isRecording = true;
            this.recordButton.textContent = '録音停止';
            this.recordButton.classList.add('recording');
            this.recordingStatus.textContent = '録音中...';
        } catch (error) {
            console.error('録音の開始に失敗しました:', error);
            alert('マイクへのアクセスが許可されていません。');
        }
    }

    stopRecording() {
        this.mediaRecorder.stop();
        this.isRecording = false;
        this.recordButton.textContent = '録音開始';
        this.recordButton.classList.remove('recording');
        this.recordingStatus.textContent = '';
    }

    playRecording(url) {
        const audio = new Audio(url);
        audio.play();
    }

    deleteRecording(id) {
        this.recordings = this.recordings.filter(recording => recording.id !== id);
        this.saveRecordings();
        this.updateRecordingsList();
    }

    updateRecordingsList() {
        this.recordingsList.innerHTML = '';
        this.recordings.forEach(recording => {
            const item = document.createElement('div');
            item.className = 'recording-item';
            item.innerHTML = `
                <div class="recording-info">
                    <div class="recording-date">${recording.date}</div>
                </div>
                <div class="recording-controls">
                    <button class="play-button" onclick="recorder.playRecording('${recording.url}')">再生</button>
                    <button class="delete-button" onclick="recorder.deleteRecording(${recording.id})">削除</button>
                </div>
            `;
            this.recordingsList.appendChild(item);
        });
    }

    saveRecordings() {
        const recordingsData = this.recordings.map(recording => ({
            id: recording.id,
            date: recording.date
        }));
        localStorage.setItem('recordings', JSON.stringify(recordingsData));
    }

    loadRecordings() {
        const savedRecordings = localStorage.getItem('recordings');
        if (savedRecordings) {
            const recordingsData = JSON.parse(savedRecordings);
            this.recordings = recordingsData;
            this.updateRecordingsList();
        }
    }
}

// レコーダーの初期化
const recorder = new AudioRecorder();
