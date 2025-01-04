// Function to update the display of exercise stats
function updateDisplay5() {
    document.getElementById('dances-today').textContent = count3;
    document.getElementById('total-dances').textContent = totalDances;
    document.getElementById('dance-streak').textContent = streak2;
}

// Function to reset exercise data
function resetDanceData() {
    localStorage.removeItem('danceData');
    count3 = 0; // Reset global variables
    totalDances = 0;
    streak2 = 0;
    updateDisplay4(); // Update stats globally
    updateDisplay5(); // Ensure display is updated after reset
}

// Function to initialize event listeners
function initializeEventListeners() {
    document.getElementById('reset-dance-button').addEventListener('click', resetDanceData);
}

// Initialize event listeners and update display on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    updateDisplay4(); // Ensure stats are updated on load
    updateDisplay5(); // Ensure display is updated on load
});

