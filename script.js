class PomodoroTimer {
    constructor() {
        this.workTime = 25 * 60;
        this.restTime = 5 * 60;
        this.timeLeft = this.workTime;
        this.timerId = null;
        this.isRunning = false;
        this.isWorkMode = true;
        
        this.totalWorkSeconds = 0;
        this.totalRestSeconds = 0;
        this.statsVisible = false;
        this.toggleStatsButton = document.getElementById('toggleStats');
        this.statsContainer = document.querySelector('.stats');
        
        console.log('Toggle button:', this.toggleStatsButton);
        console.log('Stats container:', this.statsContainer);
        
        this.initializeElements();
        this.initializeEventListeners();
        this.updateDisplay();
        this.loadStats();
    }

    initializeElements() {
        this.minutesDisplay = document.getElementById('minutes');
        this.secondsDisplay = document.getElementById('seconds');
        this.startPauseButton = document.getElementById('startPause');
        this.resetButton = document.getElementById('reset');
        this.modeToggleButton = document.getElementById('modeToggle');
        this.resetStatsButton = document.getElementById('resetStats');
    }

    initializeEventListeners() {
        this.startPauseButton.addEventListener('click', () => this.toggleStartPause());
        this.resetButton.addEventListener('click', () => this.reset());
        this.modeToggleButton.addEventListener('click', () => this.toggleMode());
        this.toggleStatsButton.addEventListener('click', () => this.toggleStats());
        this.resetStatsButton.addEventListener('click', () => {
            if (confirm('Are you sure you want to reset all stats?')) {
                this.resetStats();
            }
        });
    }

    loadStats() {
        // Load saved stats from localStorage
        this.totalWorkSeconds = parseInt(localStorage.getItem('totalWorkSeconds')) || 0;
        this.totalRestSeconds = parseInt(localStorage.getItem('totalRestSeconds')) || 0;
        this.updateStatsDisplay();
    }

    saveStats() {
        // Save current stats to localStorage
        localStorage.setItem('totalWorkSeconds', this.totalWorkSeconds);
        localStorage.setItem('totalRestSeconds', this.totalRestSeconds);
    }

    toggleStats() {
        this.statsVisible = !this.statsVisible;
        this.statsContainer.hidden = false;
        this.statsContainer.classList.toggle('visible');
        this.toggleStatsButton.querySelector('.stats-text').textContent = 
            this.statsVisible ? 'Hide Stats' : 'Show Stats';
    }

    toggleStartPause() {
        if (this.isRunning) {
            this.pause();
            this.startPauseButton.textContent = 'Start';
            this.startPauseButton.classList.remove('pause');
        } else {
            this.start();
            this.startPauseButton.textContent = 'Pause';
            this.startPauseButton.classList.add('pause');
        }
    }

    toggleMode() {
        this.pause();
        this.isWorkMode = !this.isWorkMode;
        this.timeLeft = this.isWorkMode ? this.workTime : this.restTime;
        this.modeToggleButton.textContent = this.isWorkMode ? 'Switch to Rest' : 'Switch to Work';
        this.startPauseButton.textContent = 'Start';
        this.startPauseButton.classList.remove('pause');
        this.updateDisplay();
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.timerId = setInterval(() => {
                this.timeLeft--;
                this.updateDisplay();
                this.updateTotalTime();
                
                if (this.timeLeft === 0) {
                    this.pause();
                    this.startPauseButton.textContent = 'Start';
                    this.startPauseButton.classList.remove('pause');
                }
            }, 1000);
        }
    }

    pause() {
        this.isRunning = false;
        clearInterval(this.timerId);
    }

    reset() {
        this.pause();
        this.timeLeft = this.isWorkMode ? this.workTime : this.restTime;
        this.updateDisplay();
        this.startPauseButton.textContent = 'Start';
        this.startPauseButton.classList.remove('pause');
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.minutesDisplay.textContent = minutes.toString().padStart(2, '0');
        this.secondsDisplay.textContent = seconds.toString().padStart(2, '0');
    }

    updateTotalTime() {
        if (this.isRunning) {
            if (this.isWorkMode) {
                this.totalWorkSeconds++;
            } else {
                this.totalRestSeconds++;
            }
            this.updateStatsDisplay();
            this.saveStats();
        }
    }

    updateStatsDisplay() {
        document.getElementById('totalWorkTime').textContent = this.formatTime(this.totalWorkSeconds);
        document.getElementById('totalRestTime').textContent = this.formatTime(this.totalRestSeconds);
    }

    formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    resetStats() {
        this.totalWorkSeconds = 0;
        this.totalRestSeconds = 0;
        this.saveStats();
        this.updateStatsDisplay();
    }

    updateProgressRing() {
        const circle = document.querySelector('.progress-ring-circle');
        const circumference = 2 * Math.PI * 150; // 150 is the radius of the circle
        const totalTime = this.isWorkMode ? this.workTime : this.restTime;
        const progress = this.timeLeft / totalTime;
        const offset = circumference - (progress * circumference);
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = offset;
    }
}

const timer = new PomodoroTimer(); 