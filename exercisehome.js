// Function to update the display of exercise stats
function updateDisplay3() {
    document.getElementById('exercise-count').textContent = count2;
    document.getElementById('total-exercises').textContent = totalExercises;
    document.getElementById('exercise-streak').textContent = streak;
}

// Function to reset exercise data
function resetExerciseData() {
    localStorage.removeItem('exerciseData');
    count2 = 0; // Reset global variables
    totalExercises = 0;
    streak = 0;
    updateDisplay2(); // Update stats globally
    updateDisplay3(); // Ensure display is updated after reset
}

// Function to initialize event listeners
function initializeEventListeners() {
    document.getElementById('reset-exercise-button').addEventListener('click', resetExerciseData);
}

// Initialize event listeners and update display on page load
document.addEventListener('DOMContentLoaded', () => {
    const resetButton = document.getElementById('reset-exercise-button');
    if (resetButton) {
        console.log('Reset button found and event listener attached.');
        resetButton.addEventListener('click', resetExerciseData);
    } else {
        console.error('Reset button not found!');
    }
    initializeEventListeners();
    updateDisplay2(); // Ensure stats are updated on load
    updateDisplay3(); // Ensure display is updated on load
});

