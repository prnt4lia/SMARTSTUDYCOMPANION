let chart;

async function fetchStats() {
    const response = await fetch('/stats');
    const data = await response.json();

    // Duration
    let minutes = Math.floor(data.duration / 60);
    let seconds = data.duration % 60;

    document.getElementById("duration").innerText =
        `${minutes}m ${seconds}s`;

    //  Fatigue count
    document.getElementById("fatigueCount").innerText =
        data.fatigue_count;

    // Chart
    updateChart(data.eye, data.mental);
}

function updateChart(eye, mental) {
    const ctx = document.getElementById('fatigueChart');

    if (chart) {
        chart.data.datasets[0].data = [eye, mental];
        chart.update();
        return;
    }

    chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Eye Fatigue', 'Mental Fatigue'],
            datasets: [{
                data: [eye, mental],
                backgroundColor: ['#38bdf8', '#facc15']
            }]
        }
    });
}

// Load once
fetchStats();