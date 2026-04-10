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

    // 🚨 POPUP LOGIC
    if (fatigue && severity) {
        const currentAlert = fatigue + "-" + severity;

        if (currentAlert !== lastAlert) {
            showAlert(`${fatigue.replace("_", " ")} (${severity}) detected!`);
            lastAlert = currentAlert;
        }
    }
}

setInterval(fetchFatigue, 1000);