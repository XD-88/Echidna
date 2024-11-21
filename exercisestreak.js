// Global variables to store exercise stats
let count2 = 0;
let totalExercises = 0;
let streak = 0;

// Function to get today's date as a string (YYYY-MM-DD format)
function getTodayDate(currentDate) {
    if (!currentDate) currentDate = new Date(); // Default to current date if no argument is passed
    return currentDate.toISOString().split('T')[0];
}

// Function to log an exercise
function logExercise() {
    const today = getTodayDate();
    let exerciseData = JSON.parse(localStorage.getItem('exerciseData')) || {};

    // Update the exercise count for today
    if (!exerciseData[today]) {
        exerciseData[today] = 1;
    } else {
        exerciseData[today] += 1;
    }

    localStorage.setItem('exerciseData', JSON.stringify(exerciseData));
    updateDisplay2(); // Update stats globally
}

// Function to update and store exercise stats globally
function updateDisplay2() {
    const today = getTodayDate();
    let exerciseData = JSON.parse(localStorage.getItem('exerciseData')) || {};

    // Update today's exercise count
    count2 = exerciseData[today] || 0;

    // Calculate the exercise streak
    streak = 0;
    let currentDate = new Date(today);
    while (exerciseData[getTodayDate(currentDate)] !== undefined) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
    }

    // Calculate the total number of exercises
    totalExercises = Object.values(exerciseData).reduce((acc, value) => acc + value, 0);

    console.log('Updated stats:', { count2, totalExercises, streak }); // Log updated values
}
