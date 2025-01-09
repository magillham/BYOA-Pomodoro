class PomodoroTimer {
    constructor() {
        this.workTime = 25 * 60;
        this.restTime = 5 * 60;
        this.timeLeft = this.workTime;
        this.timerId = null;
        this.isRunning = false;
        this.isWorkMode = true;
        
        this.initializeElements();
        this.initializeEventListeners();
        this.updateDisplay();
    }

    initializeElements() {
        this.minutesDisplay = document.getElementById('minutes');
        this.secondsDisplay = document.getElementById('seconds');
        this.startPauseButton = document.getElementById('startPause');
        this.resetButton = document.getElementById('reset');
        this.modeToggleButton = document.getElementById('modeToggle');
    }

    initializeEventListeners() {
        this.startPauseButton.addEventListener('click', () => this.toggleStartPause());
        this.resetButton.addEventListener('click', () => this.reset());
        this.modeToggleButton.addEventListener('click', () => this.toggleMode());
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