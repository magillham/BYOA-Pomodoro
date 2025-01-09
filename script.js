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
        
        this.initialTime = this.workTime;
        this.elapsedTime = 0;
        
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
        this.addFiveButton = document.getElementById('addFive');
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
        this.addFiveButton.addEventListener('click', () => this.addFiveMinutes());
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
            this.addFiveButton.disabled = true;
        } else {
            this.start();
            this.startPauseButton.textContent = 'Pause';
            this.startPauseButton.classList.add('pause');
            this.addFiveButton.disabled = false;
        }
    }

    toggleMode() {
        this.pause();
        this.isWorkMode = !this.isWorkMode;
        this.timeLeft = this.isWorkMode ? this.workTime : this.restTime;
        this.elapsedTime = 0;
        this.modeToggleButton.innerHTML = this.isWorkMode ? 'Break Time ♟️' : 'Get after it!';
        this.startPauseButton.textContent = 'Start';
        this.startPauseButton.classList.remove('pause');
        document.title = 'Focus Timer';
        this.updateDisplay();
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.timerId = setInterval(() => {
                this.timeLeft--;
                this.elapsedTime++;
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
        this.elapsedTime = 0;
        this.startPauseButton.textContent = 'Start';
        this.startPauseButton.classList.remove('pause');
        document.title = 'Focus Timer';
        this.updateDisplay();
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        // Update the display elements
        this.minutesDisplay.textContent = String(minutes).padStart(2, '0');
        this.secondsDisplay.textContent = String(seconds).padStart(2, '0');
        
        // Update the page title with current mode
        const mode = this.isWorkMode ? 'Work' : 'Rest';
        document.title = `${timeString} - ${mode} - Focus Timer`;
        
        // Update progress ring
        this.updateProgressRing();
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
        const circumference = 2 * Math.PI * 150;
        const totalTime = this.timeLeft + this.elapsedTime;
        const progress = this.timeLeft / totalTime;
        const offset = -(circumference - (progress * circumference));
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = offset;
    }

    addFiveMinutes() {
        this.timeLeft += 5 * 60;
        this.updateDisplay();
    }
}

const timer = new PomodoroTimer(); 