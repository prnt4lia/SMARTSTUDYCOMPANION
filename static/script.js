let lastAlert = null;

function showAlert(message) {
    const box = document.getElementById("alertBox");
    const text = document.getElementById("alertText");

    text.innerText = message;
    box.classList.remove("hidden");

    // Auto hide after 3 seconds
    setTimeout(() => {
        box.classList.add("hidden");
    }, 3000);
}

async function fetchFatigue() {
    const response = await fetch('/fatigue_status');
    const data = await response.json();

    const fatigue = data.fatigue;
    const severity = data.severity;

    document.getElementById("fatigue").innerText =
        fatigue || "No fatigue";

    document.getElementById("severity").innerText =
        severity ? "Severity: " + severity : "";

    document.getElementById("activity").innerText =
        data.recommendation.activity;

    document.getElementById("duration").innerText =
        data.recommendation.duration;

    // POPUP LOGIC
    if (fatigue && severity) {
        const currentAlert = fatigue + "-" + severity;

        if (currentAlert !== lastAlert) {
            showAlert(`${fatigue.replace("_", " ")} (${severity}) detected!`);
            lastAlert = currentAlert;
        }

        if (data.severity === "high") {
        pauseTimer();
        alert("Fatigue detected! Timer paused.");
        }
    }
}

setInterval(fetchFatigue, 1000);

// TIMER VARIABLES
let time = 25 * 60; // 25 minutes
let timer = null;
let running = false;

// Update display
function updateDisplay() {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;

    document.getElementById("timeDisplay").innerText =
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

//  START
function startTimer() {
    if (running) return;

    running = true;

    timer = setInterval(() => {
        if (time > 0) {
            time--;
            updateDisplay();
        } else {
            clearInterval(timer);
            running = false;
            alert("Time's up! Take a break.");
        }
    }, 1000);
}

// PAUSE
function pauseTimer() {
    clearInterval(timer);
    running = false;
}

// RESET
function resetTimer() {
    clearInterval(timer);
    running = false;
    time = 25 * 60;
    updateDisplay();
}

// Initialize
updateDisplay();